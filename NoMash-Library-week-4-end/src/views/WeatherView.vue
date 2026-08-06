<script setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
const city = ref('')
const weatherData = ref(null)
const errorMessage = ref('')
const loading = ref(false)

const temperature = computed(() => {
  const value = weatherData.value?.main?.temp
  return typeof value === 'number' ? Math.round(value) : null
})

const iconUrl = computed(() => {
  const icon = weatherData.value?.weather?.[0]?.icon
  return icon ? `https://openweathermap.org/img/wn/${icon}.png` : null
})

const fetchWeather = async (params) => {
  if (!apiKey) {
    errorMessage.value = 'Please configure VITE_OPENWEATHER_API_KEY in .env.local.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { ...params, appid: apiKey, units: 'metric' }
    })
    weatherData.value = response.data
  } catch (error) {
    weatherData.value = null
    errorMessage.value = error.response?.status === 404 ? 'City not found.' : 'Unable to load weather data.'
  } finally {
    loading.value = false
  }
}

const searchByCity = () => {
  if (!city.value.trim()) {
    errorMessage.value = 'Please enter a city name.'
    return
  }

  fetchWeather({ q: city.value.trim() })
}

const fetchCurrentLocationWeather = () => {
  if (!navigator.geolocation) {
    errorMessage.value = 'Geolocation is not supported. Search by city instead.'
    return
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => fetchWeather({ lat: coords.latitude, lon: coords.longitude }),
    () => {
      errorMessage.value = 'Location permission was not granted. Search by city instead.'
    }
  )
}

onMounted(fetchCurrentLocationWeather)
</script>

<template>
  <div class="weather-page">
    <h1>WEATHER APP</h1>

    <form class="weather-form" @submit.prevent="searchByCity">
      <label for="city">City</label>
      <div class="search-row">
        <input id="city" v-model="city" type="text" placeholder="Clayton, AU" />
        <button class="btn btn-primary" type="submit" :disabled="loading">
          {{ loading ? 'Loading...' : 'Search' }}
        </button>
      </div>
    </form>

    <button class="btn btn-secondary location-button" type="button" @click="fetchCurrentLocationWeather">
      Use current location
    </button>

    <p v-if="errorMessage" role="alert">{{ errorMessage }}</p>

    <main v-if="weatherData" class="weather-result">
      <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
      <img v-if="iconUrl" :src="iconUrl" alt="Weather Icon" />
      <p class="temperature">{{ temperature }} °C</p>
      <span class="description">{{ weatherData.weather[0].description }}</span>
    </main>
  </div>
</template>

<style scoped>
.weather-page {
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
}

.weather-page h1 {
  margin-bottom: 2rem;
  text-align: center;
}

.weather-form label {
  display: block;
  margin-bottom: 0.5rem;
}

.search-row {
  display: flex;
  gap: 0.5rem;
}

.search-row input {
  min-width: 0;
  flex: 1;
}

.location-button {
  margin-top: 1rem;
}

.weather-page > p[role='alert'] {
  margin-top: 1rem;
  text-align: center;
}

.weather-result {
  margin-top: 1.5rem;
  text-align: center;
}

.weather-result h2 {
  margin-bottom: 0.5rem;
}

.weather-result img {
  display: block;
  margin: 0.5rem auto;
}

.temperature {
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.description {
  display: block;
  text-transform: capitalize;
}

@media (max-width: 480px) {
  .search-row {
    flex-direction: column;
  }

  .search-row .btn {
    width: 100%;
  }
}
</style>
