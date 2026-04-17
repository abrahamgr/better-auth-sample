import { drizzle } from 'drizzle-orm/node-postgres'

import { pool } from './pool.server'

export const db = drizzle(pool)
