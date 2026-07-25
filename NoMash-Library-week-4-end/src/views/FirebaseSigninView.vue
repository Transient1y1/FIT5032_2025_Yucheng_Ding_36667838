<template>
  <h1>Sign in</h1>
  <p><input v-model="email" type="text" placeholder="Email" /></p>
  <p><input v-model="password" type="password" placeholder="Password" /></p>
  <p><button @click="signin">Sign in via Firebase</button></p>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()
const auth = getAuth()

const signin = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      console.log('Firebase Login Successful!')
      router.push('/')
      console.log(auth.currentUser)
    }).catch((error) => {
      console.log(error.code)
    })
}
</script>