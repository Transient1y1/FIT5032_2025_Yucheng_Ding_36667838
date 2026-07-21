import { seedOpportunities } from '../data/opportunities'

const STORAGE_KEY = 'vc_opportunities'
const REQUIRED_TEXT_FIELDS = [
  'id',
  'title',
  'organisation',
  'cause',
  'location',
  'deliveryMode',
  'commitment',
  'schedule',
  'duration',
  'experience',
  'summary',
  'training',
  'accessibility',
  'transport',
  'impact',
]

function cloneSeeds() {
  return seedOpportunities.map((opportunity) => ({ ...opportunity }))
}

function withoutBundledImage(opportunity) {
  const { image, ...storedOpportunity } = opportunity
  return storedOpportunity
}

function restoreBundledImages(opportunities) {
  return opportunities.map((opportunity) => {
    const seed = seedOpportunities.find((item) => item.id === opportunity.id)
    return seed ? { ...opportunity, image: seed.image, imageAlt: seed.imageAlt } : opportunity
  })
}

function isValidOpportunity(value) {
  return (
    value &&
    REQUIRED_TEXT_FIELDS.every((field) => typeof value[field] === 'string' && value[field].trim()) &&
    Array.isArray(value.tasks) &&
    Array.isArray(value.requirements)
  )
}

export function getOpportunities() {
  const storedValue = localStorage.getItem(STORAGE_KEY)

  if (storedValue) {
    try {
      const parsedValue = JSON.parse(storedValue)
      if (Array.isArray(parsedValue) && parsedValue.length > 0 && parsedValue.every(isValidOpportunity)) {
        return restoreBundledImages(parsedValue)
      }
    } catch {
      // Invalid local data is replaced with the known seed records below.
    }
  }

  const opportunities = cloneSeeds()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(opportunities.map(withoutBundledImage)))
  return opportunities
}

export function getOpportunityById(id) {
  return getOpportunities().find((opportunity) => opportunity.id === id)
}
