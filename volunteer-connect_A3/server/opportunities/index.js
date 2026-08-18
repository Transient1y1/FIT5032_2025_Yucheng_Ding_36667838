import { withDatabase } from '../_lib/db.js'
import { seedOpportunities } from '../_lib/seed.js'

export default async function handler(request, response) {
  if (request.method !== 'GET') return response.status(405).json({ ok: false, message: 'Method not allowed.' })
  try {
    const result = await withDatabase(async (sql) => (await sql.query('SELECT id, data FROM opportunities ORDER BY id')).map((row) => ({ id: row.id, ...row.data })))
    return result.configured ? response.status(200).json({ ok: true, data: result.value }) : response.status(200).json({ ok: true, demo: true, data: seedOpportunities })
  } catch { return response.status(503).json({ ok: false, message: 'The opportunity service is temporarily unavailable.' }) }
}

