

<script setup>
import axios from "axios";
import { ref } from "vue";
import moment from "moment";
const date1 = ref(new Date().setHours(0, 0, 0, 0));
const date2 = ref(new Date().setHours(23, 59, 59, 999));
const pay_types = ref([
  {
    label: "Naqt",
    value: "cash",
  },
  {
    label: "Plastic",
    value: "plastic",
  },
]);
const selectedPayType = ref(null);
const reports = ref(null);

const getReport = () => {
  axios
    .post(`akt-sverka/cash-act`, {
      datetime1: Math.floor(date1.value / 1000),
      datetime2: Math.floor(date2.value / 1000),
      pay_type: selectedPayType.value,
    })
    .then((res) => {
      reports.value = res.data;
    });
};


//top drawer start
import KirimForm from '../../kirim-docs/kirim/FormKirim.vue';
import OrderForm from '../../savdo-docs/orders/FormOrders.vue'
import PaySupplier from '../../payments/pay-supplier/FormPaySupplier.vue';
import PayWaiter from '../../payments/pay-waiter/FormPayWaiter.vue';
import ClientPay from '../../payments/pay-client/PayClaintForm.vue';
import PayWorker from '../../payments/pay-worker/FormPayWorker.vue';
import PayChef from '../../payments/pay-chef/FormPayChef.vue';
import PayCaisher from '../../payments/pay-caisher/FormPayCaisher.vue';
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
    drawerHeight.value = 600
  } else if(
    data.doc_type == 'pay_supplier'
    || data.doc_type == 'pay_to_worker' 
    || data.doc_type == 'pay_waiter'
    || data.doc_type == 'client_pay'
    || data.doc_type == 'pay_chef'
    || data.doc_type == 'pay_caisher'
    ) {
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
        <KirimForm v-if="ChdocType == 'doc_debit'" type="sverka" :id="chId"></KirimForm>
        <OrderForm @close="showTopDrawer = false" v-if="ChdocType == 'order'" type="sverka" :id="chId"></OrderForm>
        <PaySupplier v-else-if="ChdocType == 'pay_supplier'" type="sverka" :id="chId"></PaySupplier>
        <PayWaiter v-else-if="ChdocType == 'pay_waiter'" type="sverka" :id="chId"></PayWaiter>
        <ClientPay v-else-if="ChdocType == 'client_pay'" type="sverka" :id="chId"></ClientPay>
        <PayWorker v-else-if="ChdocType == 'pay_to_worker'" type="sverka" :id="chId"></PayWorker>
        <PayChef v-else-if="ChdocType == 'pay_chef'" type="sverka" :id="chId"></PayChef>
        <PayCaisher v-else-if="ChdocType == 'pay_caisher'" type="sverka" :id="chId"></PayCaisher>
        <n-button v-if="ChdocType !== 'order'"  style="position: absolute; right: 10px; bottom: 10px" type="error" @click="showTopDrawer = false">
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
      v-model:value="selectedPayType"
      :options="pay_types"
      placeholder="Tanlang"
      style="width: 200px"
    ></n-select>

    <n-button type="success" color="#04AA6D" @click="getReport"
      ><span style="color: #fff; font-weight: bold">Ko'rish</span></n-button
    >
  </n-form>
  <div class="tophider"></div>
  <div class="table">
    <table v-if="reports" id="customers">
      <thead>
        <tr>
          <th rowspan="2">Operatsiya</th>
          <th rowspan="2">Izoh</th>
          <th colspan="2">Summa</th>
        </tr>
        <tr>
          <th>Kirim</th>
          <th>Chiqim</th>
        </tr>
        <tr style="background-color: #fff;">
          <td colspan="2">
            Kun boshiga: {{ moment(date1).format("DD.MM.YYYY") }}
          </td>
          <td colspan="2">
            {{
              new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
                reports.total.kunboshi
              )
            }}
          </td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(dt, index) in reports.items" @click="openTopDrawer(dt)">
          <td>
            #{{ dt.doc_id }} {{ 
              dt.doc_type == 'doc_debit' ? "Kirim":
              dt.doc_type == 'pay_waiter' ? "Ofitsantga to'lov": 
              dt.doc_type == 'pay_supplier' ? "Ta'minotchiga to'lov" : 
              dt.doc_type == 'order' ? 'Buyurtma':
              dt.doc_type =='client_pay' ? "Klientga to'lov":
              dt.doc_type == 'pay_to_worker' ? "Ishchiga to'lov":
              dt.doc_type == 'pay_chef' ? "Oshpazga to'lov":
              dt.doc_type == 'pay_caisher' ? "Kassirga to'lov":
              dt.doc_type
              }}
            {{ moment(dt.datetime * 1000).format("DD.MM.YYYY hh:mm:ss") }}
          </td>
          <td>
            {{ dt.comment }}
          </td>
          <td>
            {{
              new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
                dt.kirim
              )
            }}
          </td>
          <td>
            {{
              new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
                dt.chiqim
              )
            }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2">Pul aylanmasi:</td>
          <td>
            {{
              new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
                reports.total.oborot_kirim
              )
            }}
          </td>
          <td colspan="2">
            {{
              new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
                reports.total.oborot_chiqim
              )
            }}
          </td>
        </tr>
        <tr>
          <td colspan="2">
            Shu kungacha qoldiq: {{ moment(date2).format("DD.MM.YYYY") }}
          </td>
          <td colspan="3">
            {{
              new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
                reports.total.kun_oxirgi
              )
            }}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
  <div class="bottomHider">

  </div>
</div>

</template>


<style scoped>
.form {
  padding: 0.5rem 1rem;
  display: flex;
  column-gap: 1rem;
}
.tophider {
width: 100%;
height: 100px;
position: absolute;
background-color: white;
z-index: 50;
}
.bottomHider {
  width: 100%;
  height: 20px;
  position: absolute;
  bottom: 0;
  background-color: white;
  z-index: 50;
}

.table {
  padding: 1rem;
  font-weight: bold;
  height: calc(100vh - 170px);
  overflow: auto;
}
#customers thead {
    /* display: block; */
    position: sticky;
    top: 0;
    z-index: 200;
}
#customers tfoot {
  position: sticky;
  background-color: white;
  bottom: 0px;
}
/* #customers thead tr {
  position: sticky;
  z-index: 1000;
} */
/* #customers thead, tbody {
  width: 100%;
  display: block;
} */
#customers {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
  max-height: 400px;
  /* display: block;
  overflow: scroll; */
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
