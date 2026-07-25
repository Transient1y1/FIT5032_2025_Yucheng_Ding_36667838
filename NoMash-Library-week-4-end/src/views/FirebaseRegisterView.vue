<script setup>
import { ref } from 'vue'
import { createUserWithEmailAndPassword, getAuth, signOut, updateProfile } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const role = ref('Member')
const errorMessage = ref('')
const isSubmitting = ref(false)
const router = useRouter()
const auth = getAuth()

const register = async () => {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    await updateProfile(userCredential.user, { displayName: role.value })
    await signOut(auth)
    console.log('Firebase Register Successful!')
    router.push('/Firelogin')
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
      <h1 class="text-center mb-4">Create Firebase Account</h1>

      <form @submit.prevent="register">
        <div class="mb-3">
          <label for="firebase-register-email" class="form-label">Email</label>
          <input
            id="firebase-register-email"
            v-model="email"
            type="email"
            class="form-control"
            autocomplete="email"
            required
          />
        </div>

        <div class="mb-3">
          <label for="firebase-register-password" class="form-label">Password</label>
          <input
            id="firebase-register-password"
            v-model="password"
            type="password"
            class="form-control"
            autocomplete="new-password"
            required
          />
        </div>

        <div class="mb-3">
          <label for="firebase-register-role" class="form-label">Role</label>
          <select id="firebase-register-role" v-model="role" class="form-select">
            <option>Member</option>
            <option>Library Staff</option>
          </select>
        </div>

        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>

        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>
    </div>
  </div>
</template>
