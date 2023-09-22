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
      v-model:value="form_data.chef_id"
      :options="chiefs"
      placeholder="Tanlang"
      style="width: 200px"
      label-field="full_name"
      value-field="id"
    ></n-select>

    <n-button type="success" color="#04AA6D " @click="getReport"
      ><span style="color: #fff; font-weight: bold">Ko'rish</span></n-button
    >
  </n-form>

  <div class="table">
    <table id="customers">
      <tr>
        <th>Oshpaz</th>
        <th>Boshlang'ich</th>
        <th>Oshpaz summa</th>
        <th>To'langan</th>
        <th>Oxirgi</th>
      </tr>

      <tr v-for="item in items">
        <td>
          {{ item.chef.full_name }}
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
            }).format(item.chief_summa)
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
            }).format(total.chief_summa_total)
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

<script setup>
import ReportService from "../../../services/report.service";
import ChefService from "../../../services/chief.service";
import { ref, onMounted } from "vue";
import moment from "moment";
const items = ref([]);
const total = ref(null);
const chiefs = ref([]);

const form_data = ref({
  datetime1: new Date().setHours(0, 0, 0, 0),
  datetime2: new Date().setHours(23, 59, 59, 999),
  chef_id: null,
});

onMounted(() => {
  ChefService.getAll().then((res) => {
    chiefs.value = res;
  });
});

const getReport = () => {
  ReportService.chefReports({
    datetime1: Math.floor(form_data.value.datetime1 / 1000),
    datetime2: Math.floor(form_data.value.datetime2 / 1000),
    chef_id: form_data.value.chef_id
  }).then((res) => {
    items.value = res.data.items;
    total.value = res.data.total;
  });
};
</script>

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
