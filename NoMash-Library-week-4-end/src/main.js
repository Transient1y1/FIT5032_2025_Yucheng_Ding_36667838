// import './assets/main.css'
// import '@/assets/style.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import { initializeApp } from 'firebase/app'
// import DataTable from 'primevue/datatable'
// import Column from 'primevue/Column'

const firebaseConfig = {
  apiKey: 'AIzaSyB3tK_gl3vnllmmOxez_SZwGW4B2mOWYNU',
  authDomain: 'lab7-yucheng-ding.firebaseapp.com',
  projectId: 'lab7-yucheng-ding',
  storageBucket: 'lab7-yucheng-ding.firebasestorage.app',
  messagingSenderId: '572767074871',
  appId: '1:572767074871:web:828f08b27bb89426bc9db2'
}

initializeApp(firebaseConfig)

const app = createApp(App)
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)

// app.component('DataTable', DataTable)
// app.component('Column', Column)

app.mount('#app')
