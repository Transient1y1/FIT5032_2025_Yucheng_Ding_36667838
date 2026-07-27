<script setup>
import { ref } from 'vue'
import { addDoc, collection } from 'firebase/firestore'
import db from '../firebase/init'
import BookList from '../components/BookList.vue'

const isbn = ref('')
const name = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isSubmitting = ref(false)

const addBook = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  const isbnNumber = Number(isbn.value)
  if (!isbn.value.trim() || Number.isNaN(isbnNumber)) {
    errorMessage.value = 'ISBN must be a valid number.'
    return
  }

  isSubmitting.value = true

  try {
    await addDoc(collection(db, 'books'), {
      isbn: isbnNumber,
      name: name.value.trim()
    })

    isbn.value = ''
    name.value = ''
    successMessage.value = 'Book added successfully.'
  } catch (error) {
    errorMessage.value = error.code || 'Unable to add the book.'
    console.error('Error adding book:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-5">
      <h1 class="text-center mb-4">Add Book</h1>

      <form @submit.prevent="addBook">
        <div class="mb-3">
          <label for="isbn" class="form-label">ISBN</label>
          <input id="isbn" v-model="isbn" type="text" class="form-control" required />
        </div>

        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input id="name" v-model="name" type="text" class="form-control" required />
        </div>

        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="alert alert-success" role="status">
          {{ successMessage }}
        </div>

        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Adding book...' : 'Add Book' }}
        </button>
      </form>
    </div>
  </div>

  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-5">
      <BookList />
    </div>
  </div>
</template>
