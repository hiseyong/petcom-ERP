import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
} from '@mui/material'
import { reservationFormSchema, type ReservationFormValues } from '../../shared/schemas/reservationSchema'
import type { Reservation } from '../../shared/types/domain'

interface ReservationEditModalProps {
  open: boolean
  reservation: Reservation | null
  onClose: () => void
  onSubmit: (values: ReservationFormValues) => void
}

export function ReservationEditModal({
  open,
  reservation,
  onClose,
  onSubmit,
}: ReservationEditModalProps) {
  const form = useForm<ReservationFormValues>({
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
    if (!reservation || !open) {
      return
    }
    form.reset({
      date: reservation.date,
      time: reservation.time,
      customerName: reservation.customerName,
      petName: reservation.petName,
      serviceName: reservation.serviceName,
      staffName: reservation.staffName,
      notes: reservation.notes ?? '',
    })
  }, [form, open, reservation])

  const submit = form.handleSubmit(async (values) => {
    try {
      await reservationFormSchema.validate(values, { abortEarly: false })
      onSubmit(values)
      onClose()
    } catch {
      form.setError('root', { message: '입력값을 확인해주세요.' })
    }
  })

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>예약 변경</DialogTitle>
      <DialogContent>
        <Stack component="form" spacing={2} sx={{ mt: 0.5 }} onSubmit={submit}>
          <Grid container spacing={1.2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="date"
                label="날짜"
                slotProps={{ inputLabel: { shrink: true } }}
                error={Boolean(form.formState.errors.date)}
                helperText={form.formState.errors.date?.message}
                {...form.register('date')}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="time"
                label="시간"
                slotProps={{ inputLabel: { shrink: true } }}
                error={Boolean(form.formState.errors.time)}
                helperText={form.formState.errors.time?.message}
                {...form.register('time')}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="고객명"
                error={Boolean(form.formState.errors.customerName)}
                helperText={form.formState.errors.customerName?.message}
                {...form.register('customerName')}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="반려동물명"
                error={Boolean(form.formState.errors.petName)}
                helperText={form.formState.errors.petName?.message}
                {...form.register('petName')}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="서비스명"
                error={Boolean(form.formState.errors.serviceName)}
                helperText={form.formState.errors.serviceName?.message}
                {...form.register('serviceName')}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="담당자"
                error={Boolean(form.formState.errors.staffName)}
                helperText={form.formState.errors.staffName?.message}
                {...form.register('staffName')}
              />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label="메모" {...form.register('notes')} />
            </Grid>
          </Grid>
          {form.formState.errors.root?.message ? (
            <Alert severity="error">{form.formState.errors.root.message}</Alert>
          ) : null}
          <button type="submit" hidden />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>취소</Button>
        <Button variant="contained" onClick={() => void submit()}>
          변경 저장
        </Button>
      </DialogActions>
    </Dialog>
  )
}
