const apiBase = import.meta.env.VITE_API_BASE_URL || ''
export const apiEnabled = import.meta.env.PROD || import.meta.env.VITE_API_ENABLED === 'true'

export async function apiRequest(path, options = {}) {
  if (!apiEnabled) return { ok: false, disabled: true, status: 0, message: 'Vercel API is disabled in local development.' }
  try {
    const response = await fetch(`${apiBase}${path}`, { credentials: 'include', headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options })
    const data = await response.json().catch(() => ({}))
    return { ok: response.ok && data.ok !== false, status: response.status, ...data }
  } catch { return { ok: false, status: 0, message: 'The Vercel API is unavailable.' } }
}

export function apiLogin(email, password) { return apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }) }
export function apiRegister(payload) { return apiRequest('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }) }
export function apiSession() { return apiRequest('/api/auth/me') }
export function apiLogout() { return apiRequest('/api/auth/logout', { method: 'POST', body: '{}' }) }
export function apiSendEmail(payload) { return apiRequest('/api/email/send', { method: 'POST', body: JSON.stringify(payload) }) }
export function apiSendBulkEmail(payload) { return apiRequest('/api/email/bulk', { method: 'POST', body: JSON.stringify(payload) }) }
export function apiGenerateAi(payload) { return apiRequest('/api/ai', { method: 'POST', body: JSON.stringify(payload) }) }
export function apiStats() { return apiRequest('/api/admin/stats') }
export function apiListApplications() { return apiRequest('/api/applications') }
export function apiCreateApplication(payload) { return apiRequest('/api/applications', { method: 'POST', body: JSON.stringify(payload) }) }
export function apiUpdateApplicationStatus(id, status) { return apiRequest('/api/applications/status', { method: 'PATCH', body: JSON.stringify({ id, status }) }) }
export function apiListBookings() { return apiRequest('/api/bookings') }
export function apiCreateBooking(payload) { return apiRequest('/api/bookings', { method: 'POST', body: JSON.stringify(payload) }) }
export function apiGetRating(opportunityId) { return apiRequest(`/api/ratings?opportunityId=${encodeURIComponent(opportunityId)}`) }
export function apiSaveRating(opportunityId, score) { return apiRequest('/api/ratings', { method: 'POST', body: JSON.stringify({ opportunityId, score }) }) }
export function apiUrl(path) { return `${apiBase}${path}` }
