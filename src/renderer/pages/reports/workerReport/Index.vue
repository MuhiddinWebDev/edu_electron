<script setup>
import axios from 'axios';
import WorkerService from "../../../services/worker.service";
import { ref, onMounted } from "vue";
import moment from "moment";
const items = ref([]);
const total = ref(null);
const workers = ref([]);

const form_data = ref({
  datetime1: new Date().setHours(0, 0, 0, 0),
  datetime2: new Date().setHours(23, 59, 59, 999),
  worker_id: null,
});

onMounted(() => {
  WorkerService.getAll().then((res) => {
    workers.value = res;
  });
});

const getReport = () => {
  axios.post(`/akt-sverka/worker-report`, {
    datetime1: form_data.value.datetime1 / 1000,
    datetime2: form_data.value.datetime2 / 1000,
    worker_id: form_data.value.worker_id
  }).then((res) => {
    items.value = res.data.items;
    total.value = res.data.total;
  });
};
</script>


<template>
    <n-form class="form">
      <n-date-picker
        v-model:value="form_data.datetime1"
        type="date"
        style="width: 200px"
      />
      <n-date-picker
        v-model:value="form_data.datetime2"
        type="date"
        style="width: 200px"
      />
      <n-select
        v-model:value="form_data.worker_id"
        :options="workers"
        placeholder="Tanlang"
        style="width: 200px"
        label-field="name"
        value-field="id"
      ></n-select>
  
      <n-button type="success" color="#04AA6D " @click="getReport"
        ><span style="color: #fff; font-weight: bold">Ko'rish</span></n-button
      >
    </n-form>
  
    <div class="table">
      <table id="customers">
        <tr>
          <th>Ofitsant</th>
          <th>Boshlang'ich</th>
          <th>Ishchi summa</th>
          <th>To'langan</th>
          <th>Oxirgi</th>
        </tr>
  
        <tr v-for="item in items">
          <td>
            {{ item.worker.name }}
          </td>
          <td>
            {{
              new Intl.NumberFormat("ru-RU", {
                style: "decimal",
              }).format(item.begin_summa)
            }}
          </td>
          <td>
            {{
              new Intl.NumberFormat("ru-RU", {
                style: "decimal",
              }).format(item.worker_summa)
            }}
          </td>
          <td>
            {{
              new Intl.NumberFormat("ru-RU", {
                style: "decimal",
              }).format(item.payed_summa)
            }}
          </td>
          <td>
            {{
              new Intl.NumberFormat("ru-RU", {
                style: "decimal",
              }).format(item.last_summa)
            }}
          </td>
        </tr>
  
        <tr v-if="total != null">
          <td>Jami:</td>
          <td>
            {{
              new Intl.NumberFormat("ru-RU", {
                style: "decimal",
              }).format(total.begin_summa_total)
            }}
          </td>
          <td>
            {{
              new Intl.NumberFormat("ru-RU", {
                style: "decimal",
              }).format(total.worker_summa_total)
            }}
          </td>
          <td>
            {{
              new Intl.NumberFormat("ru-RU", {
                style: "decimal",
              }).format(total.payed_summa_total)
            }}
          </td>
          <td>
            {{
              new Intl.NumberFormat("ru-RU", {
                style: "decimal",
              }).format(total.last_summa_total)
            }}
          </td>
        </tr>
      </table>
    </div>
  </template>
  
  <style scoped>
  .form {
    padding: 0.5rem 1rem;
    display: flex;
    column-gap: 1rem;
  }
  .table {
    font-weight: bold;
    padding: 1rem;
  }
  
  #customers {
    font-family: Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }
  
  #customers td,
  #customers th {
    border: 1px solid #ddd;
    padding: 8px;
    font-weight: bold;
  }
  
  #customers th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #04aa6d;
    color: white;
  }
  </style>
  