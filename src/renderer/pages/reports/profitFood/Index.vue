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
      v-model:value="form_data.branch_id"
      :options="branches"
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
        <th>Taom</th>
        <th>Soni</th>
        <th>Summasi</th>
        <th>Foyda</th>
      </tr>

      <tr v-for="item in items">
        <td>
          {{ item.food.name }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(item.count_food)
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(item.sum_food)
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(item.profit_food)
          }}
        </td>
      </tr>

      <tr v-if="total != null">
        <td>Jami:</td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(total.count_total)
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(total.sum_total)
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(total.profit_total)
          }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import ReportService from "../../../services/report.service";
import BranchService from "../../../services/branch.service";
import { ref, onMounted } from "vue";
import moment from "moment";
const items = ref([]);
const total = ref(null);
const branches = ref([]);

const form_data = ref({
  datetime1: new Date().setHours(0, 0, 0, 0),
  datetime2: new Date().setHours(23, 59, 59, 999),
  branch_id: null,
});

onMounted(() => {
  BranchService.getAll().then((res) => {
    res.forEach((val) => {
      branches.value.push({
        label: val.name,
        value: val.id,
      });
    });
  });
});
const getReport = () => {
  ReportService.profitReports({
    datetime1: form_data.value['datetime1'] / 1000,
    datetime2: form_data.value['datetime2'] / 1000,
    branch_id: form_data.value['branch_id']
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
