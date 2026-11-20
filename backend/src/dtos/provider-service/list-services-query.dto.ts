export interface ListServicesQueryDto {
  page?: string
  limit?: string
  category?: string
  minPrice?: string
  maxPrice?: string
  lat?: string
  lng?: string
  radiusKm?: string
  availableFrom?: string
  availableTo?: string
  search?: string
}
