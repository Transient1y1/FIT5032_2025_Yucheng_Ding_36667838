import { readBody } from '../_lib/body.js'
import { withDatabase } from '../_lib/db.js'
import { authError, databaseError, getSession } from '../_lib/security.js'

const statuses = ['accepted', 'waitlisted', 'declined', 'more-information']

export default async function handler(request, response) {
  const session = getSession(request)
  if (!session) return authError(response)
  if (!['coordinator', 'admin'].includes(session.role)) return response.status(403).json({ ok: false, message: 'Coordinator access is required.' })
  if (request.method !== 'PATCH') return response.status(405).json({ ok: false, message: 'Method not allowed.' })
  const { id, status } = readBody(request)
  if (typeof id !== 'string' || !statuses.includes(status)) return response.status(400).json({ ok: false, message: 'Choose a valid application status.' })
  try {
    const result = await withDatabase(async (sql) => (await sql.query('UPDATE applications SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id, user_id AS "userId", opportunity_id AS "opportunityId", status', [status, id]))[0] || null)
    if (!result.configured) return databaseError(response)
    return result.value ? response.status(200).json({ ok: true, data: result.value }) : response.status(404).json({ ok: false, message: 'The application could not be found.' })
  } catch { return response.status(503).json({ ok: false, message: 'The status service is temporarily unavailable.' }) }
}

