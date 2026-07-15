<template>
  <div class="container mt-5">
    <div class="row">
      <!--
        Breakpoints:
        sm: 576px and above
        lg: 992px and above
      -->
      <div class="col-sm-10 offset-sm-1 col-lg-8 offset-lg-2">
        <h1 class="text-center mb-4">
          User Information Form
        </h1>

        <form @submit.prevent="submitForm">
          <!-- Username and Password -->
          <div class="row mb-3">
            <div class="col-sm-6 mb-3 mb-sm-0">
              <label for="username" class="form-label">
                Username
              </label>

              <input
                id="username"
                v-model="formData.username"
                type="text"
                class="form-control"
                required
              />
            </div>

            <div class="col-sm-6">
              <label for="password" class="form-label">
                Password
              </label>

              <input
                id="password"
                v-model="formData.password"
                type="password"
                class="form-control"
                required
                minlength="4"
                maxlength="10"
              />
            </div>
          </div>

          <!-- Australian Resident and Gender -->
          <div class="row mb-3">
            <div class="col-sm-6 mb-3 mb-sm-0">
              <div class="form-check mt-sm-4">
                <input
                  id="isAustralian"
                  v-model="formData.isAustralian"
                  type="checkbox"
                  class="form-check-input"
                />

                <label
                  for="isAustralian"
                  class="form-check-label"
                >
                  Australian Resident?
                </label>
              </div>
            </div>

            <div class="col-sm-6">
              <label for="gender" class="form-label">
                Gender
              </label>

              <select
                id="gender"
                v-model="formData.gender"
                class="form-select"
                required
              >
                <option value="" disabled>
                  Select gender
                </option>

                <option value="male">
                  Male
                </option>

                <option value="female">
                  Female
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>
          </div>

          <!-- Reason -->
          <div class="mb-3">
            <label for="reason" class="form-label">
              Reason for joining
            </label>

            <textarea
              id="reason"
              v-model="formData.reason"
              class="form-control"
              rows="3"
              required
              minlength="10"
              maxlength="150"
            ></textarea>
          </div>

          <!-- Buttons -->
          <div class="text-center">
            <button
              type="submit"
              class="btn btn-primary me-2"
            >
              Submit
            </button>

            <button
              type="button"
              class="btn btn-secondary"
              @click="clearForm"
            >
              Clear
            </button>
          </div>
        </form>

        <!-- Submitted Cards -->
        <div
          v-if="submittedCards.length"
          class="row mt-5"
        >
          <div class="d-flex flex-wrap justify-content-start">
            <div
              v-for="(card, index) in submittedCards"
              :key="index"
              class="card m-2"
              style="width: 18rem"
            >
              <div class="card-header">
                User Information
              </div>

              <ul class="list-group list-group-flush">
                <li class="list-group-item">
                  Username: {{ card.username }}
                </li>

                <li class="list-group-item">
                  Password: {{ card.password }}
                </li>

                <li class="list-group-item">
                  Australian Resident:
                  {{ card.isAustralian ? 'Yes' : 'No' }}
                </li>

                <li class="list-group-item">
                  Gender: {{ card.gender }}
                </li>

                <li class="list-group-item">
                  Reason: {{ card.reason }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  username: '',
  password: '',
  isAustralian: false,
  gender: '',
  reason: ''
})

const submittedCards = ref([])

const submitForm = () => {
  submittedCards.value.push({
    ...formData.value
  })
}

const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    isAustralian: false,
    gender: '',
    reason: ''
  }
}
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #275fda;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}

.list-group-item {
  padding: 10px;
}
</style>
