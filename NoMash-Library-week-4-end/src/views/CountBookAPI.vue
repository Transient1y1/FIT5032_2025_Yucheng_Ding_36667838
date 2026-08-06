<script setup>
import { onMounted, ref } from 'vue'

const apiResponse = ref(null)
const loading = ref(false)
const errorMessage = ref('')

const getApiData = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(new URL('../assets/json/authors.json', import.meta.url))
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const authors = await response.json()
    const totalBooks = authors.reduce((total, author) => total + author.famousWorks.length, 0)

    apiResponse.value = {
      success: true,
      data: {
        authorsCount: authors.length,
        totalBooks
      },
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    errorMessage.value = `Error loading authors data: ${error.message}`
  } finally {
    loading.value = false
  }
}

onMounted(getApiData)
</script>

<template>
  <div class="container">
    <h1>CountBookAPI</h1>
    <p v-if="loading">Loading...</p>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>
    <pre v-else-if="apiResponse">{{ JSON.stringify(apiResponse, null, 2) }}</pre>
  </div>
</template>
