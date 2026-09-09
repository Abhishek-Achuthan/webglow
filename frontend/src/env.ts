import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url({ message: 'VITE_API_URL must be a valid URL' }),
});

// Validate process.env / import.meta.env
const parsedEnv = envSchema.safeParse({
  VITE_API_URL: import.meta.env.VITE_API_URL,
});

if (!parsedEnv.success) {
  console.error('Invalid environment variables:', parsedEnv.error.format());
  throw new Error('Invalid environment variables');
}

export const env = parsedEnv.data;
