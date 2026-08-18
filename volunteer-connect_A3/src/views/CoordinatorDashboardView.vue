<script setup>
import { computed, ref } from 'vue'
import { currentUser, getUserForCoordinator } from '../services/authService'
import { getApplicationsForCoordinator, updateApplicationStatus } from '../services/applicationService'
import { getOpportunities, getOpportunityById } from '../services/opportunityStorage'
import { apiEnabled, apiListApplications, apiUpdateApplicationStatus } from '../services/apiService'

const applications = ref([])
const feedback = ref({ applicationId: '', type: '', message: '' })
const publishedCount = computed(() => getOpportunities().length)
const pendingCount = computed(() => applications.value.filter((application) => application.status === 'pending').length)
const statusOptions = [
  { value: 'accepted', label: 'Accept' },
  { value: 'waitlisted', label: 'Waitlist' },
  { value: 'declined', label: 'Decline' },
  { value: 'more-information', label: 'Request more information' },
]

const applicationGroups = computed(() => {
  const groups = new Map()

  applications.value.forEach((application) => {
    const opportunityId = application.opportunity.id
    if (!groups.has(opportunityId)) {
      groups.set(opportunityId, {
        opportunity: application.opportunity,
        applications: [],
      })
    }
    groups.get(opportunityId).applications.push(application)
  })

  return Array.from(groups.values())
})

async function loadApplications() {
  const localApplications = getApplicationsForCoordinator()
  let remoteApplications = null
  if (apiEnabled) {
    const result = await apiListApplications()
    if (result.ok) remoteApplications = result.data || []
  }
  applications.value = (remoteApplications || localApplications)
    .map((application) => ({
      ...application,
      applicant: application.applicantName
        ? { name: application.applicantName, email: application.applicantEmail }
        : getUserForCoordinator(application.userId),
      opportunity: getOpportunityById(application.opportunityId),
      nextStatus: application.status === 'pending' ? '' : application.status,
    }))
    .filter((application) => application.opportunity)
}

