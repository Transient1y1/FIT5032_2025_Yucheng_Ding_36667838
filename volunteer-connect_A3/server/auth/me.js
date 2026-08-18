import { isDatabaseConfigured, withDatabase } from '../_lib/db.js'
import { databaseError, getSession, publicUser } from '../_lib/security.js'

export default async function handler(request, response) {
  if (request.method !== 'GET') return response.status(405).json({ ok: false, message: 'Method not allowed.' })
  if (!isDatabaseConfigured()) return databaseError(response)
  const session = getSession(request)
  if (!session) return response.status(200).json({ ok: true, user: null })
  try {
    const result = await withDatabase(async (sql) => (await sql.query('SELECT id, name, email, role FROM users WHERE id = $1 LIMIT 1', [session.sub]))[0] || null)
    if (!result.configured) return databaseError(response)
    return response.status(200).json({ ok: true, user: publicUser(result.value) })
  } catch { return response.status(503).json({ ok: false, message: 'The session service is temporarily unavailable.' }) }
}
