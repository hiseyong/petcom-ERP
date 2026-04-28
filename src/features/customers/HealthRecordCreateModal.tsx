import { useForm } from 'react-hook-form'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'
import { healthRecordSchema, type HealthRecordFormValues } from '../../shared/schemas/customerPetSchema'

interface HealthRecordCreateModalProps {
  open: boolean
  onClose: () => void
  disabled?: boolean
  onSubmit: (values: HealthRecordFormValues) => void
}

export function HealthRecordCreateModal({
  open,
  onClose,
  disabled = false,
  onSubmit,
}: HealthRecordCreateModalProps) {
  const form = useForm<HealthRecordFormValues>({
    defaultValues: { date: '', type: 'checkup', detail: '' },
  })

  const submit = form.handleSubmit(async (values) => {
    await healthRecordSchema.validate(values)
    onSubmit(values)
    form.reset({ date: '', type: 'checkup', detail: '' })
    onClose()
  })

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>건강/접종 이력 추가</DialogTitle>
      <DialogContent>
        <Stack component="form" spacing={1.2} sx={{ mt: 0.5 }} onSubmit={submit}>
          <TextField
            size="small"
            type="date"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            label="기록일"
            {...form.register('date')}
          />
          <TextField select label="유형" size="small" fullWidth {...form.register('type')}>
            <MenuItem value="vaccination">접종</MenuItem>
            <MenuItem value="checkup">검진</MenuItem>
          </TextField>
          <TextField label="상세내용" size="small" fullWidth {...form.register('detail')} />
          <button type="submit" hidden />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>취소</Button>
        <Button variant="contained" onClick={() => void submit()} disabled={disabled}>
          저장
        </Button>
      </DialogActions>
    </Dialog>
  )
}
