<script setup>
import { currentUser } from '../services/authService'
</script>

<template>
  <section class="dashboard-page container-xxl py-5 py-lg-6">
    <div class="dashboard-heading mb-4">
      <p class="eyebrow mb-2">Volunteer account</p>
      <h1 class="display-6 fw-bold mb-2">Welcome back, {{ currentUser.name }}.</h1>
      <p class="lead text-secondary mb-0">Your volunteering choices and updates will stay together here.</p>
    </div>

    <div class="row g-3 g-lg-4 mb-4">
      <div class="col-md-4">
        <div class="dashboard-stat h-100 p-4">
          <p class="stat-label mb-2">Saved roles</p>
          <p class="stat-value mb-2">0</p>
          <p class="small text-secondary mb-0">No opportunities saved yet.</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="dashboard-stat h-100 p-4">
          <p class="stat-label mb-2">Applications</p>
          <p class="stat-value mb-2">0</p>
          <p class="small text-secondary mb-0">No expressions of interest yet.</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="dashboard-stat dashboard-stat-accent h-100 p-4">
          <p class="stat-label mb-2">Account type</p>
          <p class="stat-value stat-value-word mb-2">Volunteer</p>
          <p class="small text-secondary mb-0">Your account can browse student-friendly roles.</p>
        </div>
      </div>
    </div>

    <div class="dashboard-action p-4 p-lg-5">
      <div>
        <p class="eyebrow mb-2">Next step</p>
        <h2 class="h3 mb-2">Find a role for your next free hour.</h2>
        <p class="text-secondary mb-0">Use the opportunity directory to compare time, place and support details.</p>
      </div>
      <RouterLink class="btn btn-primary" to="/opportunities">Browse opportunities</RouterLink>
    </div>
  </section>
</template>
