<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { currentUser } from '../services/authService'
import {
  createApplication,
  getApplicationForOpportunity,
  isOpportunitySaved,
  toggleSavedOpportunity,
} from '../services/applicationService'
import { getOpportunityById } from '../services/opportunityStorage'
import { getRatingSummary, getVolunteerRating, saveOpportunityRating } from '../services/ratingService'
import { isSafePlainText } from '../utils/inputValidation'
import BookingCalendar from '../components/BookingCalendar.vue'
import { cacheDraft, clearDraft, isOnline, queueOfflineAction, readDraft } from '../services/offlineService'

const route = useRoute()
const opportunity = computed(() => getOpportunityById(route.params.id))
const isVolunteer = computed(() => currentUser.value?.role === 'volunteer')
const isSaved = ref(false)
const application = ref(null)
const ratingSummary = ref({ average: 0, count: 0 })
const savedRating = ref(null)
const selectedRating = ref(0)
const ratingFeedback = ref({ type: '', message: '' })
const submitError = ref('')
const offlineFeedback = ref('')
const errors = reactive({})
const form = reactive({
  availability: '',
  skillsNotes: '',
  motivation: '',
  consent: false,
})

watch(form, (value) => {
  if (opportunity.value) cacheDraft(`application_${opportunity.value.id}`, value)
}, { deep: true })

watch([opportunity, currentUser], () => {
  const userId = currentUser.value?.id
  const opportunityId = opportunity.value?.id
  isSaved.value = Boolean(userId && opportunityId && isOpportunitySaved(userId, opportunityId))
  application.value = userId && opportunityId
    ? getApplicationForOpportunity(userId, opportunityId)
    : null
  ratingSummary.value = opportunityId
    ? getRatingSummary(opportunityId)
    : { average: 0, count: 0 }
  savedRating.value = opportunityId ? getVolunteerRating(opportunityId) : null
  selectedRating.value = savedRating.value?.score || 0
  ratingFeedback.value = { type: '', message: '' }
  if (opportunityId) {
    const draft = readDraft(`application_${opportunityId}`, {})
    Object.assign(form, { availability: '', skillsNotes: '', motivation: '', consent: false, ...draft })
  }
}, { immediate: true })

function changeSavedStatus() {
  if (!isVolunteer.value || !opportunity.value) return
  isSaved.value = toggleSavedOpportunity(currentUser.value.id, opportunity.value.id)
}

function validateForm() {
  Object.keys(errors).forEach((key) => delete errors[key])

  const availability = form.availability.trim()
  const motivation = form.motivation.trim()

  if (!isSafePlainText(availability, 3, 200)) {
    errors.availability = 'Use 3 to 200 plain-text characters without HTML brackets.'
  }
  if (!isSafePlainText(form.skillsNotes, 0, 500)) {
    errors.skillsNotes = 'Use up to 500 plain-text characters without HTML brackets.'
  }
  if (!isSafePlainText(motivation, 20, 600)) {
    errors.motivation = 'Use 20 to 600 plain-text characters without HTML brackets.'
  }
  if (!form.consent) errors.consent = 'Confirm that the information is accurate before submitting.'

  return Object.keys(errors).length === 0
}

function submitApplication() {
  submitError.value = ''
  offlineFeedback.value = ''
  if (!isVolunteer.value || !opportunity.value || !validateForm()) return

  if (!isOnline.value) {
    queueOfflineAction({ type: 'application', opportunityId: opportunity.value.id, userId: currentUser.value.id, form: { ...form } })
    offlineFeedback.value = 'Your application draft has been queued on this device. Reconnect before submitting it to the coordinator.'
    return
  }

  const result = createApplication(currentUser.value.id, opportunity.value.id, form)
  if (!result.ok) {
    submitError.value = result.message
    return
  }

  application.value = result.application
  clearDraft(`application_${opportunity.value.id}`)
}

function chooseRating(score) {
  selectedRating.value = score
  ratingFeedback.value = { type: '', message: '' }
}

