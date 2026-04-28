import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Reservation, } from '../../shared/types/domain'
import type { ReservationStatus } from '../../shared/types/common'

interface ReservationsState {
  items: Reservation[]
  statusFilter: ReservationStatus | 'all'
}

const initialState: ReservationsState = {
  items: [],
  statusFilter: 'all',
}

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    setReservations: (state, action: PayloadAction<Reservation[]>) => {
      state.items = action.payload
    },
    addReservation: (state, action: PayloadAction<Reservation>) => {
      state.items.unshift(action.payload)
    },
    updateReservation: (state, action: PayloadAction<Reservation>) => {
      state.items = state.items.map((item) => (item.id === action.payload.id ? action.payload : item))
    },
    updateReservationStatus: (
      state,
      action: PayloadAction<{ id: string; status: ReservationStatus }>,
    ) => {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? { ...item, status: action.payload.status } : item,
      )
    },
    setReservationFilter: (state, action: PayloadAction<ReservationStatus | 'all'>) => {
      state.statusFilter = action.payload
    },
  },
})

export const {
  setReservations,
  addReservation,
  updateReservation,
  updateReservationStatus,
  setReservationFilter,
} = reservationsSlice.actions

export const reservationsReducer = reservationsSlice.reducer
