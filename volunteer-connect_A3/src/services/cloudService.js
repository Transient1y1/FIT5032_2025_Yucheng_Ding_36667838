import { apiEnabled, apiGenerateAi, apiLogin, apiLogout, apiRegister, apiSendBulkEmail, apiSendEmail, apiSession, apiStats, apiUrl } from './apiService'

export const cloudStatus = { configured: apiEnabled, provider: 'Vercel Functions + Neon/Postgres' }
export function isCloudConfigured() { return apiEnabled }
export function cloudLogin(email, password) { return apiLogin(email, password) }
export function cloudRegister(payload) { return apiRegister(payload) }
export function cloudLogout() { return apiLogout() }
export function getCloudSession() { return apiSession() }
export function subscribeCloudAuth(onUser) {
  let active = true
  apiSession().then((result) => { if (active) onUser(result.ok ? result.user : null) })
  return () => { active = false }
}
export function seedCloudOpportunities() { return Promise.resolve({ ok: true, count: 6 }) }
export function sendEmail(payload) { return apiSendEmail(payload) }
export function sendBulkEmail(payload) { return apiSendBulkEmail(payload) }
export function generateAiSuggestion(payload) { return apiGenerateAi(payload) }
export function getCloudStats() { return apiStats() }
export function getRestApiUrl(path = '/api/opportunities') { return apiUrl(path) }

