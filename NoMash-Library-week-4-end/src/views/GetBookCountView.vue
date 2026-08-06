<script setup>
import { ref } from 'vue'
import axios from 'axios'

const count = ref(null)
const errorMessage = ref('')
const functionUrl = import.meta.env.VITE_COUNT_BOOKS_URL

const getBookCount = async () => {
  count.value = null
  errorMessage.value = ''

  if (!functionUrl) {
    errorMessage.value = 'The book counter is not configured.'
    return
  }

  try {
    const response = await axios.get(functionUrl)

    if (typeof response.data?.count !== 'number') {
      throw new Error('Invalid API response.')
    }

    count.value = response.data.count
  } catch (error) {
    console.error('Unable to get book count:', error)
    errorMessage.value = 'Unable to get the book count.'
  }
}
</script>

<template>
  <div class="container mt-5">
    <h1>Book Counter</h1>

    <button type="button" class="btn btn-primary" @click="getBookCount">
      Get Book Count
    </button>

    <p v-if="count !== null" class="mt-3">Total number of books: {{ count }}</p>
    <p v-else-if="errorMessage" class="mt-3 text-danger">error: {{ errorMessage }}</p>
  </div>
</template>
