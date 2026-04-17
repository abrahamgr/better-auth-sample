import { z } from 'zod'

const EnvSchema = z.object({
  APP_URL: z.string().url().default('http://localhost:3000'),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, 'BETTER_AUTH_SECRET must be at least 32 characters.')
    .default('dev-only-better-auth-secret-32-chars'),
  BETTER_AUTH_URL: z.string().url().default('http://localhost:3000'),
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL is required.')
    .default(
      'postgresql://postgres:postgres@localhost:5432/better_auth_sample',
    ),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('info'),
  EMAIL_FROM: z
    .string()
    .min(1, 'EMAIL_FROM is required.')
    .default('Better Auth Sample <noreply@local.test>'),
  RESEND_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().min(1, 'SMTP_HOST is required.').default('127.0.0.1'),
  SMTP_PORT: z.coerce.number().int().positive().default(1025),
  SMTP_SECURE: z
    .union([z.boolean(), z.stringbool()])
    .transform((value) => Boolean(value))
    .default(false),
})

export const env = EnvSchema.parse({
  APP_URL: process.env.APP_URL ?? 'http://localhost:3000',
  BETTER_AUTH_SECRET:
    process.env.BETTER_AUTH_SECRET ?? 'dev-only-better-auth-secret-32-chars',
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  DATABASE_URL:
    process.env.DATABASE_URL ??
    'postgresql://postgres:postgres@localhost:5432/better_auth_sample',
  EMAIL_FROM:
    process.env.EMAIL_FROM ?? 'Better Auth Sample <noreply@local.test>',
  LOG_LEVEL: process.env.LOG_LEVEL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  SMTP_HOST: process.env.SMTP_HOST ?? '127.0.0.1',
  SMTP_PORT: process.env.SMTP_PORT ?? '1025',
  SMTP_SECURE: process.env.SMTP_SECURE ?? 'false',
})
