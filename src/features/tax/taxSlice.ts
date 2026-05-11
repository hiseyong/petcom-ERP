import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { TaxDocument, TaxExpense } from '../../shared/types/domain'

interface TaxState {
  documents: TaxDocument[]
  expenses: TaxExpense[]
  reportMonth: string
}

const initialState: TaxState = {
  documents: [],
  expenses: [],
  reportMonth: '2026-05',
}

const taxSlice = createSlice({
  name: 'tax',
  initialState,
  reducers: {
    setTaxDocuments: (state, action: PayloadAction<TaxDocument[]>) => {
      state.documents = action.payload
    },
    setTaxExpenses: (state, action: PayloadAction<TaxExpense[]>) => {
      state.expenses = action.payload
    },
    setTaxReportMonth: (state, action: PayloadAction<string>) => {
      state.reportMonth = action.payload
    },
  },
})

export const { setTaxDocuments, setTaxExpenses, setTaxReportMonth } = taxSlice.actions
export const taxReducer = taxSlice.reducer
