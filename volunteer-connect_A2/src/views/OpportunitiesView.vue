<script setup>
import { computed, reactive, ref } from 'vue'
import OpportunityCard from '../components/OpportunityCard.vue'
import { getOpportunities } from '../services/opportunityStorage'

const opportunities = ref(getOpportunities())
const filters = reactive({
  keyword: '',
  cause: '',
  location: '',
  deliveryMode: '',
  commitment: '',
  experience: '',
})

function uniqueValues(field) {
  return [...new Set(opportunities.value.map((opportunity) => opportunity[field]))].sort()
}

const causes = computed(() => uniqueValues('cause'))
const locations = computed(() => uniqueValues('location'))
const deliveryModes = computed(() => uniqueValues('deliveryMode'))
const commitments = computed(() => uniqueValues('commitment'))
const experienceLevels = computed(() => uniqueValues('experience'))

const filteredOpportunities = computed(() => {
  const keyword = filters.keyword.trim().toLowerCase()

  return opportunities.value.filter((opportunity) => {
    const searchableText = [
      opportunity.title,
      opportunity.organisation,
      opportunity.cause,
      opportunity.location,
      opportunity.summary,
    ].join(' ').toLowerCase()

    return (
      (!keyword || searchableText.includes(keyword)) &&
      (!filters.cause || opportunity.cause === filters.cause) &&
      (!filters.location || opportunity.location === filters.location) &&
      (!filters.deliveryMode || opportunity.deliveryMode === filters.deliveryMode) &&
      (!filters.commitment || opportunity.commitment === filters.commitment) &&
      (!filters.experience || opportunity.experience === filters.experience)
    )
  })
})

const hasActiveFilters = computed(() => Object.values(filters).some(Boolean))

function clearFilters() {
  Object.keys(filters).forEach((key) => {
    filters[key] = ''
  })
}
</script>

<template>
  <div class="opportunities-view">
    <header class="directory-header border-bottom">
      <div class="container-xxl py-4 py-lg-5">
        <p class="eyebrow mb-2">Older adult health support</p>
        <div class="row align-items-end g-3">
          <div class="col-lg-7">
            <h1 class="display-6 fw-bold mb-2">Make your next free hour count.</h1>
            <p class="lead text-secondary mb-0">Compare practical details and choose a role supporting older adults that works with your study week.</p>
          </div>
          <div class="col-lg-5">
            <label class="form-label fw-semibold" for="opportunity-search">Search opportunities</label>
            <input
              id="opportunity-search"
              v-model="filters.keyword"
              class="form-control form-control-lg"
              type="search"
              maxlength="80"
              placeholder="Role, support area or place"
            />
          </div>
        </div>
      </div>
    </header>

    <div class="container-xxl py-4 py-lg-5">
      <button
        class="btn btn-outline-primary filter-toggle d-lg-none w-100 mb-3"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#directory-filters"
        aria-controls="directory-filters"
      >
        Filter opportunities
      </button>

      <div class="row g-4 g-xl-5">
        <aside class="col-lg-3" aria-label="Opportunity filters">
          <div id="directory-filters" class="collapse d-lg-block filter-panel p-4">
            <div class="d-flex justify-content-between align-items-center gap-2 mb-4">
              <h2 class="h5 mb-0">Filters</h2>
              <button v-if="hasActiveFilters" class="btn btn-link btn-sm p-0" type="button" @click="clearFilters">
                Reset
              </button>
            </div>

            <div class="mb-3">
              <label class="form-label" for="cause-filter">Cause</label>
              <select id="cause-filter" v-model="filters.cause" class="form-select">
                <option value="">All causes</option>
                <option v-for="cause in causes" :key="cause" :value="cause">{{ cause }}</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label" for="location-filter">Location</label>
              <select id="location-filter" v-model="filters.location" class="form-select">
                <option value="">All locations</option>
                <option v-for="location in locations" :key="location" :value="location">{{ location }}</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label" for="mode-filter">Delivery mode</label>
              <select id="mode-filter" v-model="filters.deliveryMode" class="form-select">
                <option value="">All modes</option>
                <option v-for="mode in deliveryModes" :key="mode" :value="mode">{{ mode }}</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label" for="commitment-filter">Commitment</label>
              <select id="commitment-filter" v-model="filters.commitment" class="form-select">
                <option value="">Any commitment</option>
                <option v-for="commitment in commitments" :key="commitment" :value="commitment">{{ commitment }}</option>
              </select>
            </div>

            <div>
              <label class="form-label" for="experience-filter">Experience</label>
              <select id="experience-filter" v-model="filters.experience" class="form-select">
                <option value="">Any experience level</option>
                <option v-for="level in experienceLevels" :key="level" :value="level">{{ level }}</option>
              </select>
            </div>
          </div>
        </aside>

        <section class="col-lg-9" aria-live="polite" aria-labelledby="results-heading">
          <div class="results-heading d-flex flex-wrap justify-content-between align-items-baseline gap-2 mb-3">
            <h2 id="results-heading" class="h5 mb-0">
              {{ filteredOpportunities.length }} {{ filteredOpportunities.length === 1 ? 'opportunity' : 'opportunities' }}
            </h2>
            <p class="small text-secondary mb-0">Student volunteer roles supporting older adults</p>
          </div>

          <div v-if="filteredOpportunities.length" class="d-grid gap-3">
            <OpportunityCard
              v-for="opportunity in filteredOpportunities"
              :key="opportunity.id"
              :opportunity="opportunity"
            />
          </div>

          <div v-else class="empty-state p-4 p-lg-5 text-center">
            <p class="eyebrow mb-2">No matching roles</p>
            <h2 class="h4 mb-2">Try a broader search.</h2>
            <p class="text-secondary mb-4">Clear one or more filters to see other older adult health support roles.</p>
            <button class="btn btn-primary" type="button" @click="clearFilters">Reset filters</button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
