import { customersSeed, paymentsSeed, petsSeed, reservationsSeed } from './mockDb'

const delay = async (ms = 100) => {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

export const apiClient = {
  async loadBootstrapData() {
    await delay()
    return {
      customers: customersSeed,
      pets: petsSeed,
      reservations: reservationsSeed,
      payments: paymentsSeed,
    }
  },
}
