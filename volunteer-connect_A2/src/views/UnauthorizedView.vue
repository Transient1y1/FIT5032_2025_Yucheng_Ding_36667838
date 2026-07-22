<script setup>
import { currentUser, getDashboardPath } from '../services/authService'
</script>

<template>
  <section class="placeholder-view container-xxl py-5 py-lg-6">
    <div class="placeholder-panel p-4 p-lg-5">
      <p class="eyebrow mb-2">Access</p>
      <h1 class="display-6 fw-bold mb-3">This page is not available for this account.</h1>
      <p class="lead text-secondary mb-4">
        {{ currentUser ? `Your ${currentUser.role} account has a different workspace.` : 'Sign in to open an account workspace.' }}
      </p>
      <RouterLink class="btn btn-primary" :to="currentUser ? getDashboardPath() : '/opportunities'">
        {{ currentUser ? 'Open my dashboard' : 'Browse opportunities' }}
      </RouterLink>
    </div>
  </section>
</template>
