import { Quasar } from 'quasar'

import quasarLang from 'quasar/lang/zh-CN'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import 'virtual:uno.css'

const app = createApp(App)
app.use(Quasar, {
  lang: quasarLang,
  plugins: {},
  config: {
    brand: {
      primary: '#0052d9',
      secondary: '#029cd4',
      accent: '#8e56dd',
    },
  },
})

app.mount('#app')
