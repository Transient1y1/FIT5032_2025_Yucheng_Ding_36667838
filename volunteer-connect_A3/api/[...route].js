import health from '../server/health.js'
import ai from '../server/ai.js'
import adminStats from '../server/admin/stats.js'
import applications from '../server/applications/index.js'
import applicationStatus from '../server/applications/status.js'
import bookings from '../server/bookings/index.js'
import authLogin from '../server/auth/login.js'
import authLogout from '../server/auth/logout.js'
import authMe from '../server/auth/me.js'
import authRegister from '../server/auth/register.js'
import emailBulk from '../server/email/bulk.js'
import emailSend from '../server/email/send.js'
import opportunities from '../server/opportunities/index.js'
import opportunityDetail from '../server/opportunities/[id].js'
import ratings from '../server/ratings/index.js'

const routes = {
  'health': health,
  'ai': ai,
  'admin/stats': adminStats,
  'applications': applications,
  'applications/status': applicationStatus,
  'bookings': bookings,
  'auth/login': authLogin,
  'auth/logout': authLogout,
  'auth/me': authMe,
  'auth/register': authRegister,
  'email/bulk': emailBulk,
  'email/send': emailSend,
  'opportunities': opportunities,
  'ratings': ratings,
}

function routeRequest(request, segments) {
  const url = new URL(request.url || '/', `https://${request.headers?.host || 'localhost'}`)
  const query = { ...(request.query || {}) }
  for (const [key, value] of url.searchParams.entries()) query[key] = value
  if (segments[0] === 'opportunities' && segments.length === 2) query.id = decodeURIComponent(segments[1])
  if (segments[0] === 'applications' && segments[1] === 'status' && segments.length === 3) query.id = decodeURIComponent(segments[2])
  const routedRequest = Object.create(request)
  routedRequest.query = query
  return routedRequest
}

export default async function handler(request, response) {
  const pathname = new URL(request.url || '/', `https://${request.headers?.host || 'localhost'}`).pathname
  const path = pathname.replace(/^\/api\/?/, '').replace(/\/$/, '')
  const segments = path ? path.split('/').filter(Boolean) : []
  const key = segments.slice(0, 2).join('/')
  const route = segments[0] === 'opportunities' && segments.length === 2
    ? opportunityDetail
    : routes[key] || routes[segments[0]]
  if (!route) return response.status(404).json({ ok: false, message: 'API route not found.' })
  return route(routeRequest(request, segments), response)
}
