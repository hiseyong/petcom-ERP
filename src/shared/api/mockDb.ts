import type {
  Customer,
  DashboardAlert,
  Payment,
  PetProfile,
  PurchaseOrder,
  Reservation,
  Expense,
  TaxDocument,
  StaffMember,
  StaffRosterDay,
} from '../types/domain'
import customersJson from './mock-data/customers.json'
import petsJson from './mock-data/pets.json'
import reservationsJson from './mock-data/reservations.json'
import paymentsJson from './mock-data/payments.json'
import purchaseOrdersJson from './mock-data/purchase-orders.json'
import dashboardAlertsJson from './mock-data/dashboard-alerts.json'
import taxDocumentsJson from './mock-data/tax-documents.json'
import expensesJson from './mock-data/expenses.json'
import staffMembersJson from './mock-data/staff-members.json'
import staffRosterJson from './mock-data/staff-roster.json'

export const customersSeed: Customer[] = customersJson as Customer[]
export const petsSeed: PetProfile[] = petsJson as PetProfile[]
export const reservationsSeed: Reservation[] = reservationsJson as Reservation[]
export const paymentsSeed: Payment[] = paymentsJson as Payment[]
export const purchaseOrdersSeed: PurchaseOrder[] = purchaseOrdersJson as PurchaseOrder[]
export const dashboardAlertsSeed: DashboardAlert[] = dashboardAlertsJson as DashboardAlert[]
export const taxDocumentsSeed: TaxDocument[] = taxDocumentsJson as TaxDocument[]
export const expensesSeed: Expense[] = expensesJson as Expense[]
export const staffMembersSeed: StaffMember[] = staffMembersJson as StaffMember[]
export const staffRosterSeed: StaffRosterDay[] = staffRosterJson as StaffRosterDay[]
