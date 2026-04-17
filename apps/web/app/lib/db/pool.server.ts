import { Pool } from 'pg'

import { env } from '../env.server'

declare global {
  var __betterAuthSamplePool: Pool | undefined
}

export const pool =
  globalThis.__betterAuthSamplePool ??
  new Pool({
    connectionString: env.DATABASE_URL,
    max: 10,
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__betterAuthSamplePool = pool
}
