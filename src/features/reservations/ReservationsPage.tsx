import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { apiClient } from '../../shared/api/client'
import type { ReservationStatus } from '../../shared/types/common'
import type { Reservation } from '../../shared/types/domain'
import {
  addReservation,
  setReservationFilter,
  setReservations,
  updateReservationStatus,
} from './reservationsSlice'
import { reservationFormSchema, type ReservationFormValues } from '../../shared/schemas/reservationSchema'

const statusOptions: Array<{ value: ReservationStatus; label: string }> = [
  { value: 'pending', label: '대기' },
  { value: 'confirmed', label: '확정' },
  { value: 'completed', label: '완료' },
  { value: 'cancelled', label: '취소' },
]

export function ReservationsPage() {
  const dispatch = useAppDispatch()
  const { items, statusFilter } = useAppSelector((state) => state.reservations)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<ReservationFormValues>({
    defaultValues: {
      date: '',
      time: '',
      customerName: '',
      petName: '',
      serviceName: '',
      staffName: '',
      notes: '',
    },
  })

  useEffect(() => {
    if (items.length > 0) {
      return
    }
    const load = async () => {
      const data = await apiClient.loadBootstrapData()
      dispatch(setReservations(data.reservations))
    }
    void load()
  }, [dispatch, items.length])

  const filteredRows = useMemo(
    () => (statusFilter === 'all' ? items : items.filter((item) => item.status === statusFilter)),
    [items, statusFilter],
  )

  const groupedCalendar = useMemo(() => {
    const groups = new Map<string, Reservation[]>()
    for (const item of filteredRows) {
      const rows = groups.get(item.date) ?? []
      rows.push(item)
      groups.set(item.date, rows)
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [filteredRows])

  const columns = useMemo<GridColDef<Reservation>[]>(
    () => [
      { field: 'date', headerName: '일자', flex: 0.8, minWidth: 110 },
      { field: 'time', headerName: '시간', flex: 0.6, minWidth: 90 },
      { field: 'customerName', headerName: '고객', flex: 1, minWidth: 120 },
      { field: 'petName', headerName: '반려동물', flex: 0.9, minWidth: 110 },
      { field: 'serviceName', headerName: '서비스', flex: 1, minWidth: 130 },
      { field: 'staffName', headerName: '담당자', flex: 0.8, minWidth: 100 },
      { field: 'status', headerName: '상태', flex: 0.8, minWidth: 100 },
      {
        field: 'actions',
        headerName: '변경',
        sortable: false,
        filterable: false,
        width: 180,
        renderCell: (params) => (
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              onClick={() =>
                dispatch(updateReservationStatus({ id: params.row.id, status: 'completed' }))
              }
            >
              완료
            </Button>
            <Button
              size="small"
              color="warning"
              onClick={() =>
                dispatch(updateReservationStatus({ id: params.row.id, status: 'cancelled' }))
              }
            >
              취소
            </Button>
          </Stack>
        ),
      },
    ],
    [dispatch],
  )

  const onSubmit = handleSubmit(async (values) => {
    try {
      await reservationFormSchema.validate(values, { abortEarly: false })
      dispatch(
        addReservation({
          id: crypto.randomUUID(),
          customerId: values.customerName,
          petId: values.petName,
          status: 'confirmed',
          ...values,
        }),
      )
      reset()
    } catch {
      setError('root', { message: '입력값을 확인해주세요.' })
    }
  })

  return (
    <Stack spacing={3}>
      <Typography variant="h5">예약 관리</Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            예약 등록/변경
          </Typography>
          <Box component="form" onSubmit={onSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="날짜"
                  slotProps={{ inputLabel: { shrink: true } }}
                  error={Boolean(errors.date)}
                  helperText={errors.date?.message}
                  {...register('date')}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                  fullWidth
                  type="time"
                  label="시간"
                  slotProps={{ inputLabel: { shrink: true } }}
                  error={Boolean(errors.time)}
                  helperText={errors.time?.message}
                  {...register('time')}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <TextField fullWidth label="고객명" error={Boolean(errors.customerName)} helperText={errors.customerName?.message} {...register('customerName')} />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <TextField fullWidth label="반려동물명" error={Boolean(errors.petName)} helperText={errors.petName?.message} {...register('petName')} />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <TextField fullWidth label="서비스명" error={Boolean(errors.serviceName)} helperText={errors.serviceName?.message} {...register('serviceName')} />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <TextField fullWidth label="담당자" error={Boolean(errors.staffName)} helperText={errors.staffName?.message} {...register('staffName')} />
              </Grid>
              <Grid size={12}>
                <TextField fullWidth label="메모" {...register('notes')} />
              </Grid>
            </Grid>
            <Stack direction="row" sx={{ mt: 2, justifyContent: 'space-between' }}>
              <TextField
                select
                size="small"
                label="상태 필터"
                value={statusFilter}
                onChange={(event) =>
                  dispatch(setReservationFilter(event.target.value as ReservationStatus | 'all'))
                }
                sx={{ width: 170 }}
              >
                <MenuItem value="all">전체</MenuItem>
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <Button type="submit" variant="contained">
                예약 저장
              </Button>
            </Stack>
            {errors.root?.message ? (
              <Alert sx={{ mt: 2 }} severity="error">
                {errors.root.message}
              </Alert>
            ) : null}
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            예약 캘린더(일자별 현황)
          </Typography>
          <Stack spacing={1.5}>
            {groupedCalendar.map(([date, rows]) => (
              <Box key={date} sx={{ border: '1px solid #e0e0e0', borderRadius: 1.5, p: 1.5 }}>
                <Typography variant="subtitle1">{date}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {rows.map((row) => `${row.time} ${row.petName}(${row.serviceName})`).join(' / ')}
                </Typography>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            예약 현황 테이블
          </Typography>
          <Box sx={{ height: 420 }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Stack>
  )
}
