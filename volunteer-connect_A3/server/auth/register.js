import crypto from 'node:crypto'
import { readBody } from '../_lib/body.js'
import { withDatabase } from '../_lib/db.js'
import { createToken, databaseError, hashPassword, publicUser, setSessionCookie } from '../_lib/security.js'
import { safeText, validEmail } from '../_lib/validation.js'

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ ok: false, message: 'Method not allowed.' })
  const { name, email, password } = readBody(request)
  if (!safeText(name, 2, 60) || !validEmail(email) || typeof password !== 'string' || password.length < 8 || password.length > 128) return response.status(400).json({ ok: false, message: 'Check your name, email and password.' })
  if (!process.env.JWT_SECRET) return databaseError(response)
  try {
    const result = await withDatabase(async (sql) => {
      const normalisedEmail = email.trim().toLowerCase()
      if ((await sql.query('SELECT id FROM users WHERE email = $1 LIMIT 1', [normalisedEmail])).length) return { conflict: true }
      const user = { id: crypto.randomUUID(), name: name.trim(), email: normalisedEmail, role: 'volunteer' }
      await sql.query('INSERT INTO users (id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5)', [user.id, user.name, user.email, await hashPassword(password), user.role])
      return { user }
    })
    if (!result.configured) return databaseError(response)
    if (result.value?.conflict) return response.status(409).json({ ok: false, message: 'An account with this email already exists.' })
    setSessionCookie(response, createToken({ sub: result.value.user.id, role: result.value.user.role, email: result.value.user.email }))
    return response.status(201).json({ ok: true, user: publicUser(result.value.user) })
  } catch { return response.status(503).json({ ok: false, message: 'The registration service is temporarily unavailable.' }) }
}

