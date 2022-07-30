import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'
import { vAxios } from '../../src'
const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
app.use(router)
app.mount('#app')

const axios = vAxios({
  baseURL: 'http://127.0.0.1:3000/',
  interceptors: {
    request: (data) => {
      console.log(data)
      if (data.url === '/users/octocat/11') {
        // data.cancel('取消请求')
      }
      return data
    },
  },
})
axios.get('/users/octocat/11').then((res) => {
  // console.log(res)
})
axios.get('/users/octocat/11').then((res) => {
  // console.log(res)
})

setTimeout(() => {
  axios.get('/users/octocat/11').then((res) => {
    console.log('hi', res)
  })
}, 3000)
axios.get('/users/octocat22/22', {
  name: 'simon',
}, {
  headers: {
    'Content-Type': 'application/json',
  },
}).then((res) => {
  // console.log(res)
})

