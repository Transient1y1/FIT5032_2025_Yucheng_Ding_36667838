import { clearSessionCookie } from '../_lib/security.js'

export default function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ ok: false, message: 'Method not allowed.' })
  clearSessionCookie(response)
  return response.status(200).json({ ok: true })
}

