import { defineConfig } from 'drizzle-kit'

import { env } from './app/lib/env.server'

export default defineConfig({
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  dialect: 'postgresql',
  out: './drizzle',
  schema: './app/lib/db/auth-schema.ts',
  strict: true,
})
