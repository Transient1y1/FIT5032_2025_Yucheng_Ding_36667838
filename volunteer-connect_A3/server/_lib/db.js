import { neon } from '@neondatabase/serverless'
import { hashPassword } from './security.js'
import { seedOpportunities } from './seed.js'

let schemaPromise

export function getSql() {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.NEON_DATABASE_URL
  return connectionString ? neon(connectionString) : null
}

export function isDatabaseConfigured() { return Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.NEON_DATABASE_URL) }

export async function prepareDatabase(sql) {
  if (!schemaPromise) schemaPromise = createSchema(sql).catch((error) => { schemaPromise = null; throw error })
  await schemaPromise
  await seedDatabase(sql)
}

async function createSchema(sql) {
  const statements = [`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'volunteer' CHECK (role IN ('volunteer', 'coordinator', 'admin')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`, `
    CREATE TABLE IF NOT EXISTS opportunities (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`, `
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      opportunity_id TEXT NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
      availability TEXT NOT NULL,
      skills_notes TEXT NOT NULL DEFAULT '',
      motivation TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ,
      UNIQUE(user_id, opportunity_id)
    )`, `
    CREATE TABLE IF NOT EXISTS ratings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      opportunity_id TEXT NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
      score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, opportunity_id)
    )`, `
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      opportunity_id TEXT NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
      booking_date DATE NOT NULL,
      status TEXT NOT NULL DEFAULT 'confirmed',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, opportunity_id, booking_date)
    )`,
  ]
  for (const statement of statements) await sql.query(statement)
}

async function seedDatabase(sql) {
  const opportunities = await sql.query('SELECT COUNT(*)::int AS count FROM opportunities')
  if (opportunities[0]?.count === 0) {
    for (const opportunity of seedOpportunities) await sql.query('INSERT INTO opportunities (id, data) VALUES ($1, $2::jsonb) ON CONFLICT (id) DO NOTHING', [opportunity.id, JSON.stringify(opportunity)])
  }
  const coordinator = await sql.query('SELECT id FROM users WHERE email = $1 LIMIT 1', ['coordinator@volunteerconnect.test'])
  if (!coordinator.length) {
    const passwordHash = await hashPassword('Coord123!', 'volunteerconnect-demo-salt')
    await sql.query('INSERT INTO users (id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5)', ['coordinator-demo', 'Zimong Ye', 'coordinator@volunteerconnect.test', passwordHash, 'coordinator'])
  }
}

export async function withDatabase(handler) {
  const sql = getSql()
  if (!sql) return { configured: false }
  await prepareDatabase(sql)
  return { configured: true, value: await handler(sql) }
}
