<script setup>
import { ref } from 'vue'
import { getAuth, signOut } from 'firebase/auth'

const auth = getAuth()
const currentUser = ref(auth.currentUser)
const errorMessage = ref('')
const hasLoggedOut = ref(false)

const handleLogout = async () => {
  errorMessage.value = ''

  try {
    await signOut(auth)
    currentUser.value = auth.currentUser
    hasLoggedOut.value = true
    console.log(auth.currentUser)
  } catch (error) {
    errorMessage.value = error.code
    console.log(error.code)
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-5">
      <h1 class="text-center mb-4">Firebase Logout</h1>

      <p v-if="currentUser" class="mb-3">Signed in as {{ currentUser.email }}.</p>
      <p v-else-if="hasLoggedOut" class="alert alert-success" role="status">
        You have been signed out.
      </p>
      <p v-else class="mb-3">No Firebase user is currently signed in.</p>

      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>

      <button v-if="currentUser" type="button" class="btn btn-primary" @click="handleLogout">
        Logout
      </button>
    </div>
  </div>
</template>
