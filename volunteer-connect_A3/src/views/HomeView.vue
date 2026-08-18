<script setup>
import heroImage from '../assets/opportunities/companion-visitor.webp'
import { getOpportunities } from '../services/opportunityStorage'

const opportunities = getOpportunities()
const featuredOpportunities = opportunities.slice(0, 3)
const primaryOpportunity = featuredOpportunities[0]
const supportingOpportunities = featuredOpportunities.slice(1)
</script>

<template>
  <div class="home-view">
    <section class="home-hero" aria-labelledby="home-heading">
      <img
        class="home-hero-image"
        :src="heroImage"
        alt="A group of volunteers sitting together with their arms around each other"
      />
      <div class="home-hero-shade" aria-hidden="true"></div>

      <div class="container-xxl home-hero-content">
        <p class="home-hero-kicker mb-3">
          <span class="home-hero-marker" aria-hidden="true"></span>
          Student volunteers supporting older Melburnians
        </p>
        <h1 id="home-heading" class="home-hero-title mb-4">Practical support for healthier, more connected ageing.</h1>
        <p class="home-hero-copy mb-4">
          Join food, digital skills, companionship and community health programs that fit around classes, work and everything else.
        </p>
        <div class="home-hero-actions d-flex flex-wrap gap-2">
          <RouterLink class="btn btn-warning btn-lg" to="/opportunities">See open roles</RouterLink>
          <RouterLink class="btn btn-outline-light btn-lg" to="/how-it-works">How it works</RouterLink>
        </div>

        <dl class="home-hero-facts mb-0">
          <div>
            <dt>Support programs</dt>
            <dd>{{ opportunities.length }} open</dd>
          </div>
          <div>
            <dt>Where</dt>
            <dd>Across Melbourne</dd>
          </div>
          <div>
            <dt>Ways to join</dt>
            <dd>On-site and online</dd>
          </div>
        </dl>
      </div>
    </section>

    <section class="home-featured container-xxl py-5" aria-labelledby="featured-heading">
      <header class="home-section-heading mb-4 mb-lg-5">
        <div>
          <p class="eyebrow mb-2">Open this week</p>
          <h2 id="featured-heading" class="home-section-title mb-0">Three ways to support healthy ageing.</h2>
        </div>
        <RouterLink class="home-text-link" to="/opportunities">View all {{ opportunities.length }} roles</RouterLink>
      </header>

      <div v-if="primaryOpportunity" class="home-featured-grid">
        <article class="home-feature-card home-feature-card-main">
          <img
            class="home-feature-image"
            :src="primaryOpportunity.image"
            :alt="primaryOpportunity.imageAlt"
          />
          <div class="home-feature-copy">
            <p class="home-feature-cause mb-2">{{ primaryOpportunity.cause }}</p>
            <h3 class="home-feature-title mb-2">{{ primaryOpportunity.title }}</h3>
            <p class="home-feature-organisation mb-3">{{ primaryOpportunity.organisation }}</p>
            <p class="text-secondary mb-4">{{ primaryOpportunity.summary }}</p>
            <dl class="home-feature-meta mb-4">
              <div>
                <dt>Where</dt>
                <dd>{{ primaryOpportunity.location }}</dd>
              </div>
              <div>
                <dt>When</dt>
                <dd>{{ primaryOpportunity.schedule }}</dd>
              </div>
            </dl>
            <RouterLink class="btn btn-primary" :to="`/opportunities/${primaryOpportunity.id}`">View this role</RouterLink>
          </div>
        </article>

        <article
          v-for="opportunity in supportingOpportunities"
          :key="opportunity.id"
          class="home-feature-card home-feature-card-side"
        >
          <img class="home-feature-image" :src="opportunity.image" :alt="opportunity.imageAlt" />
          <div class="home-feature-copy">
            <p class="home-feature-cause mb-2">{{ opportunity.cause }}</p>
            <h3 class="h4 mb-2">{{ opportunity.title }}</h3>
            <p class="small text-secondary mb-3">{{ opportunity.location }} · {{ opportunity.schedule }}</p>
            <RouterLink class="home-text-link" :to="`/opportunities/${opportunity.id}`">View role</RouterLink>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
