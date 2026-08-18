import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './assets/main.css'
import App from './App.vue'
import router from './router'
import { initialiseAuth } from './services/authService'

async function startApp() {
  await initialiseAuth()
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {})
  createApp(App).use(router).mount('#app')
}

startApp()
