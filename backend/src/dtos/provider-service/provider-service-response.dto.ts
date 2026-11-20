export {
  ProviderServiceMapper,
  toProviderServiceResponse,
  toProviderServiceResponseList,
  toProviderServiceResponsePaginated,
} from '../../mappers/provider-service.mapper'

export interface ServiceLocationDto {
  type: string
  coordinates: number[]
  address?: string
  city?: string
  state?: string
  zipCode?: string
}

export interface ServiceAvailabilityDto {
  startDate: string
  endDate: string
}

export interface ProviderServiceResponseDto {
  _id: string
  title: string
  providerId: string
  category: string
  pricePerDay: number
  description: string
  location: ServiceLocationDto
  contact?: string
  availability: ServiceAvailabilityDto[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}
