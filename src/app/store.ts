import { configureStore } from '@reduxjs/toolkit'
import { reservationsReducer } from '../features/reservations/reservationsSlice'
import { customersReducer } from '../features/customers/customersSlice'
import { salesReducer } from '../features/sales/salesSlice'
import { taxReducer } from '../features/tax/taxSlice'

export const store = configureStore({
  reducer: {
    reservations: reservationsReducer,
    customers: customersReducer,
    sales: salesReducer,
    tax: taxReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
