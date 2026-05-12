import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { apiClient } from '../../shared/api/client'
import type { PurchaseOrderStatus } from '../../shared/types/common'
import type { DashboardAlert, PurchaseOrder, Reservation } from '../../shared/types/domain'
import { setReservations } from '../reservations/reservationsSlice'

const tenantInfo = {
  companyName: '언타이틀드',
  representative: '이재민',
  businessNo: '123-45-67890',
  address: '서울특별시 강남구 테헤란로 123, 5층',
  phone: '02-1234-5678',
  email: 'admin@popocare.co.kr',
}

const infoRows = [
  { label: '상호명', value: tenantInfo.companyName },
  { label: '대표자', value: tenantInfo.representative },
  { label: '사업자번호', value: tenantInfo.businessNo },
  { label: '주소', value: tenantInfo.address },
  { label: '대표 연락처', value: tenantInfo.phone },
  { label: '대표 이메일', value: tenantInfo.email },
]

const purchaseStatusLabels: Record<PurchaseOrderStatus, string> = {
  ordered: '발주 완료',
  in_transit: '배송 중',
  received: '입고 완료',
  delayed: '지연',
}

const purchaseStatusColor: Record<
  PurchaseOrderStatus,
  'default' | 'primary' | 'success' | 'warning' | 'error'
> = {
  ordered: 'default',
  in_transit: 'primary',
  received: 'success',
  delayed: 'warning',
}

const alertSeverityColor: Record<DashboardAlert['severity'], 'default' | 'info' | 'warning' | 'success'> = {
  info: 'info',
  warning: 'warning',
  success: 'success',
}

function reservationSortKey(r: Reservation) {
  return `${r.date}T${r.time}:00`
}

function formatShortDate(isoDate: string) {
  return new Intl.DateTimeFormat('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' }).format(
    new Date(`${isoDate}T12:00:00`),
  )
}

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

function reservationStartMs(r: Reservation) {
  return new Date(`${r.date}T${r.time}:00`).getTime()
}

const DEFAULT_SLOT_MS = 90 * 60 * 1000
const TASK_HORIZON_MS = 7 * 24 * 60 * 60 * 1000

interface HomeTask {
  id: string
  sortTime: number
  title: string
  subtitle: string
  meta: string
  to?: string
  chipLabel: string
  chipColor: 'default' | 'primary' | 'warning' | 'error' | 'info' | 'success'
}

function buildHomeTasks(
  now: Date,
  reservations: Reservation[],
  purchaseOrders: PurchaseOrder[],
  alerts: DashboardAlert[],
): HomeTask[] {
  const nowMs = now.getTime()
  const tasks: HomeTask[] = []

  for (const po of purchaseOrders) {
    if (po.status === 'delayed') {
      const sortTime = new Date(`${po.expectedDate}T00:00:00`).getTime()
      tasks.push({
        id: `po-delayed-${po.id}`,
        sortTime,
        title: '지연 발주 확인',
        subtitle: `${po.supplierName} — ${po.itemSummary}`,
        meta: `입고 예정 ${formatShortDate(po.expectedDate)}`,
        chipLabel: '지연',
        chipColor: 'error',
      })
    }
  }

  for (const r of reservations) {
    if (r.status === 'pending') {
      tasks.push({
        id: `res-pending-${r.id}`,
        sortTime: reservationStartMs(r),
        title: '신규 예약 확정 처리',
        subtitle: `${r.customerName} · ${r.petName} — ${r.serviceName}`,
        meta: `${formatShortDate(r.date)} ${r.time} · ${r.staffName}`,
        to: '/reservations',
        chipLabel: '대기',
        chipColor: 'warning',
      })
    }
  }

  for (const r of reservations) {
    if (r.status !== 'confirmed') continue
    const start = reservationStartMs(r)
    if (start + DEFAULT_SLOT_MS <= nowMs) continue
    if (start > nowMs + TASK_HORIZON_MS) continue
    tasks.push({
      id: `res-confirmed-${r.id}`,
      sortTime: start,
      title: '예약 일정',
      subtitle: `${r.customerName} · ${r.petName} — ${r.serviceName}`,
      meta: `${formatShortDate(r.date)} ${r.time} · ${r.staffName}`,
      to: '/reservations',
      chipLabel: '예정',
      chipColor: 'primary',
    })
  }

  for (const po of purchaseOrders) {
    if (po.status === 'received' || po.status === 'delayed') continue
    const sortTime = new Date(`${po.expectedDate}T09:00:00`).getTime()
    tasks.push({
      id: `po-active-${po.id}`,
      sortTime,
      title: '입고·발주 확인',
      subtitle: `${po.supplierName} — ${po.itemSummary}`,
      meta: `${purchaseStatusLabels[po.status]} · 입고 예정 ${formatShortDate(po.expectedDate)}`,
      chipLabel: purchaseStatusLabels[po.status],
      chipColor: purchaseStatusColor[po.status],
    })
  }

  for (const a of alerts) {
    if (a.severity === 'success') continue
    tasks.push({
      id: `alert-${a.id}`,
      sortTime: new Date(a.createdAt).getTime(),
      title: a.title,
      subtitle: a.message,
      meta: formatDateTime(a.createdAt),
      chipLabel: a.severity === 'warning' ? '주의' : '안내',
      chipColor: alertSeverityColor[a.severity],
    })
  }

  tasks.sort((a, b) => {
    if (a.sortTime !== b.sortTime) return a.sortTime - b.sortTime
    return a.id.localeCompare(b.id)
  })

  return tasks
}

