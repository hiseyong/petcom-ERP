import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { TaxDocument } from '../../shared/types/domain'

interface TaxState {
  documents: TaxDocument[]
  reportMonth: string
}

const initialState: TaxState = {
  documents: [],
  reportMonth: '2026-05',
}

const taxSlice = createSlice({
  name: 'tax',
  initialState,
  reducers: {
    setTaxDocuments: (state, action: PayloadAction<TaxDocument[]>) => {
      state.documents = action.payload
    },
    setTaxReportMonth: (state, action: PayloadAction<string>) => {
      state.reportMonth = action.payload
    },
  },
})

export const { setTaxDocuments, setTaxReportMonth } = taxSlice.actions
export const taxReducer = taxSlice.reducer