function submitRating() {
  if (!opportunity.value) return

  const result = saveOpportunityRating(opportunity.value.id, selectedRating.value)
  if (!result.ok) {
    ratingFeedback.value = { type: 'error', message: result.message }
    return
  }

  savedRating.value = result.rating
  ratingSummary.value = result.summary
  ratingFeedback.value = {
    type: 'success',
    message: result.updated ? 'Your rating has been updated.' : 'Your rating has been saved.',
  }
}
</script>

<template>
  <div v-if="opportunity" class="opportunity-detail-view">
    <header class="detail-header border-bottom">
      <div class="container-xxl py-4 py-lg-5">
        <RouterLink class="back-link" to="/opportunities">Back to opportunities</RouterLink>
        <div class="row align-items-end g-4 mt-1">
          <div class="col-lg-7">
            <p class="eyebrow mb-2">{{ opportunity.cause }}</p>
            <h1 class="display-5 fw-bold mb-2">{{ opportunity.title }}</h1>
            <p class="h5 organisation-name mb-3">{{ opportunity.organisation }}</p>
            <div class="d-flex flex-wrap gap-2">
              <span class="role-tag">{{ opportunity.deliveryMode }}</span>
              <span class="role-tag">{{ opportunity.commitment }}</span>
              <span v-if="opportunity.beginnerFriendly" class="role-tag role-tag-accent">Beginner friendly</span>
            </div>
          </div>
          <div class="col-lg-5">
            <img class="detail-image" :src="opportunity.image" :alt="opportunity.imageAlt" />
          </div>
        </div>
      </div>
    </header>

    <div class="container-xxl py-4 py-lg-5">
      <div class="row g-4 g-xl-5">
        <div class="col-lg-8">
          <p class="detail-summary lead mb-5">{{ opportunity.summary }}</p>

          <section class="detail-section" aria-labelledby="tasks-heading">
            <p class="section-number" aria-hidden="true">01</p>
            <h2 id="tasks-heading" class="h3">What you will do</h2>
            <ul class="detail-list">
              <li v-for="task in opportunity.tasks" :key="task">{{ task }}</li>
            </ul>
          </section>

          <section class="detail-section" aria-labelledby="requirements-heading">
            <p class="section-number" aria-hidden="true">02</p>
            <h2 id="requirements-heading" class="h3">Requirements</h2>
            <ul class="detail-list">
              <li v-for="requirement in opportunity.requirements" :key="requirement">{{ requirement }}</li>
            </ul>
          </section>

          <section class="detail-section" aria-labelledby="support-heading">
            <p class="section-number" aria-hidden="true">03</p>
            <h2 id="support-heading" class="h3">Training and support</h2>
            <p class="text-secondary mb-0">{{ opportunity.training }}</p>
          </section>

          <section class="detail-section" aria-labelledby="access-heading">
            <p class="section-number" aria-hidden="true">04</p>
            <h2 id="access-heading" class="h3">Accessibility and transport</h2>
            <p class="text-secondary">{{ opportunity.accessibility }}</p>
            <p class="text-secondary mb-0">{{ opportunity.transport }}</p>
          </section>

          <section class="impact-section p-4 p-lg-5" aria-labelledby="impact-heading">
            <p class="eyebrow mb-2">Community impact</p>
            <h2 id="impact-heading" class="h3 mb-3">Why this role matters</h2>
            <p class="mb-0">{{ opportunity.impact }}</p>
          </section>

          <section class="rating-section mt-4 p-4 p-lg-5" aria-labelledby="rating-heading">
            <div class="rating-layout">
              <div class="rating-summary">
                <p class="eyebrow mb-2">Role information rating</p>
                <h2 id="rating-heading" class="h3 mb-3">Is this information clear and useful?</h2>
                <div class="d-flex align-items-end gap-2 mb-2">
                  <span class="rating-score">{{ ratingSummary.average.toFixed(1) }}</span>
                  <span class="rating-out-of">out of 5</span>
                </div>
                <div class="aggregate-stars mb-2" :aria-label="`Average rating ${ratingSummary.average.toFixed(1)} out of 5`">
                  <span
                    v-for="star in 5"
                    :key="star"
                    :class="{ active: star <= Math.round(ratingSummary.average) }"
                    aria-hidden="true"
                  >&#9733;</span>
                </div>
                <p class="small text-secondary mb-0">
                  {{ ratingSummary.count }} rating{{ ratingSummary.count === 1 ? '' : 's' }}
                </p>
              </div>

              <form v-if="isVolunteer" class="rating-form" @submit.prevent="submitRating">
                <p class="h5 mb-2">{{ savedRating ? 'Update your rating' : 'Add your rating' }}</p>
                <p class="small text-secondary mb-3">Choose the score that best reflects the clarity of this role information.</p>
                <div class="star-picker mb-3" role="radiogroup" aria-label="Your rating">
                  <button
                    v-for="star in 5"
                    :key="star"
                    class="rating-star-button"
                    :class="{ active: star <= selectedRating }"
                    type="button"
                    role="radio"
                    :aria-checked="selectedRating === star"
                    :aria-label="`${star} star${star === 1 ? '' : 's'}`"
                    @click="chooseRating(star)"
                  >
                    <span aria-hidden="true">&#9733;</span>
                  </button>
                </div>
                <button class="btn btn-primary" type="submit" :disabled="selectedRating === 0">
                  {{ savedRating ? 'Update rating' : 'Save rating' }}
                </button>
                <p
                  v-if="ratingFeedback.message"
                  class="rating-feedback mb-0"
                  :class="ratingFeedback.type === 'success' ? 'rating-feedback-success' : 'field-error'"
                  role="status"
                >
                  {{ ratingFeedback.message }}
                </p>
              </form>

              <div v-else-if="!currentUser" class="rating-form">
                <p class="h5 mb-2">Share your rating</p>
                <p class="small text-secondary mb-3">Sign in with a volunteer account to rate this role information.</p>
                <RouterLink class="btn btn-outline-primary" :to="{ name: 'login', query: { redirect: route.fullPath } }">Sign in to rate</RouterLink>
              </div>

              <div v-else class="rating-form">
                <p class="h5 mb-2">Volunteer ratings</p>
                <p class="small text-secondary mb-0">Coordinator accounts can view the aggregate result but cannot submit a rating.</p>
              </div>
            </div>
          </section>

          <section id="expression-of-interest" class="application-section mt-4 p-4 p-lg-5" aria-labelledby="application-heading">
            <p class="eyebrow mb-2">Expression of interest</p>
            <h2 id="application-heading" class="h3 mb-3">Apply for this role</h2>

            <div v-if="application" class="application-confirmation" role="status">
              <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
                <p class="h5 mb-0">Application received</p>
                <span class="application-status status-pending">Pending</span>
              </div>
              <p class="text-secondary mb-3">The coordinator can now review your availability and interest in the role.</p>
              <RouterLink class="btn btn-outline-primary" to="/volunteer/dashboard">View your applications</RouterLink>
            </div>

            <form v-else-if="isVolunteer" novalidate @submit.prevent="submitApplication">
              <p class="text-secondary mb-4">Share enough detail for the coordinator to understand when and how you can help.</p>
              <div v-if="submitError" class="form-alert mb-4" role="alert">{{ submitError }}</div>
              <div v-if="offlineFeedback" class="application-confirmation mb-4" role="status">{{ offlineFeedback }}</div>

              <div class="mb-3">
                <label class="form-label" for="application-availability">Your availability</label>
                <input
                  id="application-availability"
                  v-model="form.availability"
                  class="form-control"
                  type="text"
                  maxlength="200"
                  placeholder="For example: Saturdays from 9 am to 2 pm"
                  :aria-invalid="Boolean(errors.availability)"
                  required
                />
                <p v-if="errors.availability" class="field-error">{{ errors.availability }}</p>
              </div>

              <div class="mb-3">
                <label class="form-label" for="application-skills">Skills or notes <span class="fw-normal text-secondary">(optional)</span></label>
                <textarea
                  id="application-skills"
                  v-model="form.skillsNotes"
                  class="form-control"
                  rows="3"
                  maxlength="500"
                  placeholder="Mention useful experience, access needs or questions"
                  :aria-invalid="Boolean(errors.skillsNotes)"
                ></textarea>
                <p v-if="errors.skillsNotes" class="field-error">{{ errors.skillsNotes }}</p>
              </div>

              <div class="mb-3">
                <label class="form-label" for="application-motivation">Why are you interested?</label>
                <textarea
                  id="application-motivation"
                  v-model="form.motivation"
                  class="form-control"
                  rows="4"
                  maxlength="600"
                  placeholder="Briefly explain what interests you about this role"
                  :aria-invalid="Boolean(errors.motivation)"
                  required
                ></textarea>
                <p v-if="errors.motivation" class="field-error">{{ errors.motivation }}</p>
              </div>

              <div class="form-check mb-4">
                <input id="application-consent" v-model="form.consent" class="form-check-input" type="checkbox" />
                <label class="form-check-label" for="application-consent">I confirm that these details are accurate and may be shared with the role coordinator.</label>
                <p v-if="errors.consent" class="field-error">{{ errors.consent }}</p>
              </div>

              <button class="btn btn-primary" type="submit">Submit expression of interest</button>
            </form>

            <div v-else-if="!currentUser" class="application-sign-in">
              <p class="text-secondary mb-3">Sign in with a volunteer account to send an expression of interest.</p>
              <RouterLink class="btn btn-primary" :to="{ name: 'login', query: { redirect: route.fullPath } }">Sign in to apply</RouterLink>
            </div>

            <p v-else class="text-secondary mb-0">Coordinator accounts can review applications from the coordinator dashboard, but cannot apply for roles.</p>
          </section>

          <BookingCalendar v-if="opportunity" :opportunity="opportunity" class="mt-4" />
        </div>

        <aside class="col-lg-4" aria-label="Opportunity facts">
          <div class="detail-facts-panel p-4">
            <div class="d-flex justify-content-between align-items-center gap-2 mb-4">
              <h2 class="h5 mb-0">At a glance</h2>
              <span v-if="opportunity.verified" class="verified-label">Verified</span>
            </div>
            <dl class="detail-facts mb-0">
              <div>
                <dt>Location</dt>
                <dd>{{ opportunity.location }}</dd>
              </div>
              <div>
                <dt>Schedule</dt>
                <dd>{{ opportunity.schedule }}</dd>
              </div>
              <div>
                <dt>Time needed</dt>
                <dd>{{ opportunity.duration }}</dd>
              </div>
              <div>
                <dt>Delivery mode</dt>
                <dd>{{ opportunity.deliveryMode }}</dd>
              </div>
              <div>
                <dt>Experience</dt>
                <dd>{{ opportunity.experience }}</dd>
              </div>
            </dl>
          </div>

          <div class="detail-action-panel p-4 mt-3">
            <template v-if="isVolunteer">
              <p class="h5 mb-2">Keep track of this role</p>
              <p class="small text-secondary mb-3">Saved opportunities appear on your volunteer dashboard.</p>
              <button class="btn w-100" :class="isSaved ? 'btn-light' : 'btn-outline-primary'" type="button" @click="changeSavedStatus">
                {{ isSaved ? 'Remove from saved roles' : 'Save opportunity' }}
              </button>
              <a v-if="!application" class="btn btn-primary w-100 mt-2" href="#expression-of-interest">Apply now</a>
            </template>
            <template v-else-if="!currentUser">
              <p class="h5 mb-2">Interested in this role?</p>
              <p class="small text-secondary mb-3">Sign in to save the opportunity or submit an application.</p>
              <RouterLink class="btn btn-outline-primary w-100" :to="{ name: 'login', query: { redirect: route.fullPath } }">Sign in</RouterLink>
            </template>
            <template v-else>
              <p class="h5 mb-2">Coordinator view</p>
              <p class="small text-secondary mb-0">Use your dashboard to manage applications.</p>
            </template>
          </div>
        </aside>
      </div>
    </div>
  </div>

  <section v-else class="container-xxl py-5 py-lg-6">
    <div class="empty-state p-4 p-lg-5 text-center">
      <p class="eyebrow mb-2">Opportunity unavailable</p>
      <h1 class="display-6 fw-bold mb-3">We could not find that role.</h1>
      <p class="lead text-secondary mb-4">It may have been removed or the address may be incorrect.</p>
      <RouterLink class="btn btn-primary" to="/opportunities">Browse current opportunities</RouterLink>
    </div>
  </section>
</template>
