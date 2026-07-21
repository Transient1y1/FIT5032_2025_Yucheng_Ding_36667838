<script setup>
import AppFooter from './components/AppFooter.vue'
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <div class="app-shell d-flex flex-column min-vh-100">
    <AppHeader />
    <main class="flex-grow-1">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>
