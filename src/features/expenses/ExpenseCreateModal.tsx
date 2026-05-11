import { useForm } from 'react-hook-form'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'
import { expenseFormSchema, type ExpenseFormValues } from '../../shared/schemas/expenseSchema'
import type { Expense } from '../../shared/types/domain'

interface ExpenseCreateModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (expense: Expense) => void
}

const evidenceOptions: Array<{ value: Expense['evidence']; label: string }> = [
  { value: 'tax_invoice', label: '세금계산서' },
  { value: 'card', label: '카드' },
  { value: 'cash_receipt', label: '현금영수증' },
]

const categoryOptions: Array<{ value: Expense['category']; label: string }> = [
  { value: 'rent', label: '임차료' },
  { value: 'utilities', label: '수도·전기·가스' },
  { value: 'supplies', label: '소모품·재고' },
  { value: 'communication', label: '통신' },
  { value: 'equipment', label: '장비·도구' },
  { value: 'other', label: '기타' },
]

function splitVatInclusive(total: number) {
  const supplyAmount = Math.round(total / 1.1)
  const vatAmount = total - supplyAmount
  return { supplyAmount, vatAmount }
}

let nextExpenseId = 1

export function ExpenseCreateModal({ open, onClose, onSubmit }: ExpenseCreateModalProps) {
  const form = useForm<ExpenseFormValues>({
    defaultValues: {
      bookedDate: new Date().toISOString().slice(0, 10),
      vendorName: '',
      description: '',
      totalAmount: '',
      evidence: 'card',
      category: 'other',
    },
  })

  const submit = form.handleSubmit(async (values) => {
    try {
      await expenseFormSchema.validate(values, { abortEarly: false })
      const total = Number(values.totalAmount)
      const { supplyAmount, vatAmount } = splitVatInclusive(total)
      const expense: Expense = {
        id: `exp-${nextExpenseId++}`,
        bookedDate: values.bookedDate,
        vendorName: values.vendorName.trim(),
        description: values.description.trim(),
        supplyAmount,
        vatAmount,
        totalAmount: total,
        evidence: values.evidence,
        category: values.category,
      }
      onSubmit(expense)
      form.reset({
        bookedDate: new Date().toISOString().slice(0, 10),
        vendorName: '',
        description: '',
        totalAmount: '',
        evidence: 'card',
        category: 'other',
      })
      onClose()
    } catch {
      form.setError('root', { message: '입력값을 확인해주세요.' })
    }
  })

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>지출 등록</DialogTitle>
      <DialogContent>
        <Stack component="form" spacing={1.2} sx={{ mt: 0.5 }} onSubmit={submit}>
          <TextField
            label="지출일"
            type="date"
            size="small"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            error={Boolean(form.formState.errors.bookedDate)}
            helperText={form.formState.errors.bookedDate?.message}
            {...form.register('bookedDate')}
          />
          <TextField
            label="공급처"
            size="small"
            fullWidth
            error={Boolean(form.formState.errors.vendorName)}
            helperText={form.formState.errors.vendorName?.message}
            {...form.register('vendorName')}
          />
          <TextField
            label="적요"
            size="small"
            fullWidth
            error={Boolean(form.formState.errors.description)}
            helperText={form.formState.errors.description?.message}
            {...form.register('description')}
          />
          <TextField
            label="합계 금액(원, 부가세 포함)"
            size="small"
            fullWidth
            inputMode="numeric"
            error={Boolean(form.formState.errors.totalAmount)}
            helperText={form.formState.errors.totalAmount?.message}
            {...form.register('totalAmount')}
          />
          <TextField
            select
            label="증빙"
            size="small"
            fullWidth
            error={Boolean(form.formState.errors.evidence)}
            helperText={form.formState.errors.evidence?.message}
            {...form.register('evidence')}
          >
            {evidenceOptions.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="분류"
            size="small"
            fullWidth
            error={Boolean(form.formState.errors.category)}
            helperText={form.formState.errors.category?.message}
            {...form.register('category')}
          >
            {categoryOptions.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </TextField>
          {form.formState.errors.root?.message ? (
            <Alert severity="error">{form.formState.errors.root.message}</Alert>
          ) : null}
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
