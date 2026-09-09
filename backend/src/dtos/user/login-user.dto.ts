import { z } from 'zod'

export const loginUserSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginUserDto = z.infer<typeof loginUserSchema>
