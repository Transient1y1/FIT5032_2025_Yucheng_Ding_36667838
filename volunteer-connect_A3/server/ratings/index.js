import crypto from 'node:crypto'
import { readBody } from '../_lib/body.js'
import { withDatabase } from '../_lib/db.js'
import { authError, databaseError, getSession } from '../_lib/security.js'

export default async function handler(request, response) {
  const session = getSession(request)
  if (!session) return authError(response)
  const body = readBody(request)
  const opportunityId = request.query?.opportunityId || body.opportunityId
  try {
    if (request.method === 'GET') {
      const result = await withDatabase(async (sql) => { const rows = await sql.query('SELECT ROUND(AVG(score)::numeric, 1) AS average, COUNT(*)::int AS count, MAX(CASE WHEN user_id = $2 THEN score END)::int AS "userScore" FROM ratings WHERE opportunity_id = $1', [opportunityId, session.sub]); return { average: Number(rows[0]?.average || 0), count: rows[0]?.count || 0, userScore: rows[0]?.userScore || null } })
      if (!result.configured) return databaseError(response)
      return response.status(200).json({ ok: true, data: result.value })
    }
    if (request.method !== 'POST') return response.status(405).json({ ok: false, message: 'Method not allowed.' })
    if (session.role !== 'volunteer') return response.status(403).json({ ok: false, message: 'Volunteer access is required.' })
    if (!Number.isInteger(body.score) || body.score < 1 || body.score > 5 || typeof opportunityId !== 'string') return response.status(400).json({ ok: false, message: 'Choose a rating from 1 to 5.' })
    const result = await withDatabase(async (sql) => { const rating = { id: crypto.randomUUID(), userId: session.sub, opportunityId, score: body.score }; await sql.query('INSERT INTO ratings (id, user_id, opportunity_id, score) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, opportunity_id) DO UPDATE SET score = EXCLUDED.score, updated_at = NOW()', [rating.id, rating.userId, rating.opportunityId, rating.score]); return rating })
    if (!result.configured) return databaseError(response)
    return response.status(200).json({ ok: true, data: result.value })
  } catch { return response.status(503).json({ ok: false, message: 'The rating service is temporarily unavailable.' }) }
}
