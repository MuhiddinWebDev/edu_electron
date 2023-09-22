<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const options = [
  { label: 'Abubakir', value: 1 },
  { label: 'Egamberdi', value: 2 },
  { label: 'Muhammadali', value: 3 },
]
const user = { username: null, password: '' }
</script>

<template style="background-color: #eee">
  <div id="main">
    <div class="form">
      <n-select v-model:value="user.username" :options="options" />
      <n-input v-model:value="user.password" type="text" />
      <n-button type="primary" @click="router.push({ name: 'sellingWindow' })"
        >Kirish</n-button
      >
      <n-button type="error" @click="router.go(-1)">Orqaga</n-button>
    </div>
  </div>
</template>
<style scoped>
.form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30%;
  margin: auto;
  margin-top: 100px;
  height: 300px;
  background-color: #fff;
  padding: 50px;
  border-radius: 5px;
}
</style>