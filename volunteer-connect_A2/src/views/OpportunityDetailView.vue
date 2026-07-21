<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getOpportunityById } from '../services/opportunityStorage'

const route = useRoute()
const opportunity = computed(() => getOpportunityById(route.params.id))
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
