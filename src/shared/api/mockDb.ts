import type { Customer, Payment, PetProfile, Reservation } from '../types/domain'

export const customersSeed: Customer[] = [
  { id: 'c1', name: '김지은', phone: '010-1234-5566', email: 'jieun@pet.com', memo: '피부 민감' },
  { id: 'c2', name: '박도현', phone: '010-8899-4433', email: 'dohyeon@pet.com' },
]

export const petsSeed: PetProfile[] = [
  {
    id: 'p1',
    customerId: 'c1',
    name: '콩이',
    species: 'dog',
    breed: '푸들',
    age: 4,
    weightKg: 5.8,
    healthRecords: [{ id: 'h1', date: '2026-04-05', type: 'vaccination', detail: '종합백신 5차' }],
  },
  {
    id: 'p2',
    customerId: 'c2',
    name: '나비',
    species: 'cat',
    breed: '코리안숏헤어',
    age: 2,
    weightKg: 3.9,
    healthRecords: [{ id: 'h2', date: '2026-04-20', type: 'checkup', detail: '정기 검진 정상' }],
  },
]

export const reservationsSeed: Reservation[] = [
  {
    id: 'r1',
    date: '2026-04-29',
    time: '10:00',
    customerId: 'c1',
    customerName: '김지은',
    petId: 'p1',
    petName: '콩이',
    serviceName: '목욕',
    staffName: '트리머A',
    status: 'confirmed',
    notes: '귀 청소 요청',
  },
  {
    id: 'r2',
    date: '2026-04-29',
    time: '14:00',
    customerId: 'c2',
    customerName: '박도현',
    petId: 'p2',
    petName: '나비',
    serviceName: '건강 체크',
    staffName: '수의사B',
    status: 'pending',
  },
]

export const paymentsSeed: Payment[] = [
  {
    id: 'pay1',
    date: '2026-04-25',
    customerName: '김지은',
    petName: '콩이',
    serviceName: '미용 패키지',
    amount: 85000,
    method: 'card',
    manager: '매니저1',
  },
  {
    id: 'pay2',
    date: '2026-04-26',
    customerName: '박도현',
    petName: '나비',
    serviceName: '건강 체크',
    amount: 50000,
    method: 'transfer',
    manager: '매니저2',
  },
]
