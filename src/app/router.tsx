import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { HomePage } from '../features/home/HomePage'
import { ReservationsPage } from '../features/reservations/ReservationsPage'
import { CustomersPage } from '../features/customers/CustomersPage'
import { SalesPage } from '../features/sales/SalesPage'
import { TaxPage } from '../features/tax/TaxPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'reservations', element: <ReservationsPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'sales', element: <SalesPage /> },
      { path: 'tax', element: <TaxPage /> },
    ],
  },
])
