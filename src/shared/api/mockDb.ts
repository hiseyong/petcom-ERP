import type { Customer, Payment, PetProfile, Reservation } from '../types/domain'
import customersJson from './mock-data/customers.json'
import petsJson from './mock-data/pets.json'
import reservationsJson from './mock-data/reservations.json'
import paymentsJson from './mock-data/payments.json'

export const customersSeed: Customer[] = customersJson as Customer[]
export const petsSeed: PetProfile[] = petsJson as PetProfile[]
export const reservationsSeed: Reservation[] = reservationsJson as Reservation[]
export const paymentsSeed: Payment[] = paymentsJson as Payment[]
