<template>
  <n-h1 style="font-size: 60px; font-weight: 100">
    <!-- {{ $store.state.name }} -->
  </n-h1>
  <n-card size="large" style="padding-bottom: 30px">
    <n-h2 style="font-weight: 400">Kirish</n-h2>
    <n-form size="large" :rules="rules" :model="model">
      <n-form-item-row label="Username" path="username">
        <n-input
          v-model:value="model.username"
          placeholder="Input your username"
        />
      </n-form-item-row>
      <n-form-item-row label="Parol" path="password">
        <n-input
          v-model:value="model.password"
          type="password"
          placeholder="Input your password"
        />
      </n-form-item-row>
    </n-form>
    <n-button
      type="primary"
      size="large"
      block
      :loading="loading"
      :disabled="disabled"
      @click="handleLogin"
      >Kirish</n-button
    >
    <br />
  </n-card>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import axios from "axios";
const router = useRouter();
const message = useMessage();
const rules = {
  username: {
    required: true,
    message: "Username is required.",
    trigger: "blur",
  },
  password: {
    required: true,
    message: "Password is required.",
    trigger: "blur",
  },
};
const model = ref({
  username: "",
  password: "",
});

const loading = ref(false);

const disabled = computed(
  () => model.value.username === "" || model.value.password === ""
);

const handleLogin = async (e) => {
  e.preventDefault();
  loading.value = true;
  try {
    const res = await axios.post(`/user/login`, model.value);
    if (res.status) {
      localStorage.setItem('full_name', res.data.full_name);
      localStorage.setItem('role', res.data.role)
      localStorage.setItem('username', res.data.username)
      localStorage.setItem("token", res.data.token);
      if(res.data.role == 'admin') {
        router.push({
          name: "Home",
        });
      } else if(res.data.role == 'chief') {
        router.push({
          name: 'chief-window'
        })
      } else if(res.data.role == 'waiter' || res.data.role == 'caisher') {
        router.push({
          name: 'sellingWindow'
        })
      }
    } else {
      message.error(res.message);
    }
  } catch (e) {
    message.error(e);
  }
  loading.value = false;
};
</script>

<style scoped>
.n-h1 {
  margin: 20vh auto 20px;
  text-align: center;
  letter-spacing: 5px;
  opacity: 0.8;
}

.n-card {
  margin: 0 auto;
  max-width: 380px;
  box-shadow: -1px 8px 11px 1px rgba(34, 60, 80, 0.2);
}
</style>
