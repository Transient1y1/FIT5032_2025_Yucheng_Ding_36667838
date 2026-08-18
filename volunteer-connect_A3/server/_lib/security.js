import crypto from 'node:crypto'

function base64Url(value) { return Buffer.from(value).toString('base64url') }
function parseBase64Url(value) { return Buffer.from(value, 'base64url').toString('utf8') }

export async function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const derived = await new Promise((resolve, reject) => crypto.scrypt(password, salt, 64, (error, key) => error ? reject(error) : resolve(key)))
  return `${salt}:${Buffer.from(derived).toString('base64url')}`
}

export async function verifyPassword(password, stored) {
  const [salt, expected] = String(stored || '').split(':')
  if (!salt || !expected) return false
  const derived = await hashPassword(password, salt)
  return crypto.timingSafeEqual(Buffer.from(derived), Buffer.from(`${salt}:${expected}`))
}

function sign(input) { return base64Url(crypto.createHmac('sha256', process.env.JWT_SECRET).update(input).digest()) }

export function createToken(payload, maxAgeSeconds = 60 * 60 * 24 * 7) {
  if (!process.env.JWT_SECRET) return null
  const header = base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = base64Url(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + maxAgeSeconds }))
  return `${header}.${body}.${sign(`${header}.${body}`)}`
}

export function verifyToken(token) {
  if (!process.env.JWT_SECRET || !token) return null
  const [header, body, signature] = String(token).split('.')
  if (!header || !body || !signature || sign(`${header}.${body}`) !== signature) return null
  try { const payload = JSON.parse(parseBase64Url(body)); return payload.exp > Math.floor(Date.now() / 1000) ? payload : null } catch { return null }
}

export function getCookie(request, name) {
  const cookies = String(request.headers.cookie || '').split(';').map((part) => part.trim())
  const value = cookies.find((part) => part.startsWith(`${name}=`))
  return value ? decodeURIComponent(value.slice(name.length + 1)) : ''
}

export function setSessionCookie(response, token) { response.setHeader('Set-Cookie', `vc_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=604800`) }
export function clearSessionCookie(response) { response.setHeader('Set-Cookie', 'vc_session=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0') }

export function getSession(request) { return verifyToken(getCookie(request, 'vc_session')) }
export function publicUser(user) { return user ? { id: user.id, name: user.name, email: user.email, role: user.role } : null }
export function authError(response, message = 'Authentication is required.') { return response.status(401).json({ ok: false, message }) }
export function databaseError(response) { return response.status(503).json({ ok: false, message: 'Neon database is not configured. Add POSTGRES_URL and JWT_SECRET in Vercel.' }) }

