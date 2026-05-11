export type ReservationStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed'

export type PurchaseOrderStatus = 'ordered' | 'in_transit' | 'received' | 'delayed'

export type TaxDocumentKind = 'tax_invoice' | 'cash_receipt'

export type TaxDocumentStatus = 'issued' | 'cancelled' | 'pending'

export type ExpenseEvidence = 'tax_invoice' | 'card' | 'cash_receipt'

export type ExpenseCategory = 'rent' | 'utilities' | 'supplies' | 'communication' | 'equipment' | 'other'

export interface PageQuery {
  page: number
  pageSize: number
}

export interface SortQuery {
  field: string
  direction: 'asc' | 'desc'
}

export interface DateRange {
  from: string
  to: string
}
