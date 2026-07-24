import { seedOpportunities } from '../data/opportunities'
import { isSafePlainText, isValidIdentifier } from '../utils/inputValidation'

const STORAGE_KEY = 'vc_opportunities_v2'
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
    isValidIdentifier(value.id) &&
    seedOpportunities.some((opportunity) => opportunity.id === value.id) &&
    REQUIRED_TEXT_FIELDS
      .filter((field) => field !== 'id')
      .every((field) => isSafePlainText(value[field], 1, 2000)) &&
    Array.isArray(value.tasks) &&
    value.tasks.every((task) => isSafePlainText(task, 1, 500)) &&
    Array.isArray(value.requirements) &&
    value.requirements.every((requirement) => isSafePlainText(requirement, 1, 500))
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
