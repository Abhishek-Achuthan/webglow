import { z } from 'zod'

export const listServicesQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  lat: z.string().optional(),
  lng: z.string().optional(),
  radiusKm: z.string().optional(),
  availableFrom: z.string().optional(),
  availableTo: z.string().optional(),
  search: z.string().optional(),
})

export type ListServicesQueryDto = z.infer<typeof listServicesQuerySchema>
