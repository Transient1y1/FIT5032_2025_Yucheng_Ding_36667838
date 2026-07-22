<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getDashboardPath, login } from '../services/authService'

const router = useRouter()
const route = useRoute()
const form = reactive({ email: '', password: '' })
const showPassword = ref(false)
const errorMessage = ref('')
const isSubmitting = ref(false)

function safeRedirect() {
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : ''
  return redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : ''
}

async function submitLogin() {
  errorMessage.value = ''
  if (!form.email.trim() || !form.password) {
    errorMessage.value = 'Enter your email and password.'
    return
  }

  isSubmitting.value = true
  const result = await login(form.email, form.password)
  isSubmitting.value = false

  if (!result.ok) {
    errorMessage.value = result.message
    return
  }

  await router.replace(safeRedirect() || getDashboardPath(result.user))
}
</script>

<template>
  <section class="account-page container-xxl py-5 py-lg-6">
    <div class="row align-items-stretch g-4 g-xl-5">
      <div class="col-lg-5">
        <div class="account-intro h-100 p-4 p-lg-5">
          <p class="eyebrow mb-3">Account access</p>
          <h1 class="display-6 fw-bold mb-3">Keep your volunteering plans close.</h1>
          <p class="lead text-secondary mb-0">Sign in to manage your place in the VolunteerConnect community.</p>
        </div>
      </div>

      <div class="col-lg-7">
        <form class="account-form p-4 p-lg-5" novalidate @submit.prevent="submitLogin">
          <h2 class="h3 mb-1">Welcome back</h2>
          <p class="text-secondary mb-4">Use the account details you registered with.</p>

          <div v-if="errorMessage" class="form-alert mb-4" role="alert">{{ errorMessage }}</div>

          <div class="mb-3">
            <label class="form-label" for="login-email">Email address</label>
            <input id="login-email" v-model="form.email" class="form-control form-control-lg" type="email" autocomplete="email" required />
          </div>

          <div class="mb-3">
            <label class="form-label" for="login-password">Password</label>
            <input id="login-password" v-model="form.password" class="form-control form-control-lg" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" required />
          </div>

          <div class="form-check mb-4">
            <input id="show-login-password" v-model="showPassword" class="form-check-input" type="checkbox" />
            <label class="form-check-label" for="show-login-password">Show password</label>
          </div>

          <button class="btn btn-primary btn-lg w-100" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Signing in...' : 'Sign in' }}
          </button>

          <p class="small text-secondary mt-4 mb-0">
            New to VolunteerConnect?
            <RouterLink class="fw-semibold" to="/register">Create a volunteer account</RouterLink>
          </p>

          <div class="demo-note mt-4 p-3">
            <p class="small fw-semibold mb-1">Coordinator demo account</p>
            <p class="small text-secondary mb-0">coordinator@volunteerconnect.test / Coord123!</p>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
