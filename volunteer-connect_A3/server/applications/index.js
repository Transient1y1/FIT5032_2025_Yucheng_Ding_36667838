import crypto from 'node:crypto'
import { readBody } from '../_lib/body.js'
import { withDatabase } from '../_lib/db.js'
import { authError, databaseError, getSession } from '../_lib/security.js'
import { safeText } from '../_lib/validation.js'

export default async function handler(request, response) {
  const session = getSession(request)
  if (!session) return authError(response)
  try {
    if (request.method === 'GET') {
      const result = await withDatabase(async (sql) => session.role === 'coordinator' || session.role === 'admin'
        ? await sql.query('SELECT id, user_id AS "userId", opportunity_id AS "opportunityId", availability, skills_notes AS "skillsNotes", motivation, status, submitted_at AS "submittedAt", updated_at AS "updatedAt" FROM applications ORDER BY submitted_at DESC')
        : await sql.query('SELECT id, user_id AS "userId", opportunity_id AS "opportunityId", availability, skills_notes AS "skillsNotes", motivation, status, submitted_at AS "submittedAt", updated_at AS "updatedAt" FROM applications WHERE user_id = $1 ORDER BY submitted_at DESC', [session.sub]))
      if (!result.configured) return databaseError(response)
      return response.status(200).json({ ok: true, data: result.value })
    }
    if (request.method !== 'POST') return response.status(405).json({ ok: false, message: 'Method not allowed.' })
    if (session.role !== 'volunteer') return response.status(403).json({ ok: false, message: 'Volunteer access is required.' })
    const body = readBody(request)
    if (!safeText(body.opportunityId, 1, 120) || !safeText(body.availability, 3, 200) || !safeText(body.skillsNotes || '', 0, 500) || !safeText(body.motivation, 20, 600) || body.consent !== true) return response.status(400).json({ ok: false, message: 'Check the application fields and try again.' })
    const result = await withDatabase(async (sql) => {
      if (!(await sql.query('SELECT id FROM opportunities WHERE id = $1 LIMIT 1', [body.opportunityId])).length) return { missing: true }
      const application = { id: crypto.randomUUID(), userId: session.sub, opportunityId: body.opportunityId, availability: body.availability.trim(), skillsNotes: (body.skillsNotes || '').trim(), motivation: body.motivation.trim(), status: 'pending', submittedAt: new Date().toISOString() }
      try { await sql.query('INSERT INTO applications (id, user_id, opportunity_id, availability, skills_notes, motivation, status, submitted_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [application.id, application.userId, application.opportunityId, application.availability, application.skillsNotes, application.motivation, application.status, application.submittedAt]) } catch (error) { if (/duplicate|unique/i.test(String(error.message))) return { duplicate: true }; throw error }
      return { application }
    })
    if (!result.configured) return databaseError(response)
    if (result.value?.missing) return response.status(404).json({ ok: false, message: 'The opportunity could not be found.' })
    if (result.value?.duplicate) return response.status(409).json({ ok: false, message: 'You have already applied for this opportunity.' })
    return response.status(201).json({ ok: true, data: result.value.application })
  } catch { return response.status(503).json({ ok: false, message: 'The application service is temporarily unavailable.' }) }
}

