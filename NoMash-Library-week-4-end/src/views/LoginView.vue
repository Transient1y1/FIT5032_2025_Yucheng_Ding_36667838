<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '../auth'

const username = ref('')
const password = ref('')
const loginError = ref('')
const route = useRoute()
const router = useRouter()

const handleLogin = () => {
  if (!login(username.value, password.value)) {
    loginError.value = 'Invalid username or password.'
    return
  }

  const redirectPath = typeof route.query.redirect === 'string' ? route.query.redirect : '/about'
  router.push(redirectPath)
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-5">
      <h1 class="text-center mb-4">Login</h1>

      <div v-if="route.query.denied === 'true'" class="alert alert-warning" role="alert">
        Access denied. Please log in to continue.
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="login-username" class="form-label">Username</label>
          <input
            id="login-username"
            v-model="username"
            type="text"
            class="form-control"
            autocomplete="username"
            required
          />
        </div>

        <div class="mb-3">
          <label for="login-password" class="form-label">Password</label>
          <input
            id="login-password"
            v-model="password"
            type="password"
            class="form-control"
            autocomplete="current-password"
            required
          />
        </div>

        <div v-if="loginError" class="alert alert-danger" role="alert">
          {{ loginError }}
        </div>

        <button type="submit" class="btn btn-primary">Login</button>
      </form>
    </div>
  </div>
</template>
