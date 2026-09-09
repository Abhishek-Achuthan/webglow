import * as z from 'zod';
import { PROVIDER_CATEGORIES } from '../constants/provider-categories.constant';

export const LocationSchema = z.object({
  type: z.literal('Point').default('Point'),
  coordinates: z.tuple([
    z.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180'),
    z.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90'),
  ]),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

export const AvailabilitySchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
}).refine((data) => new Date(data.startDate) < new Date(data.endDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const CreateProviderServiceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  category: z.enum(PROVIDER_CATEGORIES, {
    message: 'Please select a valid category',
  }),
  pricePerDay: z.coerce.number().min(0, 'Price cannot be negative'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: LocationSchema,
  contact: z.string().optional(),
  availability: z.array(AvailabilitySchema).optional(),
  isActive: z.boolean().default(true),
});

export type CreateProviderServiceFormData = z.infer<typeof CreateProviderServiceSchema>;

export const UpdateProviderServiceSchema = CreateProviderServiceSchema.partial();

export type UpdateProviderServiceFormData = z.infer<typeof UpdateProviderServiceSchema>;
