import { isDatabaseConfigured, withDatabase } from './_lib/db.js'

export default async function handler(request, response) {
  if (request.method !== 'GET') return response.status(405).json({ ok: false, message: 'Method not allowed.' })
  if (!isDatabaseConfigured()) return response.status(200).json({ ok: true, database: 'not-configured', provider: 'Vercel Functions + Neon/Postgres' })
  try {
    const result = await withDatabase(async (sql) => (await sql.query('SELECT NOW() AS now'))[0])
    return response.status(200).json({ ok: true, database: 'connected', now: result.value.now })
  } catch { return response.status(503).json({ ok: false, database: 'unavailable' }) }
}

