import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { StaffMember, StaffRosterDay } from '../../shared/types/domain'

interface StaffState {
  members: StaffMember[]
  roster: StaffRosterDay[]
  calendarMonth: string
}

const initialState: StaffState = {
  members: [],
  roster: [],
  calendarMonth: '2026-05',
}

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setStaffMembers: (state, action: PayloadAction<StaffMember[]>) => {
      state.members = action.payload
    },
    setStaffRoster: (state, action: PayloadAction<StaffRosterDay[]>) => {
      state.roster = action.payload
    },
    upsertStaffRosterDay: (state, action: PayloadAction<StaffRosterDay>) => {
      const idx = state.roster.findIndex((r) => r.date === action.payload.date)
      if (idx >= 0) {
        state.roster[idx] = action.payload
      } else {
        state.roster.push(action.payload)
      }
      state.roster.sort((a, b) => a.date.localeCompare(b.date))
    },
    setStaffCalendarMonth: (state, action: PayloadAction<string>) => {
      state.calendarMonth = action.payload
    },
  },
})

export const { setStaffMembers, setStaffRoster, upsertStaffRosterDay, setStaffCalendarMonth } =
  staffSlice.actions
export const staffReducer = staffSlice.reducer
