<script setup>
import { ref } from 'vue'

const menuOpen = ref(false)

function closeMenu() {
  menuOpen.value = false
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
            <li class="nav-item ms-lg-2">
              <RouterLink class="btn btn-outline-primary btn-sm px-3" to="/login" @click="closeMenu">
                Sign in
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>
