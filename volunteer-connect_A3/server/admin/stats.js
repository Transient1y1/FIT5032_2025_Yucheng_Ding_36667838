import { withDatabase } from '../_lib/db.js'
import { authError, databaseError, getSession } from '../_lib/security.js'

export default async function handler(request, response) {
  const session = getSession(request)
  if (!session) return authError(response)
  if (!['coordinator', 'admin'].includes(session.role)) return response.status(403).json({ ok: false, message: 'Coordinator access is required.' })
  if (request.method !== 'GET') return response.status(405).json({ ok: false, message: 'Method not allowed.' })
  try {
    const result = await withDatabase(async (sql) => {
      const values = await Promise.all(['users', 'opportunities', 'applications', 'bookings'].map(async (table) => [table, (await sql.query(`SELECT COUNT(*)::int AS count FROM ${table}`))[0].count]))
      return Object.fromEntries(values)
    })
    if (!result.configured) return databaseError(response)
    return response.status(200).json({ ok: true, data: result.value })
  } catch { return response.status(503).json({ ok: false, message: 'The statistics service is temporarily unavailable.' }) }
}

