import { readBody } from '../_lib/body.js'
import { authError, getSession } from '../_lib/security.js'

export default async function handler(request, response) {
  const session = getSession(request)
  if (!session || !['coordinator', 'admin'].includes(session.role)) return authError(response, 'Coordinator access is required.')
  if (request.method !== 'POST') return response.status(405).json({ ok: false, message: 'Method not allowed.' })
  const body = readBody(request)
  if (!body.to || !body.subject) return response.status(400).json({ ok: false, message: 'Recipient and subject are required.' })
  if (!process.env.RESEND_API_KEY) return response.status(200).json({ ok: true, demo: true, message: 'Email accepted in demonstration mode.' })
  try {
    const result = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: process.env.MAIL_FROM || 'VolunteerConnect <onboarding@resend.dev>', to: body.to, subject: body.subject, text: body.text || '', attachments: body.attachments || [] }) })
    return response.status(result.ok ? 200 : 502).json({ ok: result.ok, data: await result.json() })
  } catch { return response.status(502).json({ ok: false, message: 'Email provider is unavailable.' }) }
}

