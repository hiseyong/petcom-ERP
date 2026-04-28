import { useForm } from 'react-hook-form'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material'
import { customerFormSchema, type CustomerFormValues } from '../../shared/schemas/customerPetSchema'

interface CustomerCreateModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: CustomerFormValues) => void
}

export function CustomerCreateModal({ open, onClose, onSubmit }: CustomerCreateModalProps) {
  const form = useForm<CustomerFormValues>({
    defaultValues: { name: '', phone: '', email: '', memo: '' },
  })

  const submit = form.handleSubmit(async (values) => {
    await customerFormSchema.validate(values)
    onSubmit(values)
    form.reset()
    onClose()
  })

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>고객 등록</DialogTitle>
      <DialogContent>
        <Stack component="form" spacing={1.2} sx={{ mt: 0.5 }} onSubmit={submit}>
          <TextField label="고객명" size="small" fullWidth {...form.register('name')} />
          <TextField label="연락처" size="small" fullWidth {...form.register('phone')} />
          <TextField label="이메일" size="small" fullWidth {...form.register('email')} />
          <TextField label="메모" size="small" fullWidth {...form.register('memo')} />
          <button type="submit" hidden />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>취소</Button>
        <Button variant="contained" onClick={() => void submit()}>
          저장
        </Button>
      </DialogActions>
    </Dialog>
  )
}
