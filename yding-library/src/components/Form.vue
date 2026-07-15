<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-sm-10 offset-sm-1 col-lg-8 offset-lg-2">
        <h1 class="text-center mb-4">
          User Information Form
        </h1>

        <form @submit.prevent="submitForm">
          <!-- Username and Password -->
          <div class="row mb-3">
            <div class="col-sm-6 mb-3 mb-sm-0">
              <label
                for="username"
                class="form-label"
              >
                Username
              </label>

              <input
                id="username"
                v-model="formData.username"
                type="text"
                class="form-control"
                @blur="() => validateName(true)"
                @input="() => validateName(false)"
              />

              <div
                v-if="errors.username"
                class="text-danger"
              >
                {{ errors.username }}
              </div>
            </div>

            <div class="col-sm-6">
              <label
                for="password"
                class="form-label"
              >
                Password
              </label>

              <input
                id="password"
                v-model="formData.password"
                type="password"
                class="form-control"
                @blur="() => validatePassword(true)"
                @input="() => validatePassword(false)"
              />

              <div
                v-if="errors.password"
                class="text-danger"
              >
                {{ errors.password }}
              </div>
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
              <label
                for="gender"
                class="form-label"
              >
                Gender
              </label>

              <select
                id="gender"
                v-model="formData.gender"
                class="form-select"
                @blur="() => validateGender(true)"
                @change="() => validateGender(false)"
              >
                <option
                  value=""
                  disabled
                >
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

              <div
                v-if="errors.gender"
                class="text-danger"
              >
                {{ errors.gender }}
              </div>
            </div>
          </div>

          <!-- Reason -->
          <div class="mb-3">
            <label
              for="reason"
              class="form-label"
            >
              Reason for joining
            </label>

            <textarea
              id="reason"
              v-model="formData.reason"
              class="form-control"
              rows="3"
              @blur="() => validateReason(true)"
              @input="() => validateReason(false)"
            ></textarea>

            <div
              v-if="errors.reason"
              class="text-danger"
            >
              {{ errors.reason }}
            </div>
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

        <!-- PrimeVue DataTable -->
        <div
          v-if="submittedCards.length"
          class="mt-5"
        >
          <DataTable
            :value="submittedCards"
            stripedRows
            showGridlines
            responsiveLayout="scroll"
          >
            <Column
              field="username"
              header="Username"
            />

            <Column
              field="password"
              header="Password"
            />

            <Column
              field="isAustralian"
              header="Australian Resident"
            />

            <Column
              field="gender"
              header="Gender"
            />

            <Column
              field="reason"
              header="Reason"
            />
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const formData = ref({
  username: '',
  password: '',
  isAustralian: false,
  gender: '',
  reason: ''
})

const submittedCards = ref([])

const errors = ref({
  username: null,
  password: null,
  gender: null,
  reason: null
})

const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) {
      errors.value.username =
        'Name must be at least 3 characters'
    }
  } else {
    errors.value.username = null
  }
}

const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar =
    /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) {
      errors.value.password =
        `Password must be at least ${minLength} characters long.`
    }
  } else if (!hasUppercase) {
    if (blur) {
      errors.value.password =
        'Password must contain at least one uppercase letter.'
    }
  } else if (!hasLowercase) {
    if (blur) {
      errors.value.password =
        'Password must contain at least one lowercase letter.'
    }
  } else if (!hasNumber) {
    if (blur) {
      errors.value.password =
        'Password must contain at least one number.'
    }
  } else if (!hasSpecialChar) {
    if (blur) {
      errors.value.password =
        'Password must contain at least one special character.'
    }
  } else {
    errors.value.password = null
  }
}

const validateGender = (blur) => {
  if (!formData.value.gender) {
    if (blur) {
      errors.value.gender =
        'Please select a gender.'
    }
  } else {
    errors.value.gender = null
  }
}

const validateReason = (blur) => {
  if (formData.value.reason.trim().length < 10) {
    if (blur) {
      errors.value.reason =
        'Reason must be at least 10 characters.'
    }
  } else {
    errors.value.reason = null
  }
}

const submitForm = () => {
  validateName(true)
  validatePassword(true)
  validateGender(true)
  validateReason(true)

  if (
    !errors.value.username &&
    !errors.value.password &&
    !errors.value.gender &&
    !errors.value.reason
  ) {
    submittedCards.value.push({
      ...formData.value
    })

    clearForm()
  }
}

const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    isAustralian: false,
    gender: '',
    reason: ''
  }

  errors.value = {
    username: null,
    password: null,
    gender: null,
    reason: null
  }
}
</script>

<style scoped>
.text-danger {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
