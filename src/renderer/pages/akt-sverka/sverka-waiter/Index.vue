<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import WaiterService from "../../../services/waiter.service";
import moment from "moment";
const date1 = ref(new Date().setHours(0, 0, 0, 0));
const date2 = ref(new Date().setHours(23, 59, 59, 999));
const waiters = ref([]);
const waiter_id = ref(null);
const reports = ref(null);

onMounted(async () => {
  waiters.value = await WaiterService.getAll();
  console.log(waiters.value)
});

const getReport = () => {
  axios
    .post(`/akt-sverka/waiter-act`, {
      datetime1: Math.floor(date1.value / 1000),
      datetime2: Math.floor(date2.value / 1000),
      waiter_id: waiter_id.value,
    })
    .then((res) => {
        console.log(res)
      reports.value = res.data;
    });
};


//top drawer start
import OrderForm from '../../savdo-docs/orders/FormOrders.vue';
import PayWaiter from '../../payments/pay-waiter/FormPayWaiter.vue';
import EmpSalary from '../../savdo-docs/employee-salary/FormEmpSalary.vue';
import { CloseRound } from '@vicons/material'
const showTopDrawer = ref(false);
const drawerHeight = ref(0)
const chId = ref(null)
const ChdocType = ref(null)
const openTopDrawer = (data) => {
  showTopDrawer.value = true;
  chId.value = data.doc_id;
  ChdocType.value = data.doc_type;
  if(data.doc_type == 'order' || data.doc_type == 'emp_salary') {
    drawerHeight.value = 600
  } else if(data.doc_type == 'pay_waiter') {
    drawerHeight.value = 300
  }
}


//top drawer end




</script>
<template>
  <div>
    <!--top drawer start-->
    <n-drawer v-model:show="showTopDrawer" placement="top" :height="drawerHeight">
      <n-drawer-content title="Document">
        <OrderForm @close="showTopDrawer = false" v-if="ChdocType == 'order'" type="sverka" :id="chId"></OrderForm>
        <PayWaiter v-else-if="ChdocType == 'pay_waiter'" type="sverka" :id="chId"></PayWaiter>
        <EmpSalary v-else-if="ChdocType == 'emp_salary'" type="sverka" :id="chId"></EmpSalary>
        <n-button v-if="ChdocType != 'order'" style="position: absolute; right: 10px; bottom: 10px" type="error" @click="showTopDrawer = false">
          Yopish
          <template #icon>
            <n-icon>
              <CloseRound></CloseRound>
            </n-icon>
          </template>
        </n-button>
      </n-drawer-content>
    </n-drawer>
    <!--top drawer end-->


  <n-form class="form">
    <n-date-picker
      v-model:value="date1"
      type="date"
      style="width: 200px"
      placeholder="Tanlang"
    />
    <n-date-picker
      v-model:value="date2"
      type="date"
      style="width: 200px"
      placeholder="Tanlang"
    />
    <n-select
      v-model:value="waiter_id"
      :options="waiters"
      placeholder="Tanlang"
      label-field="full_name"
      value-field="id"
      style="width: 200px"
    ></n-select>

    <n-button type="success" color="#04AA6D" @click="getReport"
      ><span style="color: #fff; font-weight: bold">Ko'rish</span></n-button
    >
  </n-form>

  <div class="table">
    <table v-if="reports" id="customers">
      <tr>
        <th rowspan="2">Operatsiya</th>
        <th rowspan="2">Ofitsant</th>
        <th colspan="2">Summa</th>
      </tr>

      <tr>
        <th>To'landi</th>
        <th>Olindi</th>
      </tr>

      <tr>
        <td colspan="2">
          Kunboshiga: {{ moment(date1).format("YYYY-MM-DD") }}
        </td>
        <td colspan="2" style="text-align: center;">
          {{
            new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
              reports.total.kunboshi
            )
          }}
        </td>
      </tr>

      <tr v-for="(dt, index) in reports.items" @click="openTopDrawer(dt)">
        <td>
          #{{ dt.doc_id }} {{ dt.doc_type == 'order' ? 'Savdo xujjati': dt.doc_type == 'pay_waiter' ? "Ofitsantga to'lov": dt.doc_type == 'emp_salary' ? "Xodimlarga to'lov belgilash": dt.doc_type }}
          {{ moment(dt.datetime * 1000).format("YYYY-MM-DD hh:mm:ss") }}
        </td>
        <td>{{ dt.waiter.full_name }}</td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
              dt.tolandi
            )
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
              dt.olindi
            )
          }}
        </td>
      </tr>

      <tr>
        <td colspan="2">
          Shu kungacha oborot: {{ moment(date1).format("YYYY-MM-DD") }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
              reports.total.oborot_tolangan
            )
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
              reports.total.oborot_olingan
            )
          }}
        </td>
      </tr>

      <tr>
        <td colspan="2">
          Oxirgi qoldiq: {{ moment(date2.value).format("YYYY-MM-DD") }}
        </td>
        <td colspan="2" style="text-align: center;">
          {{
            new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
              reports.total.kunoxiri
            )
          }}
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
