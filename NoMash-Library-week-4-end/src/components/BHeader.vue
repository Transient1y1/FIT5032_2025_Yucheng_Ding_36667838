<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { isAuthenticated, logout } from '../auth'

const router = useRouter()
const firebaseUser = ref(null)
let unsubscribeFirebaseAuth

onMounted(() => {
  unsubscribeFirebaseAuth = onAuthStateChanged(getAuth(), (user) => {
    firebaseUser.value = user
  })
})

onUnmounted(() => {
  unsubscribeFirebaseAuth?.()
})

const handleLogout = () => {
  logout()
  router.push({ name: 'Login' })
}
</script>

<template>
  <!-- Using Bootstrap's Header template (starter code) -->
  <!-- https://getbootstrap.com/docs/5.0/examples/headers/ -->
  <div class="container">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active" aria-current="page"
            >Home (Week 5)</router-link
          >
        </li>
        <li v-if="isAuthenticated" class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">About</router-link>
        </li>
        <li v-if="!isAuthenticated && !firebaseUser" class="nav-item">
          <router-link to="/login" class="nav-link" active-class="active">Login</router-link>
        </li>
        <li v-else-if="isAuthenticated" class="nav-item">
          <button type="button" class="nav-link" @click="handleLogout">Logout</button>
        </li>
        <template v-if="firebaseUser">
          <li class="nav-item">
            <span class="nav-link disabled">Role: {{ firebaseUser.displayName || 'Member' }}</span>
          </li>
          <li class="nav-item">
            <router-link to="/FireLogout" class="nav-link" active-class="active"
              >Firebase Logout</router-link
            >
          </li>
        </template>
        <template v-else>
          <li class="nav-item">
            <router-link to="/Firelogin" class="nav-link" active-class="active"
              >Firebase Login</router-link
            >
          </li>
          <li class="nav-item">
            <router-link to="/FireRegister" class="nav-link" active-class="active"
              >Firebase Register</router-link
            >
          </li>
        </template>
        <li class="nav-item">
          <router-link to="/addbook" class="nav-link" active-class="active">Add Book</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/WeatherCheck" class="nav-link" active-class="active">Get Weather</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/CountBookAPI" class="nav-link" active-class="active">Count Book API</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/GetAllBookAPI" class="nav-link" active-class="active">Get All Books API</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/book-count" class="nav-link" active-class="active">Book Counter</router-link>
        </li>
      </ul>
    </header>
  </div>
</template>

<style scoped>
.b-example-divider {
  height: 3rem;
  background-color: rgba(0, 0, 0, 0.1);
  border: solid rgba(0, 0, 0, 0.15);
  border-width: 1px 0;
  box-shadow:
    inset 0 0.5em 1.5em rgba(0, 0, 0, 0.1),
    inset 0 0.125em 0.5em rgba(0, 0, 0, 0.15);
}

.form-control-dark {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: var(--bs-gray);
}
.form-control-dark:focus {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: #fff;
  box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
}

.bi {
  vertical-align: -0.125em;
  fill: currentColor;
}

.text-small {
  font-size: 85%;
}

.dropdown-toggle {
  outline: 0;
}
</style>
