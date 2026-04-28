import { configureStore } from '@reduxjs/toolkit'
import { reservationsReducer } from '../features/reservations/reservationsSlice'
import { customersReducer } from '../features/customers/customersSlice'
import { salesReducer } from '../features/sales/salesSlice'

export const store = configureStore({
  reducer: {
    reservations: reservationsReducer,
    customers: customersReducer,
    sales: salesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
