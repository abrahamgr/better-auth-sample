import { createHash } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { Client } from 'pg'

const connectionString =
  process.env.DATABASE_URL ??
  'postgresql://postgres:postgres@localhost:5432/better_auth_sample'

const drizzleDir = join(import.meta.dir, '..', 'drizzle')

async function main() {
  const client = new Client({ connectionString })
  await client.connect()

  await client.query(`
    CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
      "id" text PRIMARY KEY,
      "name" text NOT NULL,
      "applied_at" timestamp DEFAULT now() NOT NULL
    )
  `)

  const applied = new Set(
    (
      await client.query<{
        id: string
      }>('SELECT id FROM "__drizzle_migrations"')
    ).rows.map((row) => row.id),
  )

  const files = (await readdir(drizzleDir))
    .filter((file) => file.endsWith('.sql'))
    .sort((left, right) => left.localeCompare(right))

  for (const file of files) {
    const sql = await readFile(join(drizzleDir, file), 'utf8')
    const id = createHash('sha256').update(sql).digest('hex')

    if (applied.has(id)) {
      continue
    }

    const statements = sql
      .split('--> statement-breakpoint')
      .map((statement) => statement.trim())
      .filter(Boolean)

    await client.query('BEGIN')

    try {
      for (const statement of statements) {
        await client.query(statement)
      }

      await client.query(
        'INSERT INTO "__drizzle_migrations" ("id", "name") VALUES ($1, $2)',
        [id, file],
      )
      await client.query('COMMIT')
      console.log(`Applied migration ${file}`)
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    }
  }

  console.log('Database migrations are up to date.')
  await client.end()
}

main().catch((error) => {
  console.error('Migration failed.')
  console.error(error)
  process.exit(1)
})
