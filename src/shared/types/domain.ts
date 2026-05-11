import type {
  ExpenseCategory,
  ExpenseEvidence,
  PurchaseOrderStatus,
  ReservationStatus,
  TaxDocumentKind,
  TaxDocumentStatus,
} from './common'

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

export interface PurchaseOrder {
  id: string
  orderedAt: string
  supplierName: string
  itemSummary: string
  status: PurchaseOrderStatus
  expectedDate: string
}

export interface DashboardAlert {
  id: string
  title: string
  message: string
  severity: 'info' | 'warning' | 'success'
  createdAt: string
}

export interface TaxDocument {
  id: string
  issueDate: string
  kind: TaxDocumentKind
  counterpartyName: string
  supplyAmount: number
  vatAmount: number
  totalAmount: number
  status: TaxDocumentStatus
}

export interface Expense {
  id: string
  bookedDate: string
  vendorName: string
  description: string
  supplyAmount: number
  vatAmount: number
  totalAmount: number
  evidence: ExpenseEvidence
  category: ExpenseCategory
}
