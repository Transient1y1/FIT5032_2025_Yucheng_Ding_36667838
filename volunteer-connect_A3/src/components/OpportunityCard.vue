<script setup>
defineProps({
  opportunity: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="opportunity-card">
    <div class="row g-0 h-100">
      <div class="col-sm-4 col-xl-3">
        <img
          class="opportunity-card-image"
          :src="opportunity.image"
          :alt="opportunity.imageAlt"
        />
      </div>
      <div class="col-sm-8 col-xl-9">
        <div class="opportunity-card-body h-100 p-3 p-lg-4">
          <div class="d-flex flex-wrap justify-content-between gap-2 mb-2">
            <p class="opportunity-cause mb-0">{{ opportunity.cause }}</p>
            <span v-if="opportunity.verified" class="verified-label">Verified organisation</span>
          </div>

          <h2 class="h4 mb-1">{{ opportunity.title }}</h2>
          <p class="organisation-name mb-3">{{ opportunity.organisation }}</p>
          <p class="text-secondary mb-3">{{ opportunity.summary }}</p>

          <dl class="opportunity-facts mb-4">
            <div>
              <dt>Location</dt>
              <dd>{{ opportunity.location }}</dd>
            </div>
            <div>
              <dt>Schedule</dt>
              <dd>{{ opportunity.schedule }}</dd>
            </div>
            <div>
              <dt>Mode</dt>
              <dd>{{ opportunity.deliveryMode }}</dd>
            </div>
          </dl>

          <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-auto">
            <div class="d-flex flex-wrap gap-2">
              <span class="role-tag">{{ opportunity.commitment }}</span>
              <span v-if="opportunity.beginnerFriendly" class="role-tag role-tag-accent">Beginner friendly</span>
            </div>
            <RouterLink class="btn btn-primary" :to="`/opportunities/${opportunity.id}`">
              View role
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
