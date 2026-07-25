<template>
  <h1>Create an Account</h1>
  <p><input v-model="email" type="text" placeholder="Email" /></p>
  <p><input v-model="password" type="password" placeholder="Password" /></p>
  <p><button @click="register">Save to Firebase</button></p>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()
const auth = getAuth()

const register = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      console.log('Firebase Register Successful!')
      router.push('/Firelogin')
    })
    .catch((error) => {
      console.log(error.code)
    })
}
</script>
