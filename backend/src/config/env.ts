import * as dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV ?? 'development'}` })

import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).optional(),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  FRONTEND_URL: z.string().min(1, 'FRONTEND_URL is required'),
  PORT: z.string().optional(),
  COOKIE_MAX_AGE: z.string().optional(),
  REFRESH_TOKEN_COOKIE_MAX_AGE: z.string().optional(),
})

const parsed = envSchema.safeParse(process.env)
if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten())
  process.exit(1)
}

const rawEnv = parsed.data
const defaultCookieMaxAge = 7 * 24 * 60 * 60 * 1000 // 7 days in ms

export const env = {
  ...rawEnv,
  COOKIE_MAX_AGE: rawEnv.REFRESH_TOKEN_COOKIE_MAX_AGE
    ? parseInt(rawEnv.REFRESH_TOKEN_COOKIE_MAX_AGE, 10)
    : rawEnv.COOKIE_MAX_AGE
      ? parseInt(rawEnv.COOKIE_MAX_AGE, 10)
      : defaultCookieMaxAge,
}

export const PORT = env.PORT ? parseInt(env.PORT, 10) : 3000
