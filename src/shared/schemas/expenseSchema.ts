import * as yup from 'yup'
import type { ExpenseCategory, ExpenseEvidence } from '../types/common'

export const expenseFormSchema = yup.object({
  bookedDate: yup.string().required('지출일은 필수입니다.'),
  vendorName: yup.string().required('공급처를 입력해주세요.'),
  description: yup.string().required('적요를 입력해주세요.'),
  totalAmount: yup
    .string()
    .required('합계 금액은 필수입니다.')
    .matches(/^\d+$/, '숫자만 입력해주세요.')
    .test('min', '1원 이상 입력해주세요.', (v) => (v ? Number(v) > 0 : false)),
  evidence: yup
    .mixed<ExpenseEvidence>()
    .oneOf(['tax_invoice', 'card', 'cash_receipt'], '증빙 유형을 선택해주세요.')
    .required(),
  category: yup
    .mixed<ExpenseCategory>()
    .oneOf(['rent', 'utilities', 'supplies', 'communication', 'equipment', 'other'], '분류를 선택해주세요.')
    .required(),
})

export type ExpenseFormValues = yup.InferType<typeof expenseFormSchema>
