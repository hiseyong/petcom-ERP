import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Customer, HealthRecord, PetProfile } from '../../shared/types/domain'

interface CustomersState {
  customers: Customer[]
  pets: PetProfile[]
  selectedCustomerId: string | null
}

const initialState: CustomersState = {
  customers: [],
  pets: [],
  selectedCustomerId: null,
}

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setCustomersData: (
      state,
      action: PayloadAction<{ customers: Customer[]; pets: PetProfile[] }>,
    ) => {
      state.customers = action.payload.customers
      state.pets = action.payload.pets
      state.selectedCustomerId = action.payload.customers[0]?.id ?? null
    },
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.customers.push(action.payload)
    },
    addPet: (state, action: PayloadAction<PetProfile>) => {
      state.pets.push(action.payload)
    },
    addHealthRecord: (
      state,
      action: PayloadAction<{ petId: string; record: HealthRecord }>,
    ) => {
      state.pets = state.pets.map((pet) =>
        pet.id === action.payload.petId
          ? { ...pet, healthRecords: [...pet.healthRecords, action.payload.record] }
          : pet,
      )
    },
    setSelectedCustomerId: (state, action: PayloadAction<string>) => {
      state.selectedCustomerId = action.payload
    },
  },
})

export const { setCustomersData, addCustomer, addPet, addHealthRecord, setSelectedCustomerId } =
  customersSlice.actions

export const customersReducer = customersSlice.reducer
