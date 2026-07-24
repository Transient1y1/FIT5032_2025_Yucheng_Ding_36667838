import { getCurrentUser } from './authService'

const RATINGS_KEY = 'vc_ratings'

function readRatings() {
  const storedRatings = localStorage.getItem(RATINGS_KEY)
  if (!storedRatings) return []

  try {
    const ratings = JSON.parse(storedRatings)
    if (!Array.isArray(ratings)) return []

    return ratings.filter((rating) => (
      rating &&
      typeof rating.id === 'string' &&
      typeof rating.userId === 'string' &&
      typeof rating.opportunityId === 'string' &&
      Number.isInteger(rating.score) &&
      rating.score >= 1 &&
      rating.score <= 5 &&
      typeof rating.createdAt === 'string' &&
      typeof rating.updatedAt === 'string'
    ))
  } catch {
    return []
  }
}

function saveRatings(ratings) {
  localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings))
}

export function getRatingSummary(opportunityId) {
  const ratings = readRatings().filter((rating) => rating.opportunityId === opportunityId)
  const total = ratings.reduce((sum, rating) => sum + rating.score, 0)

  return {
    average: ratings.length ? Math.round((total / ratings.length) * 10) / 10 : 0,
    count: ratings.length,
  }
}

export function getVolunteerRating(opportunityId) {
  const user = getCurrentUser()
  if (user?.role !== 'volunteer') return null

  return readRatings().find(
    (rating) => rating.userId === user.id && rating.opportunityId === opportunityId,
  ) || null
}

export function saveOpportunityRating(opportunityId, score) {
  const user = getCurrentUser()
  if (user?.role !== 'volunteer') {
    return { ok: false, message: 'A volunteer account is required to rate this opportunity.' }
  }

  if (typeof opportunityId !== 'string' || !Number.isInteger(score) || score < 1 || score > 5) {
    return { ok: false, message: 'Choose a rating from 1 to 5 stars.' }
  }

  const ratings = readRatings()
  const ratingIndex = ratings.findIndex(
    (rating) => rating.userId === user.id && rating.opportunityId === opportunityId,
  )
  const now = new Date().toISOString()
  let rating
  let updated = false

  if (ratingIndex >= 0) {
    rating = { ...ratings[ratingIndex], score, updatedAt: now }
    ratings[ratingIndex] = rating
    updated = true
  } else {
    rating = {
      id: crypto.randomUUID(),
      userId: user.id,
      opportunityId,
      score,
      createdAt: now,
      updatedAt: now,
    }
    ratings.push(rating)
  }

  saveRatings(ratings)
  return {
    ok: true,
    rating,
    updated,
    summary: getRatingSummary(opportunityId),
  }
}
