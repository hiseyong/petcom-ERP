import * as yup from 'yup'

export const customerFormSchema = yup.object({
  name: yup.string().required('고객명은 필수입니다.'),
  phone: yup.string().required('전화번호는 필수입니다.'),
  email: yup.string().email('이메일 형식이 올바르지 않습니다.').required('이메일은 필수입니다.'),
  memo: yup.string().max(200, '메모는 200자 이내로 입력해주세요.').default(''),
})

export const petFormSchema = yup.object({
  customerId: yup.string().required('보호자를 선택해주세요.'),
  name: yup.string().required('반려동물명은 필수입니다.'),
  species: yup.mixed<'dog' | 'cat'>().oneOf(['dog', 'cat']).required(),
  breed: yup.string().required('품종은 필수입니다.'),
  age: yup.number().min(0).max(40).required('나이는 필수입니다.'),
  weightKg: yup.number().min(0.1).max(120).required('체중은 필수입니다.'),
})

export const healthRecordSchema = yup.object({
  date: yup.string().required('기록 일자는 필수입니다.'),
  type: yup.mixed<'vaccination' | 'checkup'>().oneOf(['vaccination', 'checkup']).required(),
  detail: yup.string().required('상세 내용은 필수입니다.'),
})

export type CustomerFormValues = yup.InferType<typeof customerFormSchema>
export type PetFormValues = yup.InferType<typeof petFormSchema>
export type HealthRecordFormValues = yup.InferType<typeof healthRecordSchema>
