import { z } from 'zod'
import { ROLES } from '../../constants/roles.constant'

export const registerUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(ROLES).optional(),
})

export type RegisterUserDto = z.infer<typeof registerUserSchema>
