<script setup>
import { ref } from 'vue'
import { currentUser } from '../services/authService'
import { getApplicationsForUser, getSavedOpportunityIds, toggleSavedOpportunity } from '../services/applicationService'
import { getOpportunityById } from '../services/opportunityStorage'

const savedOpportunities = ref([])
const applications = ref([])

function loadDashboard() {
  const userId = currentUser.value?.id
  if (!userId) return

  savedOpportunities.value = getSavedOpportunityIds(userId)
    .map((opportunityId) => getOpportunityById(opportunityId))
    .filter(Boolean)

  applications.value = getApplicationsForUser(userId)
    .map((application) => ({
      ...application,
      opportunity: getOpportunityById(application.opportunityId),
    }))
    .filter((application) => application.opportunity)
}

function removeSavedOpportunity(opportunityId) {
  toggleSavedOpportunity(currentUser.value.id, opportunityId)
  loadDashboard()
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

loadDashboard()
</script>

<template>
  <section class="dashboard-page container-xxl py-5 py-lg-6">
    <div class="dashboard-heading mb-4">
      <p class="eyebrow mb-2">Volunteer account</p>
      <h1 class="display-6 fw-bold mb-2">Welcome back, {{ currentUser?.name }}.</h1>
      <p class="lead text-secondary mb-0">Your volunteering choices and updates will stay together here.</p>
    </div>

    <div class="row g-3 g-lg-4 mb-4">
      <div class="col-md-4">
        <div class="dashboard-stat h-100 p-4">
          <p class="stat-label mb-2">Saved roles</p>
          <p class="stat-value mb-2">{{ savedOpportunities.length }}</p>
          <p class="small text-secondary mb-0">{{ savedOpportunities.length ? 'Roles kept for later.' : 'No opportunities saved yet.' }}</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="dashboard-stat h-100 p-4">
          <p class="stat-label mb-2">Applications</p>
          <p class="stat-value mb-2">{{ applications.length }}</p>
          <p class="small text-secondary mb-0">{{ applications.length ? 'Expressions of interest submitted.' : 'No expressions of interest yet.' }}</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="dashboard-stat dashboard-stat-accent h-100 p-4">
          <p class="stat-label mb-2">Account type</p>
          <p class="stat-value stat-value-word mb-2">Volunteer</p>
          <p class="small text-secondary mb-0">Browse roles supporting older adults across Melbourne.</p>
        </div>
      </div>
    </div>

    <section class="dashboard-list-section mb-4" aria-labelledby="applications-heading">
      <div class="dashboard-section-heading">
        <div>
          <p class="eyebrow mb-2">Applications</p>
          <h2 id="applications-heading" class="h3 mb-0">Your expressions of interest</h2>
        </div>
        <span class="dashboard-count">{{ applications.length }}</span>
      </div>

      <div v-if="applications.length" class="dashboard-list">
        <article v-for="application in applications" :key="application.id" class="dashboard-list-item">
          <div>
            <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
              <p class="opportunity-cause mb-0">{{ application.opportunity.cause }}</p>
              <span class="application-status" :class="`status-${application.status}`">{{ statusLabel(application.status) }}</span>
            </div>
            <h3 class="h5 mb-1">{{ application.opportunity.title }}</h3>
            <p class="text-secondary mb-2">{{ application.opportunity.organisation }}</p>
            <p class="small text-secondary mb-0">Submitted {{ formatDate(application.submittedAt) }} · Availability: {{ application.availability }}</p>
          </div>
          <RouterLink class="btn btn-outline-primary" :to="`/opportunities/${application.opportunity.id}`">View role</RouterLink>
        </article>
      </div>

      <div v-else class="dashboard-empty">
        <p class="text-secondary mb-3">You have not submitted an expression of interest yet.</p>
        <RouterLink class="btn btn-outline-primary" to="/opportunities">Find an opportunity</RouterLink>
      </div>
    </section>

    <section class="dashboard-list-section mb-4" aria-labelledby="saved-heading">
      <div class="dashboard-section-heading">
        <div>
          <p class="eyebrow mb-2">Saved roles</p>
          <h2 id="saved-heading" class="h3 mb-0">Opportunities to revisit</h2>
        </div>
        <span class="dashboard-count">{{ savedOpportunities.length }}</span>
      </div>

      <div v-if="savedOpportunities.length" class="dashboard-list">
        <article v-for="opportunity in savedOpportunities" :key="opportunity.id" class="dashboard-list-item">
          <div>
            <p class="opportunity-cause mb-1">{{ opportunity.cause }}</p>
            <h3 class="h5 mb-1">{{ opportunity.title }}</h3>
            <p class="text-secondary mb-0">{{ opportunity.organisation }} · {{ opportunity.location }}</p>
          </div>
          <div class="d-flex flex-wrap gap-2">
            <button class="btn btn-light" type="button" @click="removeSavedOpportunity(opportunity.id)">Remove</button>
            <RouterLink class="btn btn-outline-primary" :to="`/opportunities/${opportunity.id}`">View role</RouterLink>
          </div>
        </article>
      </div>

      <div v-else class="dashboard-empty">
        <p class="text-secondary mb-3">Save interesting roles from an opportunity detail page.</p>
        <RouterLink class="btn btn-outline-primary" to="/opportunities">Browse roles</RouterLink>
      </div>
    </section>

    <div class="dashboard-action p-4 p-lg-5">
      <div>
        <p class="eyebrow mb-2">Keep exploring</p>
        <h2 class="h3 mb-2">Find another way to help.</h2>
        <p class="text-secondary mb-0">Compare time, place and support details before choosing your next role.</p>
      </div>
      <RouterLink class="btn btn-primary" to="/opportunities">Browse opportunities</RouterLink>
    </div>
  </section>
</template>
