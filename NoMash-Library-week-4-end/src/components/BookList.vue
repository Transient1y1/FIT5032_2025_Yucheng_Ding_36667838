<script setup>
import { onMounted, ref } from 'vue'
import { collection, deleteDoc, doc, getDocs, limit, orderBy, query, updateDoc, where } from 'firebase/firestore'
import db from '../firebase/init'

const books = ref([])
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(true)
const editingBook = ref(null)
const isSaving = ref(false)

const fetchBooks = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    const booksQuery = query(
      collection(db, 'books'),
      where('isbn', '>', 1000),
      orderBy('isbn', 'asc'),
      limit(3)
    )
    const querySnapshot = await getDocs(booksQuery)

    books.value = querySnapshot.docs.map((document) => ({
      id: document.id,
      ...document.data()
    }))
  } catch (error) {
    errorMessage.value = error.code || 'Unable to load books.'
    console.error('Error fetching books:', error)
  } finally {
    isLoading.value = false
  }
}

const startEditing = (book) => {
  successMessage.value = ''
  editingBook.value = { ...book }
}

const cancelEditing = () => {
  editingBook.value = null
}

const saveBook = async () => {
  const isbnNumber = Number(editingBook.value.isbn)
  if (!editingBook.value.name.trim() || Number.isNaN(isbnNumber)) {
    errorMessage.value = 'ISBN must be a valid number and name is required.'
    return
  }

  errorMessage.value = ''
  isSaving.value = true

  try {
    await updateDoc(doc(db, 'books', editingBook.value.id), {
      isbn: isbnNumber,
      name: editingBook.value.name.trim()
    })
    editingBook.value = null
    successMessage.value = 'Book updated successfully.'
    await fetchBooks()
  } catch (error) {
    errorMessage.value = error.code || 'Unable to update the book.'
    console.error('Error updating book:', error)
  } finally {
    isSaving.value = false
  }
}

const deleteBook = async (bookId) => {
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await deleteDoc(doc(db, 'books', bookId))
    if (editingBook.value?.id === bookId) editingBook.value = null
    successMessage.value = 'Book deleted successfully.'
    await fetchBooks()
  } catch (error) {
    errorMessage.value = error.code || 'Unable to delete the book.'
    console.error('Error deleting book:', error)
  }
}

onMounted(fetchBooks)
</script>

<template>
  <section class="mt-5">
    <h2>Books with ISBN &gt; 1000</h2>
    <p class="text-muted">Showing the first 3 books ordered by ISBN.</p>

    <p v-if="isLoading">Loading books...</p>
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="alert alert-success" role="status">
      {{ successMessage }}
    </div>
    <p v-if="!isLoading && !books.length">No matching books found.</p>
    <ul v-if="!isLoading && books.length" class="list-group">
      <li v-for="book in books" :key="book.id" class="list-group-item">
        <div class="d-flex justify-content-between align-items-center gap-3">
          <span>{{ book.name }} - ISBN: {{ book.isbn }}</span>
          <div class="btn-group btn-group-sm">
            <button type="button" class="btn btn-outline-primary" @click="startEditing(book)">
              Edit
            </button>
            <button type="button" class="btn btn-outline-danger" @click="deleteBook(book.id)">
              Delete
            </button>
          </div>
        </div>

        <form
          v-if="editingBook?.id === book.id"
          class="row g-2 mt-2"
          @submit.prevent="saveBook"
        >
          <div class="col-sm-5">
            <label :for="`edit-name-${book.id}`" class="visually-hidden">Name</label>
            <input :id="`edit-name-${book.id}`" v-model="editingBook.name" class="form-control" required />
          </div>
          <div class="col-sm-4">
            <label :for="`edit-isbn-${book.id}`" class="visually-hidden">ISBN</label>
            <input
              :id="`edit-isbn-${book.id}`"
              v-model="editingBook.isbn"
              class="form-control"
              required
            />
          </div>
          <div class="col-sm-3 d-flex gap-2">
            <button type="submit" class="btn btn-primary btn-sm" :disabled="isSaving">Save</button>
            <button type="button" class="btn btn-secondary btn-sm" @click="cancelEditing">Cancel</button>
          </div>
        </form>
      </li>
    </ul>
  </section>
</template>
