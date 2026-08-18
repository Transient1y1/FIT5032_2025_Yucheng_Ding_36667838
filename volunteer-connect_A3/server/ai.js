import { readBody } from './_lib/body.js'
import { authError, getSession } from './_lib/security.js'

export default async function handler(request, response) {
  const session = getSession(request)
  if (!session || !['coordinator', 'admin'].includes(session.role)) return authError(response, 'Coordinator access is required.')
  if (request.method !== 'POST') return response.status(405).json({ ok: false, message: 'Method not allowed.' })
  if (!process.env.AI_API_KEY) return response.status(200).json({ ok: true, demo: true, text: 'Demo insight: prioritise pending applications, confirm upcoming sessions and contact volunteers with incomplete availability details.' })
  try {
    const endpoint = process.env.AI_ENDPOINT || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
    const result = await fetch(`${endpoint}?key=${process.env.AI_API_KEY}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: String(readBody(request).prompt || '').slice(0, 1000) }] }] }) })
    const data = await result.json()
    return response.status(result.ok ? 200 : 502).json({ ok: result.ok, text: data.candidates?.[0]?.content?.parts?.[0]?.text || 'The AI provider returned no text.' })
  } catch { return response.status(502).json({ ok: false, message: 'AI provider is unavailable.' }) }
}

