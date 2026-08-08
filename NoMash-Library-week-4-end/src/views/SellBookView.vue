<script setup>
import { ref } from 'vue'

const title = ref('Pride and Prejudice')
const sale = ref(null)
const errorMessage = ref('')
const isSelling = ref(false)

const sellBook = async () => {
  errorMessage.value = ''
  sale.value = null
  isSelling.value = true

  try {
    const response = await fetch('/api/sellBook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.value })
    })
    const data = await response.json()
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Unable to sell the book.')
    }
    sale.value = data
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isSelling.value = false
  }
}
</script>

<template>
  <div class="container mt-5">
    <h1>Sell a Book</h1>
    <p>Choose a title from the JSON catalogue and create a Vercel Function sale receipt.</p>

    <form class="row g-2 align-items-end" @submit.prevent="sellBook">
      <div class="col-sm-8 col-md-6">
        <label for="book-title" class="form-label">Book title</label>
        <input id="book-title" v-model="title" class="form-control" required />
      </div>
      <div class="col-auto">
        <button type="submit" class="btn btn-primary" :disabled="isSelling">
          {{ isSelling ? 'Selling...' : 'Sell Book' }}
        </button>
      </div>
    </form>

    <div v-if="sale" class="alert alert-success mt-4" role="status">
      <strong>{{ sale.message }}</strong>
      <div>Author: {{ sale.book.author }}</div>
      <div>Receipt: {{ sale.receipt }}</div>
    </div>
    <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">{{ errorMessage }}</p>
  </div>
</template>
