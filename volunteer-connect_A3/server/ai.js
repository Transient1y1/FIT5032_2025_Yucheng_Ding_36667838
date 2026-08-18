import { readBody } from './_lib/body.js'
import { authError, getSession } from './_lib/security.js'

export default async function handler(request, response) {
  const session = getSession(request)
  if (!session || !['coordinator', 'admin'].includes(session.role)) return authError(response, 'Coordinator access is required.')
  if (request.method !== 'POST') return response.status(405).json({ ok: false, message: 'Method not allowed.' })
  if (!process.env.AI_API_KEY) return response.status(200).json({ ok: true, demo: true, text: 'Demo insight: prioritise pending applications, confirm upcoming sessions and contact volunteers with incomplete availability details.' })
  const prompt = String(readBody(request).prompt || '').slice(0, 1000)
  const provider = String(process.env.AI_PROVIDER || 'gemini').toLowerCase()
  try {
    const isDeepSeek = provider === 'deepseek'
    const endpoint = process.env.AI_ENDPOINT || (isDeepSeek ? 'https://api.deepseek.com/chat/completions' : 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent')
    const headers = { 'Content-Type': 'application/json' }
    const body = isDeepSeek
      ? { model: process.env.AI_MODEL || 'deepseek-chat', messages: [{ role: 'user', content: prompt }] }
      : { contents: [{ parts: [{ text: prompt }] }] }
    if (isDeepSeek) headers.Authorization = `Bearer ${process.env.AI_API_KEY}`
    const url = isDeepSeek ? endpoint : `${endpoint}?key=${process.env.AI_API_KEY}`
    const result = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) })
    const data = await result.json()
    const text = isDeepSeek ? data.choices?.[0]?.message?.content : data.candidates?.[0]?.content?.parts?.[0]?.text
    return response.status(result.ok ? 200 : 502).json({ ok: result.ok, text: text || 'The AI provider returned no text.' })
  } catch { return response.status(502).json({ ok: false, message: 'AI provider is unavailable.' }) }
}
