import { readBody } from '../_lib/body.js'
import { withDatabase } from '../_lib/db.js'
import { createToken, databaseError, publicUser, setSessionCookie, verifyPassword } from '../_lib/security.js'
import { validEmail } from '../_lib/validation.js'

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ ok: false, message: 'Method not allowed.' })
  const { email, password } = readBody(request)
  if (!validEmail(email) || typeof password !== 'string' || password.length > 128) return response.status(400).json({ ok: false, message: 'Email or password is incorrect.' })
  if (!process.env.JWT_SECRET) return databaseError(response)
  try {
    const result = await withDatabase(async (sql) => {
      const users = await sql.query('SELECT id, name, email, role, password_hash FROM users WHERE email = $1 LIMIT 1', [email.trim().toLowerCase()])
      const user = users[0]
      if (!user || !(await verifyPassword(password, user.password_hash))) return null
      return user
    })
    if (!result.configured) return databaseError(response)
    if (!result.value) return response.status(401).json({ ok: false, message: 'Email or password is incorrect.' })
    const token = createToken({ sub: result.value.id, role: result.value.role, email: result.value.email })
    setSessionCookie(response, token)
    return response.status(200).json({ ok: true, user: publicUser(result.value) })
  } catch { return response.status(503).json({ ok: false, message: 'The sign-in service is temporarily unavailable.' }) }
}

