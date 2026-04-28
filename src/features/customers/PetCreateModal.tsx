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
import { petFormSchema, type PetFormValues } from '../../shared/schemas/customerPetSchema'
import type { Customer } from '../../shared/types/domain'

interface PetCreateModalProps {
  open: boolean
  onClose: () => void
  customers: Customer[]
  onSubmit: (values: PetFormValues) => void
}

export function PetCreateModal({ open, onClose, customers, onSubmit }: PetCreateModalProps) {
  const form = useForm<PetFormValues>({
    defaultValues: { customerId: '', name: '', species: 'dog', breed: '', age: 1, weightKg: 1 },
  })

  const submit = form.handleSubmit(async (values) => {
    await petFormSchema.validate(values)
    onSubmit(values)
    form.reset({ customerId: values.customerId, name: '', species: 'dog', breed: '', age: 1, weightKg: 1 })
    onClose()
  })

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>반려동물 등록</DialogTitle>
      <DialogContent>
        <Stack component="form" spacing={1.2} sx={{ mt: 0.5 }} onSubmit={submit}>
          <TextField select label="보호자" size="small" fullWidth {...form.register('customerId')}>
            {customers.map((customer) => (
              <MenuItem key={customer.id} value={customer.id}>
                {customer.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField label="반려동물명" size="small" fullWidth {...form.register('name')} />
          <TextField select label="종" size="small" fullWidth {...form.register('species')}>
            <MenuItem value="dog">강아지</MenuItem>
            <MenuItem value="cat">고양이</MenuItem>
          </TextField>
          <TextField label="품종" size="small" fullWidth {...form.register('breed')} />
          <TextField label="나이" size="small" type="number" fullWidth {...form.register('age', { valueAsNumber: true })} />
          <TextField label="체중(kg)" size="small" type="number" fullWidth {...form.register('weightKg', { valueAsNumber: true })} />
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
