import { httpsCallable } from 'firebase/functions'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { cloudFunctions, firebaseAuth, firebaseConfigured, firestore } from './firebaseConfig'
import { seedOpportunities } from '../data/opportunities'

export const cloudStatus = { configured: firebaseConfigured, provider: firebaseConfigured ? 'Firebase' : 'Local demonstration mode' }
export function isCloudConfigured() { return firebaseConfigured }

function publicCloudUser(user, role = 'volunteer') {
  if (!user) return null
  return { id: user.uid, name: user.displayName || user.email?.split('@')[0] || 'Volunteer', email: user.email, role }
}

export async function cloudLogin(email, password) {
  if (!firebaseAuth) return { ok: false, message: 'Firebase is not configured. Local demonstration login is active.' }
  try {
    const credential = await signInWithEmailAndPassword(firebaseAuth, email, password)
    return { ok: true, user: publicCloudUser(credential.user) }
  } catch { return { ok: false, message: 'Email or password is incorrect.' } }
}

export async function cloudRegister({ name, email, password }) {
  if (!firebaseAuth) return { ok: false, message: 'Firebase is not configured. Local demonstration registration is active.' }
  try {
    const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password)
    await setDoc(doc(firestore, 'users', credential.user.uid), { name, email, role: 'volunteer', createdAt: new Date().toISOString() })
    return { ok: true, user: publicCloudUser(credential.user) }
  } catch { return { ok: false, message: 'The account could not be created. Check the details and try again.' } }
}

export async function cloudLogout() { if (firebaseAuth) await signOut(firebaseAuth) }
export function subscribeCloudAuth(onUser) {
  if (!firebaseAuth) return () => {}
  return firebaseAuth.onAuthStateChanged((user) => onUser(user ? publicCloudUser(user) : null))
}

export async function seedCloudOpportunities() {
  if (!firestore) return { ok: false, count: 0, message: 'Cloud storage is not configured.' }
  const snapshot = await getDocs(collection(firestore, 'opportunities'))
  if (!snapshot.empty) return { ok: true, count: snapshot.size }
  await Promise.all(seedOpportunities.map(({ image, ...opportunity }) => setDoc(doc(firestore, 'opportunities', opportunity.id), opportunity)))
  return { ok: true, count: seedOpportunities.length }
}

async function callFunction(name, payload) {
  if (!cloudFunctions) return { ok: false, message: 'Cloud functions are unavailable in local demonstration mode.' }
  try { return { ok: true, data: (await httpsCallable(cloudFunctions, name)(payload)).data } }
  catch { return { ok: false, message: 'The cloud service is unavailable. Try again when the connection is restored.' } }
}

export function sendEmail(payload) { return callFunction('sendEmail', payload) }
export function sendBulkEmail(payload) { return callFunction('sendBulkEmail', payload) }
export function generateAiSuggestion(payload) { return callFunction('generateAiSuggestion', payload) }
export function getCloudStats(payload = {}) { return callFunction('getAdminStats', payload) }
export function getRestApiUrl(path = '/api/opportunities') { return `${import.meta.env.VITE_FUNCTIONS_BASE_URL || ''}${path}` }

