import type { ReservationStatus } from './common'

export interface Reservation {
  id: string
  date: string
  time: string
  customerId: string
  customerName: string
  petId: string
  petName: string
  serviceName: string
  staffName: string
  status: ReservationStatus
  notes?: string
}

export interface Customer {
  id: string
  name: string
  phone: string
  email: string
  memo?: string
}

export interface HealthRecord {
  id: string
  date: string
  type: 'vaccination' | 'checkup'
  detail: string
}

export interface PetProfile {
  id: string
  customerId: string
  name: string
  species: 'dog' | 'cat'
  breed: string
  age: number
  weightKg: number
  healthRecords: HealthRecord[]
}

export interface Payment {
  id: string
  date: string
  customerName: string
  petName: string
  serviceName: string
  amount: number
  method: 'card' | 'cash' | 'transfer'
  manager: string
}
