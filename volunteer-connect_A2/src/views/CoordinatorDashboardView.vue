<script setup>
import { computed } from 'vue'
import { currentUser } from '../services/authService'
import { getOpportunities } from '../services/opportunityStorage'

const publishedCount = computed(() => getOpportunities().length)
</script>

<template>
  <section class="dashboard-page container-xxl py-5 py-lg-6">
    <div class="dashboard-heading mb-4">
      <p class="eyebrow mb-2">Coordinator account</p>
      <h1 class="display-6 fw-bold mb-2">Coordinator workspace.</h1>
      <p class="lead text-secondary mb-0">Welcome, {{ currentUser.name }}. Keep your organisation's opportunities clear and practical.</p>
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
          <p class="stat-label mb-2">Applicant reviews</p>
          <p class="stat-value mb-2">0</p>
          <p class="small text-secondary mb-0">No applications are waiting for review.</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="dashboard-stat dashboard-stat-accent h-100 p-4">
          <p class="stat-label mb-2">Account type</p>
          <p class="stat-value stat-value-word mb-2">Coordinator</p>
          <p class="small text-secondary mb-0">Coordinator pages are protected from volunteer accounts.</p>
        </div>
      </div>
    </div>

    <div class="dashboard-action p-4 p-lg-5">
      <div>
        <p class="eyebrow mb-2">Opportunity directory</p>
        <h2 class="h3 mb-2">Review the public role information.</h2>
        <p class="text-secondary mb-0">Check the practical details students see before they express interest.</p>
      </div>
      <RouterLink class="btn btn-primary" to="/opportunities">View opportunities</RouterLink>
    </div>
  </section>
</template>
