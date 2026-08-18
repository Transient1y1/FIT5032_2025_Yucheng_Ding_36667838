import crypto from 'node:crypto'
import { readBody } from '../_lib/body.js'
import { withDatabase } from '../_lib/db.js'
import { authError, databaseError, getSession } from '../_lib/security.js'

export default async function handler(request, response) {
  const session = getSession(request)
  if (!session) return authError(response)
  try {
    if (request.method === 'GET') {
      const result = await withDatabase(async (sql) => await sql.query(session.role === 'coordinator' || session.role === 'admin'
        ? 'SELECT id, user_id AS "userId", opportunity_id AS "opportunityId", booking_date AS date, status FROM bookings ORDER BY booking_date'
        : 'SELECT id, user_id AS "userId", opportunity_id AS "opportunityId", booking_date AS date, status FROM bookings WHERE user_id = $1 ORDER BY booking_date', session.role === 'coordinator' || session.role === 'admin' ? [] : [session.sub]))
      if (!result.configured) return databaseError(response)
      return response.status(200).json({ ok: true, data: result.value })
    }
    if (request.method !== 'POST') return response.status(405).json({ ok: false, message: 'Method not allowed.' })
    if (session.role !== 'volunteer') return response.status(403).json({ ok: false, message: 'Volunteer access is required.' })
    const { opportunityId, date } = readBody(request)
    if (typeof opportunityId !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(String(date))) return response.status(400).json({ ok: false, message: 'Choose a valid opportunity and date.' })
    const result = await withDatabase(async (sql) => {
      const existing = await sql.query('SELECT id FROM bookings WHERE user_id = $1 AND opportunity_id = $2 AND booking_date = $3 LIMIT 1', [session.sub, opportunityId, date])
      if (existing.length) return { duplicate: true }
      const booking = { id: crypto.randomUUID(), userId: session.sub, opportunityId, date, status: 'confirmed' }
      await sql.query('INSERT INTO bookings (id, user_id, opportunity_id, booking_date, status) VALUES ($1, $2, $3, $4, $5)', [booking.id, booking.userId, booking.opportunityId, booking.date, booking.status])
      return { booking }
    })
    if (!result.configured) return databaseError(response)
    if (result.value?.duplicate) return response.status(409).json({ ok: false, message: 'This session is already booked.' })
    return response.status(201).json({ ok: true, data: result.value.booking })
  } catch { return response.status(503).json({ ok: false, message: 'The booking service is temporarily unavailable.' }) }
}

