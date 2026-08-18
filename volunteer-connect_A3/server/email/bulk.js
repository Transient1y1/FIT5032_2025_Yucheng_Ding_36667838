import { readBody } from '../_lib/body.js'
import { authError, getSession } from '../_lib/security.js'

export default async function handler(request, response) {
  const session = getSession(request)
  if (!session || !['coordinator', 'admin'].includes(session.role)) return authError(response, 'Coordinator access is required.')
  if (request.method !== 'POST') return response.status(405).json({ ok: false, message: 'Method not allowed.' })
  const body = readBody(request)
  const recipients = Array.isArray(body.recipients) ? body.recipients.filter(Boolean).slice(0, 100) : []
  if (!recipients.length) return response.status(400).json({ ok: false, message: 'Select at least one recipient.' })
  if (!process.env.RESEND_API_KEY) return response.status(200).json({ ok: true, demo: true, count: recipients.length })
  try {
    const result = await fetch('https://api.resend.com/emails/batch', { method: 'POST', headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify(recipients.map((to) => ({ from: process.env.MAIL_FROM || 'VolunteerConnect <onboarding@resend.dev>', to, subject: body.subject || 'VolunteerConnect update', text: body.text || '', attachments: body.attachments || [] }))) })
    return response.status(result.ok ? 200 : 502).json({ ok: result.ok, data: await result.json(), count: recipients.length })
  } catch { return response.status(502).json({ ok: false, message: 'Email provider is unavailable.' }) }
}

