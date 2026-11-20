export interface ServiceLocationInputDto {
  type?: 'Point'
  coordinates: number[]
  address?: string
  city?: string
  state?: string
  zipCode?: string
}

export interface ServiceAvailabilityInputDto {
  startDate: string
  endDate: string
}

export interface CreateProviderServiceDto {
  title: string
  category: string
  pricePerDay: number
  description: string
  location: ServiceLocationInputDto
  contact?: string
  availability?: ServiceAvailabilityInputDto[]
  isActive?: boolean
}
