<script setup>
import ReportService from "../../../services/report.service";
import BranchService from "../../../services/branch.service";
import { ref, onMounted } from "vue";
import axios from 'axios';
import moment from "moment";
const reports = ref({
    items: [],
    total: {}
})
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
  axios
    .post(`/akt-sverka/product-report`, {
      datetime1: Math.floor(form_data.value.datetime1 / 1000),
      datetime2: Math.floor(form_data.value.datetime2 / 1000),
      branch_id: form_data.value.branch_id,
    })
    .then((res) => {
      console.log(res)
      reports.value = res.data;
    });
};
</script>

<template>
    <div>
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
                        :options="branches"
                        placeholder="Tanlang"
                        style="width: 200px"
                    ></n-select>
            <n-button type="success" color="#04AA6D" @click="getReport"
            ><span style="font-weight: bold">Ko'rish</span></n-button
            >
        </n-form>
        <div class="table">
            <table id="customers">
                <tr>
                    <th rowspan="2">Xomashyo</th>
                    <th colspan="2">Bosh qoldiq</th>
                    <th colspan="2">Kirim</th>
                    <th colspan="2">Savdo</th>
                    <th colspan="2">Qoldiq</th>
                </tr>

                <tr>
                    <th>Miqdori</th>
                    <th>Summasi</th>
                    <th>Miqdori</th>
                    <th>Summasi</th>
                    <th>Miqdori</th>
                    <th>Summasi</th>
                    <th>Miqdori</th>
                    <th>Summasi</th>
                </tr>
                <tr v-for="rp in reports.items">
                    <td>
                        {{ rp.food_resource.name }}
                    </td>
                    <td>
                        {{new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(rp.bosh_qoldiq_amount)}}
                    </td>
                    <td>
                        {{new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(rp.bosh_qoldiq_sum)}}
                    </td>
                    <td>
                        {{new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(rp.debit_amount)}}
                    </td>
                    <td>
                        {{new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(rp.debit_sum)}}
                    </td>
                    <td>
                        {{new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(rp.sell_amount)}}
                    </td>
                    <td>
                        {{new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(rp.sell_sum)}}
                    </td>
                    <td>
                        {{new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(rp.ost_amount)}}
                    </td>
                    <td>
                        {{new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(rp.ost_sum)}}
                    </td>
                </tr>
                <tr v-if="Object.keys(reports.total).length > 0">
                    <td>Jami:</td>
                    <td colspan="2">
                        {{new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(reports.total.bosh_qoldiq_sum)}}
                    </td>
                    <td colspan="2" style="">
                        {{new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(reports.total.debit_sum)}}
                    </td>
                    <td colspan="2">
                        {{new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(reports.total.sell_sum)}}
                    </td>
                     <td colspan="2">
                        {{new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(reports.total.ost_sum)}}
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>


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