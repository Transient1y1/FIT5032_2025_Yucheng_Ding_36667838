<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getDashboardPath, registerVolunteer } from '../services/authService'
import { isStrongPassword, isValidEmail, isValidName } from '../utils/inputValidation'

const router = useRouter()
const form = reactive({ name: '', email: '', password: '', confirmPassword: '', terms: false })
const errors = reactive({})
const showPassword = ref(false)
const errorMessage = ref('')
const isSubmitting = ref(false)

function validateForm() {
  Object.keys(errors).forEach((key) => delete errors[key])

  if (!isValidName(form.name)) errors.name = 'Use 2 to 60 letters, spaces, apostrophes or hyphens.'
  if (!isValidEmail(form.email)) errors.email = 'Enter a valid email address.'
  if (!isStrongPassword(form.password)) {
    errors.password = 'Use 8 to 128 characters with upper, lower and number characters.'
  }
  if (form.confirmPassword !== form.password) errors.confirmPassword = 'Passwords do not match.'
  if (!form.terms) errors.terms = 'Please accept the role information before registering.'

  return Object.keys(errors).length === 0
}

async function submitRegistration() {
  errorMessage.value = ''
  if (!validateForm()) return

  isSubmitting.value = true
  const result = await registerVolunteer(form)
  isSubmitting.value = false

  if (!result.ok) {
    errorMessage.value = result.message
    return
  }

  await router.replace(getDashboardPath(result.user))
}
</script>

<template>
  <section class="account-page container-xxl py-5 py-lg-6">
    <div class="row align-items-stretch g-4 g-xl-5">
      <div class="col-lg-5">
        <div class="account-intro h-100 p-4 p-lg-5">
          <p class="eyebrow mb-3">Volunteer account</p>
          <h1 class="display-6 fw-bold mb-3">Start with one role that feels right.</h1>
          <p class="lead text-secondary mb-0">Create a volunteer account to keep your opportunity choices and updates together.</p>
        </div>
      </div>

      <div class="col-lg-7">
        <form class="account-form p-4 p-lg-5" novalidate @submit.prevent="submitRegistration">
          <h2 class="h3 mb-1">Create your account</h2>
          <p class="text-secondary mb-4">Volunteer accounts are free and take less than a minute to set up.</p>

          <div v-if="errorMessage" class="form-alert mb-4" role="alert">{{ errorMessage }}</div>

          <div class="mb-3">
            <label class="form-label" for="register-name">Full name</label>
            <input id="register-name" v-model="form.name" class="form-control form-control-lg" type="text" autocomplete="name" maxlength="60" required />
            <p v-if="errors.name" class="field-error">{{ errors.name }}</p>
          </div>

          <div class="mb-3">
            <label class="form-label" for="register-email">Email address</label>
            <input id="register-email" v-model="form.email" class="form-control form-control-lg" type="email" autocomplete="email" maxlength="120" required />
            <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
          </div>

          <div class="mb-3">
            <label class="form-label" for="register-password">Password</label>
            <input id="register-password" v-model="form.password" class="form-control form-control-lg" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" maxlength="128" required />
            <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
          </div>

          <div class="mb-3">
            <label class="form-label" for="register-confirm-password">Confirm password</label>
            <input id="register-confirm-password" v-model="form.confirmPassword" class="form-control form-control-lg" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" maxlength="128" required />
            <p v-if="errors.confirmPassword" class="field-error">{{ errors.confirmPassword }}</p>
          </div>

          <div class="form-check mb-2">
            <input id="show-register-password" v-model="showPassword" class="form-check-input" type="checkbox" />
            <label class="form-check-label" for="show-register-password">Show password</label>
          </div>

          <div class="form-check mb-4">
            <input id="register-terms" v-model="form.terms" class="form-check-input" type="checkbox" />
            <label class="form-check-label" for="register-terms">I understand that role details should be checked before applying.</label>
            <p v-if="errors.terms" class="field-error">{{ errors.terms }}</p>
          </div>

          <button class="btn btn-primary btn-lg w-100" type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Creating account...' : 'Create volunteer account' }}
          </button>

          <p class="small text-secondary mt-4 mb-0">
            Already registered?
            <RouterLink class="fw-semibold" to="/login">Sign in</RouterLink>
          </p>
        </form>
      </div>
    </div>
  </section>
</template>
