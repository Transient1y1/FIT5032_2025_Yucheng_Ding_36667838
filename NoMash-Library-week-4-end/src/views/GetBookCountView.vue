<script setup>
import { ref } from 'vue'
const count = ref(null)
const errorMessage = ref('')
const functionUrl = import.meta.env.VITE_COUNT_BOOKS_URL || '/api/countBooks'

const getBookCount = async () => {
  count.value = null
  errorMessage.value = ''

  try {
    const response = await fetch(functionUrl)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()
    if (typeof data?.count !== 'number') {
      throw new Error('Invalid API response.')
    }

    count.value = data.count
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
