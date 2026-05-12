import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import ChevronRight from '@mui/icons-material/ChevronRight'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { apiClient } from '../../shared/api/client'
import type { StaffMember, StaffRosterDay } from '../../shared/types/domain'
import { StaffDayEditModal } from './StaffDayEditModal'
import {
  setStaffCalendarMonth,
  setStaffMembers,
  setStaffRoster,
  upsertStaffRosterDay,
} from './staffSlice'

const WEEK_LABELS = ['일', '월', '화', '수', '목', '금', '토']

function addCalendarMonths(ym: string, delta: number) {
  const [y, m] = ym.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function formatMonthTitle(ym: string) {
  const [y, m] = ym.split('-').map(Number)
  return new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long' }).format(new Date(y, m - 1, 1))
}

function buildMonthGrid(ym: string): (string | null)[][] {
  const [ys, ms] = ym.split('-')
  const y = Number(ys)
  const mo = Number(ms)
  const first = new Date(y, mo - 1, 1)
  const lastDay = new Date(y, mo, 0).getDate()
  const startPad = first.getDay()
  const cells: (string | null)[] = []
  for (let i = 0; i < startPad; i++) cells.push(null)
  for (let d = 1; d <= lastDay; d++) {
    cells.push(`${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
  }
  while (cells.length % 7 !== 0) cells.push(null)
  const rows: (string | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7))
  return rows
}

function todayIsoLocal() {
  const t = new Date()
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}

function nameById(members: StaffMember[], id: string) {
  return members.find((m) => m.id === id)?.name ?? '—'
}

export function StaffingPage() {
  const dispatch = useAppDispatch()
  const { members, roster, calendarMonth } = useAppSelector((s) => s.staff)
  const [editingDate, setEditingDate] = useState<string | null>(null)
  const [todayStr] = useState(todayIsoLocal)

  useEffect(() => {
    if (members.length > 0) {
      return
    }
    const load = async () => {
      const data = await apiClient.loadBootstrapData()
      dispatch(setStaffMembers(data.staffMembers))
      dispatch(setStaffRoster(data.staffRoster))
    }
    void load()
  }, [dispatch, members.length])

  const rosterByDate = useMemo(() => {
    const m = new Map<string, StaffRosterDay>()
    for (const r of roster) {
      if (r.date.startsWith(calendarMonth)) {
        m.set(r.date, r)
      }
    }
    return m
  }, [roster, calendarMonth])

  const monthGrid = useMemo(() => buildMonthGrid(calendarMonth), [calendarMonth])

  const editingRoster = editingDate ? (roster.find((r) => r.date === editingDate) ?? null) : null

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h5">인력 관리</Typography>
        <Typography variant="body2" color="text.secondary">
          월별 캘린더에서 일자별 근무 담당과 당직을 확인하고, 셀을 눌러 수정할 수 있습니다.
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        <IconButton
          aria-label="이전 달"
          onClick={() => dispatch(setStaffCalendarMonth(addCalendarMonths(calendarMonth, -1)))}
        >
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6" sx={{ minWidth: 160, textAlign: 'center' }}>
          {formatMonthTitle(calendarMonth)}
        </Typography>
        <IconButton
          aria-label="다음 달"
          onClick={() => dispatch(setStaffCalendarMonth(addCalendarMonths(calendarMonth, 1)))}
        >
          <ChevronRight />
        </IconButton>
        <Stack direction="row" spacing={1} sx={{ ml: { sm: 2 } }}>
          <Chip size="small" label="당직" color="error" variant="outlined" />
          <Chip size="small" label="일별 담당" color="primary" variant="outlined" />
        </Stack>
      </Stack>

      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} sx={{ alignItems: 'flex-start' }}>
        <Card sx={{ flex: 1, width: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              근무 캘린더
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                gap: 0.75,
                mb: 0.75,
              }}
            >
              {WEEK_LABELS.map((w) => (
                <Typography
                  key={w}
                  variant="caption"
                  sx={{
                    textAlign: 'center',
                    fontWeight: 700,
                    color: w === '일' ? 'error.main' : w === '토' ? 'primary.main' : 'text.secondary',
                  }}
                >
                  {w}
                </Typography>
              ))}
            </Box>
            {monthGrid.map((week, wi) => (
              <Box
                key={wi}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                  gap: 0.75,
                  mb: 0.75,
                }}
              >
                {week.map((date, di) => {
                  if (!date) {
                    return <Box key={`pad-${wi}-${di}`} sx={{ minHeight: { xs: 72, sm: 100 } }} />
                  }
                  const row = rosterByDate.get(date)
                  const dutyName = row ? nameById(members, row.dutyStaffId) : null
                  const assignedNames = row
                    ? row.assignedStaffIds.map((id) => nameById(members, id)).filter(Boolean)
                    : []
                  const isToday = date === todayStr
                  const dow = new Date(`${date}T12:00:00`).getDay()
                  const isSun = dow === 0
                  const isSat = dow === 6
                  const tip = row?.notes ? `${row.notes}` : '클릭하여 편집'

                  return (
                    <Tooltip key={date} title={tip}>
                      <Button
                        variant="outlined"
                        onClick={() => setEditingDate(date)}
                        sx={{
                          minHeight: { xs: 72, sm: 100 },
                          p: 0.75,
                          flexDirection: 'column',
                          alignItems: 'stretch',
                          justifyContent: 'flex-start',
                          textAlign: 'left',
                          borderRadius: 2,
                          borderColor: isToday ? 'primary.main' : 'rgba(130, 142, 180, 0.35)',
                          bgcolor: isToday ? 'rgba(91,108,255,0.06)' : 'background.paper',
                          '&:hover': { bgcolor: 'rgba(91,108,255,0.1)' },
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 700,
                            color: isSun ? 'error.main' : isSat ? 'primary.main' : 'text.primary',
                          }}
                        >
                          {Number(date.slice(8))}
                        </Typography>
                        {dutyName ? (
                          <Chip
                            size="small"
                            label={`당 ${dutyName}`}
                            color="error"
                            variant="outlined"
                            sx={{ mt: 0.5, height: 22, '& .MuiChip-label': { px: 0.75, fontSize: 11 } }}
                          />
                        ) : (
                          <Typography variant="caption" color="text.disabled" sx={{ mt: 0.25 }}>
                            당직 미정
                          </Typography>
                        )}
                        {assignedNames.length > 0 ? (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 0.5, lineHeight: 1.25 }}
                            noWrap
                          >
                            담: {assignedNames.join(', ')}
                          </Typography>
                        ) : (
                          <Typography variant="caption" color="text.disabled" sx={{ mt: 0.25 }} noWrap>
                            담당 미정
                          </Typography>
                        )}
                      </Button>
                    </Tooltip>
                  )
                })}
              </Box>
            ))}
          </CardContent>
        </Card>

        <Card sx={{ width: '100%', maxWidth: { lg: 300 }, flexShrink: 0 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              직원
            </Typography>
            <Stack spacing={1.25}>
              {members.map((m) => (
                <Box
                  key={m.id}
                  sx={{
                    py: 1,
                    px: 1.25,
                    borderRadius: 2,
                    border: '1px solid rgba(130, 142, 180, 0.2)',
                    bgcolor: 'rgba(255,255,255,0.7)',
                  }}
                >
                  <Typography variant="subtitle2">{m.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {m.role}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <StaffDayEditModal
        key={editingDate ?? 'closed'}
        open={editingDate !== null}
        date={editingDate}
        members={members}
        rosterDay={editingRoster}
        onClose={() => setEditingDate(null)}
        onSave={(row) => dispatch(upsertStaffRosterDay(row))}
      />
    </Stack>
  )
}
