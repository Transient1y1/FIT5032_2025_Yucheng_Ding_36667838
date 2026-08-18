<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const page = computed(() => route.meta)
</script>

<template>
  <section class="placeholder-view container-xxl py-5 py-lg-6">
    <div class="placeholder-panel p-4 p-lg-5">
      <p class="eyebrow mb-2">{{ page.eyebrow }}</p>
      <h1 class="display-6 fw-bold mb-3">{{ page.title }}</h1>
      <p class="lead text-secondary mb-0 placeholder-copy">{{ page.description }}</p>
    </div>
  </section>
</template>
