import { createApp } from "vue";
import { createPinia } from "pinia";
import Axios from "axios";
import Provider from "./components/Provider.vue";
import router from "./route";
import naive from "naive-ui";
import VWave from "v-wave";
import "./assets/style.scss";
const app = createApp(Provider);
const pinia = createPinia();
app.use(pinia);
import { useErrorStore } from './stores/error'
const errorStore = useErrorStore()
Axios.defaults.baseURL = `http://localhost:4000/api/v1/frontend`;
// Axios.defaults.baseURL = `http://194.113.153.92:63005/api/v1/frontend`;
Axios.interceptors.request.use(
  function (config) {
    config.headers != undefined
      ? (config.headers["Authorization"] =
          "Bearer " + localStorage.getItem("token"))
      : (config = {});
    config.headers != undefined
      ? (config.headers.contentType = "application/json")
      : (config = {});
    return config;
  },
  function (error) {
    return Promise.reject("Xatolik");
  }
);
Axios.interceptors.response.use(
  function (response) {
    if (response.status === 200 && response.data?.status) return response.data;
    else {
      errorStore.error_code = 402;
      errorStore.error = JSON.stringify(response.data.message);
      return Promise.reject("Xatolik!")
    }
  },
  function (error) {

    if (error.response.status == 401) {
      router.push({
        name: "Login",
      });
      return Promise.reject("Xatolik avtorizatsiyadan o'tmagan!");
    }
    else if(error.response.status == 400) {
      errorStore.error_code = 400;
      errorStore.error = error.response.data.errors;
      return Promise.reject('Validation faild')
    } else if(error.response.status == 402) {
      errorStore.error_code = 402;
      errorStore.error = error.response.data.message;
      return Promise.reject(error.response.data.message);
    } else if(error.response.status == 500) {
      errorStore.error_code = 500;
      errorStore.error = error.response.data.message;
      return Promise.reject('Serverdagi xatolik!')
    }
    return Promise.reject(error);
  }
);

app.use(router);
app.use(naive);
app.use(VWave, {
  color: "#fff",
  initialOpacity: 0.5,
  duration: 1,
  easing: "ease",
});
app.provide("img_url", `http://localhost:4000/api/v1/uploads/`);
// app.provide('img_url', `http://194.113.153.92:63005/api/v1/frontend`)
app.mount("#app");
