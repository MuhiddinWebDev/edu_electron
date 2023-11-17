import { createApp, ref } from 'vue';
import { createPinia } from 'pinia';
import axios from 'axios'

import Provider from './components/Provider.vue';


import router from './route';
import naive from 'naive-ui';
import VWave from 'v-wave';
import Print from 'vue3-print-nb'
import './assets/style.scss';

import dayjs from 'dayjs' //import dayjs in your main.js
//// error messages in axios 
import { useErrorStore } from './stores/error'


const app = createApp(Provider)
app.use(createPinia());

const error_store = useErrorStore()

/// style templates


////////////////////////////////
// const BASE_URL = ref('http://89.232.184.175:3005/api/v1'); ////  Edu App Default backend url
// const BASE_URL = ref('http://89.232.184.175:3009/api/v1'); ////  Samarqand EF school OM0006
// const BASE_URL = ref('http://89.232.184.175:3010/api/v1'); ////  Navoiy The best academy OM0008
// const BASE_URL = ref('http://89.232.184.175:3001/api/v1') //// Edu App Fargona Platon OM0002
const BASE_URL = ref('http://localhost:5000/api/v1') ///// EduApp localhost test url
axios.defaults.baseURL = BASE_URL.value;
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  config.headers['Authorization'] = `Bearer ` + localStorage.getItem('token');
  if (!localStorage.getItem('leng')) {
    config.headers['Accept-Language'] = 'uz'
  } else {
    config.headers['Accept-Language'] = localStorage.getItem('leng')
  }
  config.headers['token'] = localStorage.getItem('clientToken');
  return config;
},
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response.data;
},
  function (error) {
    if (error.code == 'ERR_NETWORK') {
      router.push({ name: 'Login' });
      localStorage.clear();
    } else if (error.response.status == 400) {
      error_store.error_text = error.response.data.message
    } else if (error.response.status == 401) {
      error_store.error_text = error.response.data.message
    } else if (error.response.status == 500) {
      error_store.error_text = error.response.data.message
    } else {
      error_store.error_text = error.message
    }
    return Promise.reject(error);
});

app.use(router)
app.use(naive)
app.use(Print)

app.use(VWave, {
  color: '#fff',
  initialOpacity: 0.5,
  duration: 0.5,
  easing: 'ease-in',
  cancellationPeriod: 100
})

app.provide('dayJS', dayjs);
app.provide('img_url', `${BASE_URL.value}/uploads/user/`)
app.provide('site_img', `${BASE_URL.value}/uploads/image/`)
app.provide('course_img', `${BASE_URL.value}/uploads/course/`)
app.provide('course_video', `${BASE_URL.value}/uploads/coursePlan/`)
app.mount('#app')
