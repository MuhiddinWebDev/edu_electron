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
      v-model:value="form_data.supplier_id"
      :options="suppliers"
      placeholder="Tanlang"
      style="width: 200px"
    ></n-select>

    <n-button type="success" color="#04AA6D " @click="getReport"
      ><span style="color: #fff; font-weight: bold">Ko'rish</span></n-button
    >
  </n-form>
  <div class="table">
    <table id="customers">
      <tr>
        <th>Ta'minotchi</th>
        <th>Boshlang'ich</th>
        <th>Berilgan</th>
        <th>Olingan</th>
        <th>Oxirgi</th>
      </tr>

      <tr v-for="item in items">
        <td>
          {{ item.supplier.name }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(item.begin)
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(item.berdim)
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(item.oldim)
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(item.end)
          }}
        </td>
      </tr>

      <tr v-if="total != null">
        <td>Jami:</td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(total.begin_all)
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(total.berdim_all)
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(total.oldim_all)
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(total.end_all)
          }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import ReportService from "../../../services/report.service";
import SupplierService from "../../../services/taminotchilar.service";
import { ref, onMounted } from "vue";

const items = ref([]);
const total = ref(null);
const suppliers = ref([]);
const form_data = ref({
  datetime1: new Date().setHours(0, 0, 0, 0),
  datetime2: new Date().setHours(23, 59, 59, 999),
  supplier_id: null,
});

onMounted(() => {
  SupplierService.getAll().then((res) => {
    res.forEach((val) => {
      suppliers.value.push({
        label: val.name,
        value: val.id,
      });
    });
  });
});

const getReport = () => {
  ReportService.supplierReports({
    datetime1: form_data.value['datetime1'] / 1000,
    datetime2: form_data.value['datetime2'] / 1000,
    supplier_id: form_data.value['supplier_id']
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
