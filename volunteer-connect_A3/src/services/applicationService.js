import { getCurrentUser } from './authService'
import { getOpportunityById } from './opportunityStorage'
import { isSafePlainText, isValidIdentifier } from '../utils/inputValidation'

const SAVED_KEY = 'vc_saved_opportunities'
const APPLICATIONS_KEY = 'vc_applications'
const APPLICATION_STATUSES = ['pending', 'accepted', 'waitlisted', 'declined', 'more-information']
const REVIEW_STATUSES = ['accepted', 'waitlisted', 'declined', 'more-information']

function readList(key) {
  const storedValue = localStorage.getItem(key)
  if (!storedValue) return []

  try {
    const parsedValue = JSON.parse(storedValue)
    return Array.isArray(parsedValue) ? parsedValue : []
  } catch {
    return []
  }
}

function saveList(key, items) {
  localStorage.setItem(key, JSON.stringify(items))
}

function validId(value) {
  return isValidIdentifier(value)
}

function readSavedItems() {
  return readList(SAVED_KEY).filter(
    (item) => item && validId(item.userId) && validId(item.opportunityId),
  )
}

function readApplications() {
  return readList(APPLICATIONS_KEY).filter((application) => (
    application &&
    validId(application.id) &&
    validId(application.userId) &&
    validId(application.opportunityId) &&
    isSafePlainText(application.availability, 3, 200) &&
    isSafePlainText(application.skillsNotes, 0, 500) &&
    isSafePlainText(application.motivation, 20, 600) &&
    typeof application.submittedAt === 'string' &&
    APPLICATION_STATUSES.includes(application.status)
  ))
}

export function getSavedOpportunityIds(userId) {
  if (!validId(userId) || getCurrentUser()?.id !== userId) return []

  return readSavedItems()
    .filter((item) => item.userId === userId)
    .map((item) => item.opportunityId)
}

export function isOpportunitySaved(userId, opportunityId) {
  return getSavedOpportunityIds(userId).includes(opportunityId)
}

export function toggleSavedOpportunity(userId, opportunityId) {
  const user = getCurrentUser()
  if (
    user?.role !== 'volunteer' ||
    user.id !== userId ||
    !validId(opportunityId) ||
    !getOpportunityById(opportunityId)
  ) return false

  const savedItems = readSavedItems()
  const itemIndex = savedItems.findIndex(
    (item) => item.userId === userId && item.opportunityId === opportunityId,
  )

  if (itemIndex >= 0) {
    savedItems.splice(itemIndex, 1)
    saveList(SAVED_KEY, savedItems)
    return false
  }

  savedItems.push({ userId, opportunityId })
  saveList(SAVED_KEY, savedItems)
  return true
}

export function getApplicationsForUser(userId) {
  if (!validId(userId) || getCurrentUser()?.id !== userId) return []
  return readApplications().filter((application) => application.userId === userId)
}

export function getApplicationForOpportunity(userId, opportunityId) {
  return getApplicationsForUser(userId).find(
    (application) => application.opportunityId === opportunityId,
  ) || null
}

export function getApplicationsForCoordinator() {
  if (getCurrentUser()?.role !== 'coordinator') return []
  return readApplications()
}

export function updateApplicationStatus(applicationId, status) {
  if (getCurrentUser()?.role !== 'coordinator') {
    return { ok: false, message: 'Coordinator access is required.' }
  }

  if (!validId(applicationId) || !REVIEW_STATUSES.includes(status)) {
    return { ok: false, message: 'Choose a valid application status.' }
  }

  const applications = readApplications()
  const applicationIndex = applications.findIndex(
    (application) => application.id === applicationId,
  )

  if (applicationIndex < 0) {
    return { ok: false, message: 'The application could not be found.' }
  }

  applications[applicationIndex] = {
    ...applications[applicationIndex],
    status,
    updatedAt: new Date().toISOString(),
  }
  saveList(APPLICATIONS_KEY, applications)
  return { ok: true, application: applications[applicationIndex] }
}

export function createApplication(userId, opportunityId, form) {
  const user = getCurrentUser()
  if (
    user?.role !== 'volunteer' ||
    user.id !== userId ||
    !validId(opportunityId) ||
    !getOpportunityById(opportunityId) ||
    !form
  ) {
    return { ok: false, message: 'Your session or this opportunity is unavailable.' }
  }

  const applications = readApplications()
  const duplicate = applications.some(
    (application) => application.userId === userId && application.opportunityId === opportunityId,
  )

  if (duplicate) {
    return { ok: false, message: 'You have already applied for this opportunity.' }
  }

  const availability = typeof form.availability === 'string' ? form.availability.trim() : ''
  const skillsNotes = typeof form.skillsNotes === 'string' ? form.skillsNotes.trim() : ''
  const motivation = typeof form.motivation === 'string' ? form.motivation.trim() : ''

  if (
    !isSafePlainText(availability, 3, 200) ||
    !isSafePlainText(skillsNotes, 0, 500) ||
    !isSafePlainText(motivation, 20, 600) ||
    form.consent !== true
  ) {
    return { ok: false, message: 'Check the form fields and try again.' }
  }

  const application = {
    id: crypto.randomUUID(),
    userId,
    opportunityId,
    availability,
    skillsNotes,
    motivation,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  }

  applications.push(application)
  saveList(APPLICATIONS_KEY, applications)
  return { ok: true, application }
}
