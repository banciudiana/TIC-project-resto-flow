/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

//Router
import router from './router'

// Pinia
import { createPinia } from 'pinia'

// Styles
import 'unfonts.css'

const app = createApp(App)
const pinia = createPinia()



app.use(router)
app.use(pinia)

registerPlugins(app)

app.mount('#app')
