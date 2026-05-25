import { z } from 'zod'

const EnvSchema = z.object({
  APP_URL: z.string().url(),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, 'BETTER_AUTH_SECRET must be at least 32 characters.'),
  BETTER_AUTH_URL: z.string().url(),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required.'),
  LOG_LEVEL: z.enum([
    'fatal',
    'error',
    'warn',
    'info',
    'debug',
    'trace',
    'silent',
  ]),
  EMAIL_FROM: z.string().min(1, 'EMAIL_FROM is required.'),
  RESEND_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().min(1, 'SMTP_HOST is required.'),
  SMTP_PORT: z.coerce.number().int().positive(),
  SMTP_SECURE: z
    .union([z.boolean(), z.stringbool()])
    .transform((value) => Boolean(value)),
})

export const env = EnvSchema.parse({
  APP_URL: process.env.APP_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  EMAIL_FROM: process.env.EMAIL_FROM,
  LOG_LEVEL: process.env.LOG_LEVEL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_SECURE: process.env.SMTP_SECURE,
})
