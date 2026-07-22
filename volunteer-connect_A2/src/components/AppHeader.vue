<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { currentUser, getDashboardPath, logout } from '../services/authService'

const menuOpen = ref(false)
const router = useRouter()
const dashboardPath = computed(() => getDashboardPath())
const accountRole = computed(() => currentUser.value?.role === 'coordinator' ? 'Coordinator' : 'Volunteer')

function closeMenu() {
  menuOpen.value = false
}

function signOut() {
  logout()
  closeMenu()
  router.push('/')
}
</script>

<template>
  <header class="site-header border-bottom">
    <nav class="navbar navbar-expand-lg" aria-label="Primary navigation">
      <div class="container-xxl">
        <RouterLink class="navbar-brand d-flex align-items-center gap-2" to="/" @click="closeMenu">
          <span class="brand-mark" aria-hidden="true">VC</span>
          <span>VolunteerConnect</span>
        </RouterLink>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#main-navigation"
          aria-controls="main-navigation"
          :aria-expanded="menuOpen"
          aria-label="Toggle navigation"
          @click="menuOpen = !menuOpen"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div id="main-navigation" class="collapse navbar-collapse" :class="{ show: menuOpen }">
          <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li class="nav-item">
              <RouterLink class="nav-link" active-class="active" to="/opportunities" @click="closeMenu">Opportunities</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" active-class="active" to="/how-it-works" @click="closeMenu">How it works</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" active-class="active" to="/for-organisations" @click="closeMenu">For organisations</RouterLink>
            </li>
            <li class="nav-item account-nav ms-lg-2">
              <RouterLink v-if="!currentUser" class="btn btn-outline-primary btn-sm px-3" to="/login" @click="closeMenu">
                Sign in
              </RouterLink>
              <template v-else>
                <RouterLink class="nav-link account-link" :to="dashboardPath" @click="closeMenu">
                  {{ currentUser.name }}
                  <span class="account-role">{{ accountRole }}</span>
                </RouterLink>
                <button class="nav-link account-action" type="button" @click="signOut">Sign out</button>
              </template>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>
