import type {
  Customer,
  DashboardAlert,
  Payment,
  PetProfile,
  PurchaseOrder,
  Reservation,
  TaxDocument,
  TaxExpense,
} from '../types/domain'
import customersJson from './mock-data/customers.json'
import petsJson from './mock-data/pets.json'
import reservationsJson from './mock-data/reservations.json'
import paymentsJson from './mock-data/payments.json'
import purchaseOrdersJson from './mock-data/purchase-orders.json'
import dashboardAlertsJson from './mock-data/dashboard-alerts.json'
import taxDocumentsJson from './mock-data/tax-documents.json'
import taxExpensesJson from './mock-data/tax-expenses.json'

export const customersSeed: Customer[] = customersJson as Customer[]
export const petsSeed: PetProfile[] = petsJson as PetProfile[]
export const reservationsSeed: Reservation[] = reservationsJson as Reservation[]
export const paymentsSeed: Payment[] = paymentsJson as Payment[]
export const purchaseOrdersSeed: PurchaseOrder[] = purchaseOrdersJson as PurchaseOrder[]
export const dashboardAlertsSeed: DashboardAlert[] = dashboardAlertsJson as DashboardAlert[]
export const taxDocumentsSeed: TaxDocument[] = taxDocumentsJson as TaxDocument[]
export const taxExpensesSeed: TaxExpense[] = taxExpensesJson as TaxExpense[]
