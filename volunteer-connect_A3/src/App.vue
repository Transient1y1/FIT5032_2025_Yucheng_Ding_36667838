<script setup>
import AppFooter from './components/AppFooter.vue'
import AppHeader from './components/AppHeader.vue'
import { isOnline, offlineQueue } from './services/offlineService'
</script>

<template>
  <div class="app-shell d-flex flex-column min-vh-100">
    <a class="visually-hidden-focusable skip-link" href="#main-content">Skip to main content</a>
    <AppHeader />
    <div v-if="!isOnline || offlineQueue.length" class="offline-banner" role="status">
      <div class="container-xxl d-flex flex-wrap justify-content-between gap-2">
        <span>{{ isOnline ? `${offlineQueue.length} offline action${offlineQueue.length === 1 ? '' : 's'} waiting to sync.` : 'You are offline. Drafts remain saved on this device.' }}</span>
        <span class="small">Public opportunities remain available.</span>
      </div>
    </div>
    <main id="main-content" class="flex-grow-1">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>
