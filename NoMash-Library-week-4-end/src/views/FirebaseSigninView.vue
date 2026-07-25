<script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)
const router = useRouter()
const auth = getAuth()

const signin = async () => {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    console.log('Firebase Login Successful!')
    console.log(auth.currentUser)
    router.push('/')
  } catch (error) {
    errorMessage.value = error.code
    console.log(error.code)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-5">
      <h1 class="text-center mb-4">Firebase Login</h1>

      <form @submit.prevent="signin">
        <div class="mb-3">
          <label for="firebase-login-email" class="form-label">Email</label>
          <input
            id="firebase-login-email"
            v-model="email"
            type="email"
            class="form-control"
            autocomplete="email"
            required
          />
        </div>

        <div class="mb-3">
          <label for="firebase-login-password" class="form-label">Password</label>
          <input
            id="firebase-login-password"
            v-model="password"
            type="password"
            class="form-control"
            autocomplete="current-password"
            required
          />
        </div>

        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>

        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Signing in...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>
