import { z } from 'zod'
import { createProviderServiceSchema } from './create-provider-service.dto'

export const updateProviderServiceSchema = createProviderServiceSchema.partial()

export type UpdateProviderServiceDto = z.infer<typeof updateProviderServiceSchema>
