import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Payment } from '../../shared/types/domain'

interface SalesState {
  payments: Payment[]
  period: 'daily' | 'weekly' | 'monthly'
}

const initialState: SalesState = {
  payments: [],
  period: 'monthly',
}

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    setPayments: (state, action: PayloadAction<Payment[]>) => {
      state.payments = action.payload
    },
    setPeriod: (state, action: PayloadAction<'daily' | 'weekly' | 'monthly'>) => {
      state.period = action.payload
    },
  },
})

export const { setPayments, setPeriod } = salesSlice.actions
export const salesReducer = salesSlice.reducer
