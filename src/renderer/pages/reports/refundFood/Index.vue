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
        <th>Sana</th>
        <th>Taom</th>
        <th>Filial</th>
        <th>Ofitsant</th>
        <th>Stol</th>
        <th>Soni</th>
        <th>Narxi</th>
      </tr>

      <tr v-for="item in items">
        <td>
          {{ moment.unix(item.datetime).format("YYYY-MM-DD HH:mm:ss") }}
        </td>
        <td>
          {{ item.food.name }}
        </td>
        <td>
          {{ item.branch.name }}
        </td>
        <td>
          {{ item.waiter.full_name }}
        </td>
        <td>
          {{ item.table.name }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(item.count)
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(item.price)
          }}
        </td>
      </tr>

      <tr v-if="total != null">
        <td colspan="5">Jami:</td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(total.jami_soni)
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(total.jami_summa)
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
  datetime1: ref(new Date().setHours(0, 0, 0, 0)),
  datetime2: ref(new Date().setHours(23, 59, 59, 999)),
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
  ReportService.refundFood(form_data.value).then((res) => {
    total.value = {
      jami_soni: res.jami_soni,
      jami_summa: res.jami_summa,
    };
    items.value = res.data;
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
