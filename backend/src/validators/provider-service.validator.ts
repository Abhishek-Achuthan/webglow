import { z } from 'zod'
import { PROVIDER_CATEGORIES } from '../constants/provider-categories.constant'

const locationSchema = z.object({
  type: z.enum(['Point']).default('Point').optional(),
  coordinates: z.array(z.number()).min(2, 'Coordinates must have at least 2 elements'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
})

const availabilitySchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
})

export const createProviderServiceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.enum(PROVIDER_CATEGORIES as unknown as [string, ...string[]]),
  pricePerDay: z.number().positive('Price per day must be positive'),
  description: z.string().min(1, 'Description is required'),
  location: locationSchema,
  contact: z.string().optional(),
  availability: z.array(availabilitySchema).optional(),
  isActive: z.boolean().optional(),
})

export const updateProviderServiceSchema = createProviderServiceSchema.partial()

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
