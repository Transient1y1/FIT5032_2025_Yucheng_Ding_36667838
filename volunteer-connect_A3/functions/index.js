const { onCall, onRequest } = require('firebase-functions/v2/https')
const { setGlobalOptions } = require('firebase-functions/v2')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const { Resend } = require('resend')

initializeApp()
setGlobalOptions({ region: process.env.FUNCTIONS_REGION || 'australia-southeast1', maxInstances: 10 })
const db = getFirestore()

function isCoordinator(request) { return ['coordinator', 'admin'].includes(request.auth?.token?.role) || request.auth?.token?.email === 'coordinator@volunteerconnect.test' }
function requireCoordinator(request) { if (!isCoordinator(request)) throw new Error('Coordinator access is required.') }
function cors(response) { response.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*'); response.set('Access-Control-Allow-Headers', 'Content-Type, Authorization'); response.set('Access-Control-Allow-Methods', 'GET, OPTIONS') }

exports.sendEmail = onCall(async (request) => {
  requireCoordinator(request)
  const payload = request.data || {}
  if (!payload.to || !payload.subject) throw new Error('Recipient and subject are required.')
  if (!process.env.RESEND_API_KEY) return { queued: true, demo: true, message: 'Email accepted in demonstration mode.' }
  const resend = new Resend(process.env.RESEND_API_KEY)
  const result = await resend.emails.send({ from: process.env.MAIL_FROM || 'VolunteerConnect <onboarding@resend.dev>', to: payload.to, subject: payload.subject, text: payload.text || '', attachments: payload.attachments || [] })
  return { queued: true, id: result.data?.id }
})

exports.sendBulkEmail = onCall(async (request) => {
  requireCoordinator(request)
  const recipients = Array.isArray(request.data?.recipients) ? request.data.recipients.slice(0, 100) : []
  if (!recipients.length) throw new Error('At least one recipient is required.')
  if (!process.env.RESEND_API_KEY) return { queued: true, demo: true, count: recipients.length }
  const resend = new Resend(process.env.RESEND_API_KEY)
  const result = await resend.batch.send(recipients.map((to) => ({ from: process.env.MAIL_FROM || 'VolunteerConnect <onboarding@resend.dev>', to, subject: request.data.subject || 'VolunteerConnect update', text: request.data.text || '', attachments: request.data.attachments || [] })))
  return { queued: true, id: result.data?.id, count: recipients.length }
})

exports.generateAiSuggestion = onCall(async (request) => {
  requireCoordinator(request)
  const prompt = String(request.data?.prompt || '').slice(0, 1000)
  if (!process.env.AI_API_KEY) return { text: 'Demo insight: prioritise pending applications, confirm upcoming sessions and contact volunteers with incomplete availability details.', demo: true }
  const endpoint = process.env.AI_ENDPOINT || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
  const response = await fetch(`${endpoint}?key=${process.env.AI_API_KEY}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) })
  if (!response.ok) throw new Error('AI provider request failed.')
  const body = await response.json()
  return { text: body.candidates?.[0]?.content?.parts?.[0]?.text || 'The AI provider returned no text.' }
})

exports.getAdminStats = onCall(async (request) => {
  requireCoordinator(request)
  const [users, opportunities, applications, bookings] = await Promise.all(['users', 'opportunities', 'applications', 'bookings'].map((name) => db.collection(name).count().get()))
  return { users: users.data().count, opportunities: opportunities.data().count, applications: applications.data().count, bookings: bookings.data().count }
})

exports.api = onRequest(async (request, response) => {
  cors(response)
  if (request.method === 'OPTIONS') return response.status(204).send('')
  if (request.method !== 'GET') return response.status(405).json({ error: 'Method not allowed' })
  const path = request.path.replace(/^\/api\/?/, '').split('/').filter(Boolean)
  if (path[0] === 'opportunities') {
    if (path[1]) { const item = await db.collection('opportunities').doc(path[1]).get(); return item.exists ? response.json({ id: item.id, ...item.data() }) : response.status(404).json({ error: 'Opportunity not found' }) }
    const snapshot = await db.collection('opportunities').limit(100).get(); return response.json(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))
  }
  if (path[0] === 'admin' && path[1] === 'stats') return response.status(401).json({ error: 'Use the callable getAdminStats endpoint with Firebase authentication.' })
  return response.status(404).json({ error: 'Route not found' })
})

