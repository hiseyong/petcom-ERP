import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Expense } from '../../shared/types/domain'

interface ExpensesState {
  items: Expense[]
}

const initialState: ExpensesState = {
  items: [],
}

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setExpenses: (state, action: PayloadAction<Expense[]>) => {
      state.items = action.payload
    },
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.items.unshift(action.payload)
    },
  },
})

export const { setExpenses, addExpense } = expensesSlice.actions
export const expensesReducer = expensesSlice.reducer
