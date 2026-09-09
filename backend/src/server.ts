import * as dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV ?? 'development'}` })

import { z } from 'zod'
import mongoose from 'mongoose'
import { createApp } from './app'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).optional(),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  FRONTEND_URL: z.string().min(1, 'FRONTEND_URL is required'),
  PORT: z.string().optional(),
})

const parsed = envSchema.safeParse(process.env)
if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten())
  process.exit(1)
}

const env = parsed.data
const PORT = env.PORT ? parseInt(env.PORT, 10) : 3000

async function main(): Promise<void> {
  await mongoose.connect(env.MONGODB_URI)
  console.log('Connected to MongoDB')

  const app = createApp()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${env.NODE_ENV ?? 'development'} mode`)
  })
}

main().catch((err) => {
  console.error('Error during startup:', err)
  process.exit(1)
})
