import { createUserContainer, UserDependencies } from './user.container'
import {
  createProviderServiceContainer,
  ProviderServiceDependencies,
} from './provider-service.container'
import {
  createBookingContainer,
  BookingDependencies,
} from './booking.container'

export interface AppContainer {
  user: UserDependencies
  providerService: ProviderServiceDependencies
  booking: BookingDependencies
}

export function createAppContainer(): AppContainer {
  const user = createUserContainer()
  const providerService = createProviderServiceContainer()
  const booking = createBookingContainer(providerService.providerServiceService)

  return {
    user,
    providerService,
    booking,
  }
}

export const container = createAppContainer()

// Re-export resolved dependencies for direct consumption
export const {
  userRepository,
  encryptionService,
  userService,
  userController,
} = container.user

export const {
  providerServiceRepository,
  providerServiceService,
  providerServiceController,
} = container.providerService

export const {
  bookingRepository,
  bookingService,
  bookingController,
} = container.booking

export * from './user.container'
export * from './provider-service.container'
export * from './booking.container'
