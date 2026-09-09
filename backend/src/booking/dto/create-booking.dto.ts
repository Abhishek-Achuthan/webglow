import { z } from 'zod'

export const createBookingSchema = z.object({
  serviceId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
})

export type CreateBookingDto = z.infer<typeof createBookingSchema>
