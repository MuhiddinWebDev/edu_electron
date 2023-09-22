<template>
  <n-form class="form">
    <n-date-picker
      v-model:value="form_data.datetime1"
      type="date"
      style="width: 200px"
      placeholder="Tanlang"
    />
    <n-date-picker
      v-model:value="form_data.datetime2"
      type="date"
      style="width: 200px"
      placeholder="Tanlang"
    />
    <n-select
      v-model:value="form_data.branch_id"
      :options="branchesSelect"
      placeholder="Tanlang"
      style="width: 200px"
    ></n-select>

    <n-button type="success" color="#04AA6D" @click="getReport"
      ><span style="color: #fff; font-weight: bold">Ko'rish</span></n-button
    >
  </n-form>

  <div class="table">
    <table v-if="reports" id="customers">
      <tr>
        <th>Tovar</th>
        <th>Miqdor</th>
        <th>Narx</th>
        <th>Summa</th>
      </tr>

      <tr v-for="(dt, index) in reports.data">
        <td>
          {{ dt.food.name }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
              dt.count
            )
          }}
        </td>

        <td>
          {{
            new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
              dt.food.sell_price
            )
          }}
        </td>

        <td>
          {{
            new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(dt.sum)
          }}
        </td>
      </tr>

      <tr>
        <td>Jami:</td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
              reports.jami_soni
            )
          }}
        </td>
        <td></td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
              reports.jami_summa
            )
          }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BranchService from "../../../services/branch.service";
import SoldFoodService from "../../../services/report.service";

const form_data = ref({
  datetime1: new Date().setHours(0, 0, 0, 0),
  datetime2: new Date().setHours(23, 59, 59, 999),
  branch_id: null,
});

const branches = ref([]);
const branchesSelect = ref([]);
const reports = ref(null);

onMounted(async () => {
  branches.value = await BranchService.getAll();
  for (let i = 0; i < branches.value.length; i++) {
    const element = branches.value[i];
    branchesSelect.value.push({
      label: element.name,
      value: element.id,
    });
  }
});

const getReport = () => {
  SoldFoodService.soldFoodSverka({
    datetime1: Math.floor(form_data.value['datetime1'] / 1000),
    datetime2: Math.floor(form_data.value['datetime2'] / 1000),
    branch_id: form_data.value['branch_id']
  }).then((res) => {
    reports.value = res.data;
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
  padding: 1rem;
  font-weight: bold;
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
