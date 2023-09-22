<template>
  <!--top drawer start-->
  <n-drawer v-model:show="showTopDrawer" placement="top" :height="drawerHeight">
      <n-drawer-content title="Document">
        <!-- <KirimForm v-if="ChdocType == 'doc_debit'" type="sverka" :id="chId"></KirimForm> -->
        <!-- <PaySupplier v-else-if="ChdocType == 'pay_supplier'" type="sverka" :id="chId"></PaySupplier> -->
        <OrderForm v-if="ChdocType == 'order'" type="sverka" :id="chId"></OrderForm>
        <n-button style="position: fixed; right: 10px; top: 10px" type="error" @click="showTopDrawer = false">
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
      v-model:value="form_data.datetime1"
      type="date"
      style="width: 200px"
    />
    <n-date-picker
      v-model:value="form_data.datetime2"
      type="date"
      style="width: 200px"
    />

    <n-button type="success" color="#04AA6D " @click="getReport"
      ><span style="color: #fff; font-weight: bold">Ko'rish</span></n-button
    >
  </n-form>
  <div class="table">
    <table id="customers">
      <tr>
        <th>Sana</th>
        <th>Xujjat</th>
        <th>Stol</th>
        <th>Ofitsant</th>
        <th>Jami summa</th>
        <th>To'lov summa</th>
        <th>Umumiy xizmat</th>
        <th>Ofitsant xaqqi</th>
        <th>Naqt</th>
        <th>Plastic</th>
        <th>Chegirma</th>
        <th>Nasiya</th>
      </tr>

      <tr v-for="item in items" @click="openTopDrawer(item)">
        <td>
          {{ moment.unix(item.datetime).format("YYYY-MM-DD HH:mm:ss") }}
        </td>
        <td>
          {{ item.doc_type === 'order' ? 'Savdo Xujjati' : '' }}
          {{ moment.unix(item.datetime).format("YYYY-MM-DD HH:mm:ss") }}
        </td>
        <td>
          {{ item.table.name }}
        </td>
        <td>
          {{ item.waiter.full_name }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(item.all_sum)
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(item.pay_sum)
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(item.common_service)
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(item.waiter_sum)
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(item.cash_sum)
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(item.plastic_sum)
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(item.discount_sum)
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(item.credit_sum)
          }}
        </td>
      </tr>

      <tr v-if="total != null">
        <td colspan="4">Jami:</td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(total.all_sum_total)
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(total.pay_sum_total)
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(total.common_service_total)
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(total.waiter_sum_total)
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(total.cash_sum_total)
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(total.plastic_sum_total)
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(total.discount_sum_total)
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", {
              style: "decimal",
            }).format(total.credit_sum_total)
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

const form_data = ref({
  datetime1: new Date().setHours(0, 0, 0, 0),
  datetime2: new Date().setHours(23, 59, 59, 999),
});

const getReport = () => {
  ReportService.restrCaisher({
    datetime1: form_data.value['datetime1'] / 1000,
    datetime2: form_data.value['datetime2'] / 1000
  }).then((res) => {
    console.log(res)
    items.value = res.items;
    total.value = res.total;
  });
};


//top drawer start
import OrderForm from '../../savdo-docs/orders/FormOrders.vue';
import { CloseRound } from '@vicons/material'
const showTopDrawer = ref(false);
const drawerHeight = ref(0)
const chId = ref(null)
const ChdocType = ref(null)
const openTopDrawer = (data) => {
  showTopDrawer.value = true;
  chId.value = data.doc_id;
  ChdocType.value = data.doc_type;
  if(data.doc_type == 'doc_debit' || data.doc_type == 'order') {
    drawerHeight.value = 700
  } else if(data.doc_type == 'pay_supplier') {
    drawerHeight.value = 300
  }
}
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