export function HomePage() {
  const dispatch = useAppDispatch()
  const reservationItems = useAppSelector((s) => s.reservations.items)
  const [now, setNow] = useState(() => new Date())
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [dashboardAlerts, setDashboardAlerts] = useState<DashboardAlert[]>([])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const load = async () => {
      const data = await apiClient.loadBootstrapData()
      if (reservationItems.length === 0) {
        dispatch(setReservations(data.reservations))
      }
      setPurchaseOrders(data.purchaseOrders)
      setDashboardAlerts(data.dashboardAlerts)
    }
    void load()
  }, [dispatch, reservationItems.length])

  const formattedNow = useMemo(
    () =>
      new Intl.DateTimeFormat('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(now),
    [now],
  )

  const formattedDate = useMemo(
    () =>
      new Intl.DateTimeFormat('ko-KR', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }).format(now),
    [now],
  )

  const greetingMessage = useMemo(() => {
    const hour = now.getHours()
    if (hour < 6) return '좋은 새벽입니다'
    if (hour < 12) return '좋은 아침입니다'
    if (hour < 18) return '좋은 오후입니다'
    return '좋은 저녁입니다'
  }, [now])

  const pendingReservations = useMemo(() => {
    const pending = reservationItems.filter((r) => r.status === 'pending')
    return [...pending].sort((a, b) => reservationSortKey(b).localeCompare(reservationSortKey(a)))
  }, [reservationItems])

  const orderedTasks = useMemo(
    () => buildHomeTasks(now, reservationItems, purchaseOrders, dashboardAlerts),
    [now, reservationItems, purchaseOrders, dashboardAlerts],
  )

  const taskList =
    orderedTasks.length === 0 ? (
      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
        현재 표시할 할 일이 없습니다.
      </Typography>
    ) : (
      orderedTasks.slice(0, 40).map((task) => {
        const inner = (
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              py: 1.75,
              alignItems: 'flex-start',
              ...(task.to
                ? {
                    cursor: 'pointer',
                    borderRadius: 1,
                    mx: -1,
                    px: 1,
                    transition: 'background-color 120ms ease',
                    '&:hover': { bgcolor: 'rgba(91, 108, 255, 0.06)' },
                  }
                : {}),
            }}
          >
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                <Typography variant="subtitle2">{task.title}</Typography>
                <Chip label={task.chipLabel} size="small" color={task.chipColor} variant="outlined" sx={{ height: 22 }} />
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {task.subtitle}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {task.meta}
              </Typography>
            </Box>
            {task.to ? (
              <ChevronRightIcon sx={{ color: 'text.disabled', flexShrink: 0, mt: 0.25 }} fontSize="small" />
            ) : null}
          </Stack>
        )
        return task.to ? (
          <Link key={task.id} to={task.to} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            {inner}
          </Link>
        ) : (
          <Box key={task.id}>{inner}</Box>
        )
      })
    )

  return (
    <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Stack spacing={3}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                안녕하세요, {tenantInfo.companyName}님.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                오늘도 반려동물 케어 운영을 더 쉽고 빠르게 관리해보세요.
              </Typography>
              <Stack sx={{ mt: 4, alignItems: 'center', textAlign: 'center' }}>
                <Typography
                  sx={{
                    fontSize: { xs: 56, md: 88 },
                    lineHeight: 1,
                    fontWeight: 700,
                    letterSpacing: '-0.04em',
                    color: 'text.primary',
                  }}
                >
                  {formattedNow}
                </Typography>
                <Typography sx={{ mt: 1, color: 'text.secondary', letterSpacing: '0.01em' }}>
                  {formattedDate}
                </Typography>
                <Typography
                  sx={{
                    mt: 2.5,
                    fontSize: { xs: 22, md: 28 },
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {greetingMessage}, {tenantInfo.companyName}님.
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">신규 예약</Typography>
                <Chip label={`대기 ${pendingReservations.length}건`} size="small" color="warning" variant="outlined" />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                확정 대기 중인 예약입니다.
              </Typography>
              <Stack divider={<Divider flexItem />} spacing={1.5} sx={{ flex: 1, minHeight: 120 }}>
                {pendingReservations.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    대기 중인 신규 예약이 없습니다.
                  </Typography>
                ) : (
                  pendingReservations.slice(0, 5).map((r) => (
                    <Box key={r.id}>
                      <Typography variant="caption" color="text.secondary">
                        {formatShortDate(r.date)} · {r.time}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ mt: 0.25 }}>
                        {r.customerName} · {r.petName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {r.serviceName} · {r.staffName}
                      </Typography>
                    </Box>
                  ))
                )}
              </Stack>
              <Button component={Link} to="/reservations" variant="outlined" size="small" fullWidth>
                예약 관리로 이동
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
              <Typography variant="h6">발주 현황</Typography>
              <Typography variant="body2" color="text.secondary">
                최근 발주 및 입고 일정입니다.
              </Typography>
              <Stack divider={<Divider flexItem />} spacing={1.5} sx={{ flex: 1, minHeight: 120 }}>
                {purchaseOrders.slice(0, 5).map((po) => (
                  <Stack
                    key={po.id}
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle2" noWrap title={po.supplierName}>
                        {po.supplierName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }} noWrap title={po.itemSummary}>
                        {po.itemSummary}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        입고 예정 {formatShortDate(po.expectedDate)}
                      </Typography>
                    </Box>
                    <Chip
                      label={purchaseStatusLabels[po.status]}
                      size="small"
                      color={purchaseStatusColor[po.status]}
                      sx={{ flexShrink: 0 }}
                    />
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
              <Typography variant="h6">기타 알림</Typography>
              <Typography variant="body2" color="text.secondary">
                운영·재고·일정 관련 안내입니다.
              </Typography>
              <Stack divider={<Divider flexItem />} spacing={1.5} sx={{ flex: 1, minHeight: 120 }}>
                {dashboardAlerts.map((a) => (
                  <Box key={a.id}>
                    <Stack direction="row" spacing={1} sx={{ mb: 0.5, alignItems: 'center' }}>
                      <Chip label={a.severity === 'warning' ? '주의' : a.severity === 'success' ? '완료' : '안내'} size="small" color={alertSeverityColor[a.severity]} variant="outlined" />
                      <Typography variant="subtitle2">{a.title}</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {a.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      {formatDateTime(a.createdAt)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                고객사 정보
              </Typography>
              <Grid container spacing={2}>
                {infoRows.map((row) => (
                  <Grid key={row.label} size={{ xs: 12, md: 6 }}>
                    <Stack
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid rgba(130, 142, 180, 0.2)',
                        bgcolor: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {row.label}
                      </Typography>
                      <Typography variant="body1">{row.value}</Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card
          sx={{
            position: { xs: 'static', md: 'sticky' },
            top: { md: 88 },
            width: '100%',
            maxHeight: { xs: 400, md: 'calc(100vh - 96px)' },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <CardContent
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              minHeight: 0,
              overflow: 'hidden',
            }}
          >
            <Typography variant="h6">해야 할 일</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              기준 {formattedNow} · 시각 순
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box
              component="section"
              role="region"
              aria-label="해야 할 일 목록"
              sx={{
                overflowY: 'auto',
                flex: 1,
                minHeight: 0,
                pr: 0.5,
                mx: -0.5,
                px: 0.5,
              }}
            >
              <Stack divider={<Divider flexItem />} spacing={0}>
                {taskList}
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
