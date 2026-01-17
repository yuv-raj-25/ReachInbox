import { z } from 'zod'
import dotenv from 'dotenv'

// Load environment variables BEFORE validation
// This ensures .env is loaded even with ES module import hoisting
dotenv.config({ path: './.env' })

const envSchema = z.object({
  PORT: z.string().default('4000'),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
//   GOOGLE_CLIENT_ID: z.string(),

  MAX_EMAILS_PER_HOUR: z.string(),
  EMAIL_DELAY_MS: z.string(),
  WORKER_CONCURRENCY: z.string()
})

export const env = envSchema.parse(process.env)

