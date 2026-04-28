export type ReservationStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed'

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
