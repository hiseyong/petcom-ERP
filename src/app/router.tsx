import { Navigate, createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { ReservationsPage } from '../features/reservations/ReservationsPage'
import { CustomersPage } from '../features/customers/CustomersPage'
import { SalesPage } from '../features/sales/SalesPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/reservations" replace /> },
      { path: 'reservations', element: <ReservationsPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'sales', element: <SalesPage /> },
    ],
  },
])
