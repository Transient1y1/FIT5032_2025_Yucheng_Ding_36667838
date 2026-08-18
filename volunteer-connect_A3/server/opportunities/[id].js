import { withDatabase } from '../_lib/db.js'
import { seedOpportunities } from '../_lib/seed.js'

export default async function handler(request, response) {
  if (request.method !== 'GET') return response.status(405).json({ ok: false, message: 'Method not allowed.' })
  const id = request.query?.id
  const fallback = seedOpportunities.find((item) => item.id === id)
  try {
    const result = await withDatabase(async (sql) => (await sql.query('SELECT id, data FROM opportunities WHERE id = $1 LIMIT 1', [id]))[0] || null)
    if (!result.configured) return fallback ? response.status(200).json({ ok: true, demo: true, data: fallback }) : response.status(404).json({ ok: false, message: 'Opportunity not found.' })
    return result.value ? response.status(200).json({ ok: true, data: { id: result.value.id, ...result.value.data } }) : response.status(404).json({ ok: false, message: 'Opportunity not found.' })
  } catch { return response.status(503).json({ ok: false, message: 'The opportunity service is temporarily unavailable.' }) }
}

