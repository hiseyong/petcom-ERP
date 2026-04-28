import { useEffect, useMemo } from 'react'
import { Box, Card, CardContent, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { apiClient } from '../../shared/api/client'
import type { Payment } from '../../shared/types/domain'
import { setPayments, setPeriod } from './salesSlice'

const periodLabels = {
  daily: '일간',
  weekly: '주간',
  monthly: '월간',
} as const

export function SalesPage() {
  const dispatch = useAppDispatch()
  const { payments, period } = useAppSelector((state) => state.sales)

  useEffect(() => {
    if (payments.length > 0) {
      return
    }
    const load = async () => {
      const data = await apiClient.loadBootstrapData()
      dispatch(setPayments(data.payments))
    }
    void load()
  }, [dispatch, payments.length])

  const columns = useMemo<GridColDef<Payment>[]>(
    () => [
      { field: 'date', headerName: '일자', flex: 0.8, minWidth: 110 },
      { field: 'customerName', headerName: '고객', flex: 1, minWidth: 120 },
      { field: 'petName', headerName: '반려동물', flex: 0.9, minWidth: 100 },
      { field: 'serviceName', headerName: '서비스', flex: 1.2, minWidth: 140 },
      {
        field: 'amount',
        headerName: '금액',
        flex: 0.9,
        minWidth: 110,
        valueFormatter: (value) => `${Number(value).toLocaleString()}원`,
      },
      { field: 'method', headerName: '결제수단', flex: 0.8, minWidth: 100 },
      { field: 'manager', headerName: '담당자', flex: 0.8, minWidth: 100 },
    ],
    [],
  )

  const totals = useMemo(() => {
    const total = payments.reduce((acc, payment) => acc + payment.amount, 0)
    const byService = payments.reduce<Record<string, number>>((acc, payment) => {
      acc[payment.serviceName] = (acc[payment.serviceName] ?? 0) + payment.amount
      return acc
    }, {})
    const topService = Object.entries(byService).sort((a, b) => b[1] - a[1])[0]
    return { total, avg: payments.length ? Math.round(total / payments.length) : 0, topService }
  }, [payments])

  return (
    <Stack spacing={3}>
      <Typography variant="h5">결제 및 매출 관리</Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              {periodLabels[period]} 총 매출
            </Typography>
            <Typography variant="h5">{totals.total.toLocaleString()}원</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              평균 결제 금액
            </Typography>
            <Typography variant="h5">{totals.avg.toLocaleString()}원</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              최고 매출 서비스
            </Typography>
            <Typography variant="h6">
              {totals.topService ? `${totals.topService[0]} (${totals.topService[1].toLocaleString()}원)` : '-'}
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      <Card>
        <CardContent>
          <Stack direction="row" sx={{ mb: 1.5, justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">결제 이력</Typography>
            <TextField
              select
              size="small"
              label="집계 기준"
              value={period}
              onChange={(event) => dispatch(setPeriod(event.target.value as 'daily' | 'weekly' | 'monthly'))}
              sx={{ width: 140 }}
            >
              <MenuItem value="daily">일간</MenuItem>
              <MenuItem value="weekly">주간</MenuItem>
              <MenuItem value="monthly">월간</MenuItem>
            </TextField>
          </Stack>
          <Box sx={{ height: 420 }}>
            <DataGrid
              rows={payments}
              columns={columns}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
            />
          </Box>
        </CardContent>
      </Card>
    </Stack>
  )
}