async function saveStatus(application) {
  feedback.value = { applicationId: '', type: '', message: '' }

  if (!application.nextStatus) {
    feedback.value = {
      applicationId: application.id,
      type: 'error',
      message: 'Choose a review outcome first.',
    }
    return
  }

  const result = apiEnabled
    ? await apiUpdateApplicationStatus(application.id, application.nextStatus)
    : updateApplicationStatus(application.id, application.nextStatus)
  if (!result.ok) {
    feedback.value = {
      applicationId: application.id,
      type: 'error',
      message: result.message,
    }
    return
  }

  application.status = result.data?.status || result.application?.status
  feedback.value = {
    applicationId: application.id,
    type: 'success',
    message: 'Application status updated.',
  }
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function statusLabel(status) {
  const labels = {
    pending: 'Pending',
    accepted: 'Accepted',
    waitlisted: 'Waitlisted',
    declined: 'Declined',
    'more-information': 'More information requested',
  }
  return labels[status] || status
}

loadApplications()
</script>

<template>
  <section class="dashboard-page container-xxl py-5 py-lg-6">
    <div class="dashboard-heading mb-4">
      <p class="eyebrow mb-2">Coordinator account</p>
      <h1 class="display-6 fw-bold mb-2">Application review.</h1>
      <p class="lead text-secondary mb-0">Welcome, {{ currentUser?.name }}. Review each volunteer's availability and interest before updating their outcome.</p>
    </div>

    <div class="row g-3 g-lg-4 mb-4">
      <div class="col-md-4">
        <div class="dashboard-stat h-100 p-4">
          <p class="stat-label mb-2">Directory opportunities</p>
          <p class="stat-value mb-2">{{ publishedCount }}</p>
          <p class="small text-secondary mb-0">Public roles currently available in the directory.</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="dashboard-stat h-100 p-4">
          <p class="stat-label mb-2">Applications</p>
          <p class="stat-value mb-2">{{ applications.length }}</p>
          <p class="small text-secondary mb-0">Expressions of interest received from volunteers.</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="dashboard-stat dashboard-stat-accent h-100 p-4">
          <p class="stat-label mb-2">Pending review</p>
          <p class="stat-value mb-2">{{ pendingCount }}</p>
          <p class="small text-secondary mb-0">Applications that still need an outcome.</p>
        </div>
      </div>
    </div>

    <section class="coordinator-review" aria-labelledby="review-heading">
      <div class="dashboard-section-heading">
        <div>
          <p class="eyebrow mb-2">Applicant review</p>
          <h2 id="review-heading" class="h3 mb-0">Applications by opportunity</h2>
        </div>
        <span class="dashboard-count">{{ applications.length }}</span>
      </div>

      <div v-if="applicationGroups.length">
        <section v-for="group in applicationGroups" :key="group.opportunity.id" class="review-group">
          <header class="review-group-heading">
            <div>
              <p class="opportunity-cause mb-1">{{ group.opportunity.cause }}</p>
              <h3 class="h4 mb-1">{{ group.opportunity.title }}</h3>
              <p class="small text-secondary mb-0">{{ group.opportunity.organisation }}</p>
            </div>
            <span class="review-total">{{ group.applications.length }} applicant{{ group.applications.length === 1 ? '' : 's' }}</span>
          </header>

          <article v-for="application in group.applications" :key="application.id" class="review-item">
            <div class="review-applicant-heading">
              <div>
                <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
                  <h4 class="h5 mb-0">{{ application.applicant?.name || 'Volunteer account unavailable' }}</h4>
                  <span class="application-status" :class="`status-${application.status}`">{{ statusLabel(application.status) }}</span>
                </div>
                <p class="small text-secondary mb-0">
                  {{ application.applicant?.email || 'Email unavailable' }} · Submitted {{ formatDate(application.submittedAt) }}
                </p>
              </div>
            </div>

            <div class="review-answer-grid">
              <div>
                <p class="review-label">Availability</p>
                <p class="mb-0">{{ application.availability }}</p>
              </div>
              <div>
                <p class="review-label">Skills and notes</p>
                <p class="mb-0">{{ application.skillsNotes || 'No additional notes provided.' }}</p>
              </div>
              <div class="review-motivation">
                <p class="review-label">Motivation</p>
                <p class="mb-0">{{ application.motivation }}</p>
              </div>
            </div>

            <div class="review-controls">
              <div class="review-status-field">
                <label class="form-label" :for="`status-${application.id}`">Review outcome</label>
                <select :id="`status-${application.id}`" v-model="application.nextStatus" class="form-select">
                  <option value="" disabled>Select an outcome</option>
                  <option v-for="option in statusOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                </select>
              </div>
              <button class="btn btn-primary" type="button" @click="saveStatus(application)">Update status</button>
              <p
                v-if="feedback.applicationId === application.id"
                class="review-feedback mb-0"
                :class="feedback.type === 'success' ? 'review-feedback-success' : 'field-error'"
                role="status"
              >
                {{ feedback.message }}
              </p>
            </div>
          </article>
        </section>
      </div>

      <div v-else class="dashboard-empty">
        <p class="text-secondary mb-3">No volunteer applications have been submitted yet.</p>
        <RouterLink class="btn btn-outline-primary" to="/opportunities">View public opportunities</RouterLink>
      </div>
    </section>

    <div class="dashboard-action p-4 p-lg-5 mt-4">
      <div>
        <p class="eyebrow mb-2">Opportunity directory</p>
        <h2 class="h3 mb-2">Check what volunteers see.</h2>
        <p class="text-secondary mb-0">Review the schedule, support and access details published with each role.</p>
      </div>
      <RouterLink class="btn btn-primary" to="/opportunities">View opportunities</RouterLink>
    </div>
  </section>
</template>
