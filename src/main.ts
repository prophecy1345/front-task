import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import UserAge from './components/UserAge.vue'

const app = createApp(App)

app.component('UserAge', UserAge)

app.mount('#app')
