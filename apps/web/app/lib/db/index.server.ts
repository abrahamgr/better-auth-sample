import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './auth-schema'
import { pool } from './pool.server'

export const db = drizzle(pool, { schema })
