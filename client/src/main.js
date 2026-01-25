import './assets/main.css' 

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/authStore' 
import './firebase'
import VueApexCharts from "vue3-apexcharts";

const app = createApp(App)


const pinia = createPinia()
app.use(pinia)


const authStore = useAuthStore()
authStore.checkAuth()


app.use(router)
app.use(VueApexCharts);

app.mount('#app')