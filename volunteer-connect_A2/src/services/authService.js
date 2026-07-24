import { ref } from 'vue'

const USERS_KEY = 'vc_users'
const SESSION_KEY = 'vc_session'
const DEMO_COORDINATOR = {
  id: 'coordinator-demo',
  name: 'Zimong Ye',
  email: 'coordinator@volunteerconnect.test',
  role: 'coordinator',
  password: 'Coord123!',
}

export const currentUser = ref(null)

function readUsers() {
  const storedUsers = localStorage.getItem(USERS_KEY)
  if (!storedUsers) return []

  try {
    const users = JSON.parse(storedUsers)
    if (!Array.isArray(users)) return []

    return users.filter((user) => (
      user &&
      typeof user.id === 'string' &&
      typeof user.name === 'string' &&
      typeof user.email === 'string' &&
      typeof user.passwordHash === 'string' &&
      typeof user.passwordSalt === 'string' &&
      ['volunteer', 'coordinator'].includes(user.role)
    ))
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function publicUser(user) {
  if (!user) return null

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

function normaliseEmail(email) {
  return email.trim().toLowerCase()
}

function createSalt() {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function hashPassword(password, salt) {
  const input = new TextEncoder().encode(`${salt}:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', input)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function createUser({ id, name, email, password, role }) {
  const passwordSalt = createSalt()
  const passwordHash = await hashPassword(password, passwordSalt)

  return {
    id,
    name: name.trim(),
    email: normaliseEmail(email),
    role,
    passwordSalt,
    passwordHash,
  }
}

function readSessionUser(users) {
  const storedSession = sessionStorage.getItem(SESSION_KEY)
  if (!storedSession) return null

  try {
    const session = JSON.parse(storedSession)
    return users.find((user) => user.id === session.userId) || null
  } catch {
    sessionStorage.removeItem(SESSION_KEY)
    return null
  }
}

export async function initialiseAuth() {
  const users = readUsers()
  const hasCoordinator = users.some(
    (user) => user.email === DEMO_COORDINATOR.email && user.role === 'coordinator',
  )

  if (!hasCoordinator) {
    users.push(await createUser(DEMO_COORDINATOR))
    saveUsers(users)
  }

  currentUser.value = publicUser(readSessionUser(users))
}

export async function login(email, password) {
  const user = readUsers().find((item) => item.email === normaliseEmail(email))
  if (!user) return { ok: false, message: 'Email or password is incorrect.' }

  const passwordHash = await hashPassword(password, user.passwordSalt)
  if (passwordHash !== user.passwordHash) {
    return { ok: false, message: 'Email or password is incorrect.' }
  }

  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id }))
  currentUser.value = publicUser(user)
  return { ok: true, user: currentUser.value }
}

export async function registerVolunteer({ name, email, password }) {
  const users = readUsers()
  const normalisedEmail = normaliseEmail(email)

  if (users.some((user) => user.email === normalisedEmail)) {
    return { ok: false, message: 'An account with this email already exists.' }
  }

  const user = await createUser({
    id: crypto.randomUUID(),
    name,
    email: normalisedEmail,
    password,
    role: 'volunteer',
  })

  users.push(user)
  saveUsers(users)
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id }))
  currentUser.value = publicUser(user)
  return { ok: true, user: currentUser.value }
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY)
  currentUser.value = null
}

export function getCurrentUser() {
  return currentUser.value
}

export function getUserForCoordinator(userId) {
  if (currentUser.value?.role !== 'coordinator' || typeof userId !== 'string') return null
  return publicUser(readUsers().find((user) => user.id === userId))
}

export function getDashboardPath(user = currentUser.value) {
  return user?.role === 'coordinator' ? '/coordinator/dashboard' : '/volunteer/dashboard'
}
