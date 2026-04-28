import * as yup from 'yup'

export const reservationFormSchema = yup.object({
  date: yup.string().required('예약 날짜는 필수입니다.'),
  time: yup.string().required('예약 시간은 필수입니다.'),
  customerName: yup.string().required('고객명은 필수입니다.'),
  petName: yup.string().required('반려동물명은 필수입니다.'),
  serviceName: yup.string().required('서비스명은 필수입니다.'),
  staffName: yup.string().required('담당자명은 필수입니다.'),
  notes: yup.string().max(200, '메모는 200자 이내로 입력해주세요.').default(''),
})

export type ReservationFormValues = yup.InferType<typeof reservationFormSchema>
