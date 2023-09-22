<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import branchService from "../../../services/branch.service";
import productService from "../../../services/food_resource.service";
import moment from "moment";
const date1 = ref(new Date().setHours(0, 0, 0, 0));
const date2 = ref(new Date().setHours(23, 59, 59, 999));
const products = ref([]);
const branches = ref([]);
const branch_id = ref(null);
const product_id = ref(null);
const reports = ref(null);

onMounted(() => {
  branchService.getAll().then((res) => {
    res.forEach((val) => {
      branches.value.push({
        label: val.name,
        value: val.id,
      });
    });
  });

  productService.getAll().then((res) => {
    res.forEach((val) => {
      products.value.push({
        label: val.name,
        value: val.id,
      });
    });
  });
});

const getReport = () => {
  axios
    .post(`/akt-sverka/product-act`, {
      datetime1: Math.floor(date1.value / 1000),
      datetime2: Math.floor(date2.value / 1000),
      branch_id: branch_id.value,
      product_id: product_id.value,
    })
    .then((res) => {
      console.log(res)
      reports.value = res.data;
    });
};
//top drawer start
import KirimForm from '../../kirim-docs/kirim/FormKirim.vue';
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
  if(data.doc_type == 'doc_debit') {
    drawerHeight.value = 600
  } else if(
    data.doc_type == 'pay_supplier'
    || data.doc_type == 'pay_to_worker' 
    || data.doc_type == 'pay_waiter'
    || data.doc_type == 'client_pay'
    || data.doc_type == 'pay_chef'
    ) {
        drawerHeight.value = 300
    }
}
//top drawer end


</script>

<template>
  <div>
    <!--top drawer-->
    <n-drawer v-model:show="showTopDrawer" placement="top" :height="drawerHeight">
      <n-drawer-content title="Document">
        <KirimForm v-if="ChdocType == 'doc_debit'" type="sverka" :id="chId"></KirimForm>
        <OrderForm @close="showTopDrawer = false" v-if="ChdocType == 'order'" type="sverka" :id="chId"></OrderForm>
        <n-button v-if="ChdocType !== 'order'" style="position: absolute; right: 10px; bottom: 10px" type="error" @click="showTopDrawer = false">
          Yopish
          <template #icon>
            <n-icon>
              <CloseRound></CloseRound>
            </n-icon>
          </template>
        </n-button>
      </n-drawer-content>
    </n-drawer>
    <!--top drawer-->
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
      v-model:value="branch_id"
      :options="branches"
      placeholder="Tanlang"
      style="width: 200px"
    ></n-select>
    <n-select
      v-model:value="product_id"
      :options="products"
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
        <th rowspan="2">Operatsiya</th>
        <th rowspan="2">Tovar</th>
        <th colspan="2">Summa</th>
        <th colspan="2">Soni</th>
      </tr>

      <tr>
        <th>Kirim</th>
        <th>Sotildi</th>
        <th>Kirim</th>
        <th>Sotildi</th>
      </tr>

      <tr>
        <td colspan="2">
          Kun boshiga: {{ moment(date1).format("DD.MM.YYYY") }}
        </td>
        <td colspan="2">
          {{
            new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
              reports.total.kunboshi_sum
            )
          }}
        </td>
        <td colspan="2">
          {{
            new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
              reports.total.kunboshi_miqdor
            )
          }}
        </td>
      </tr>

      <tr v-for="(dt, index) in reports.items" @click="openTopDrawer(dt)">
        <td>
          {{dt.doc_id}} {{ dt.doc_type == 'doc_debit' ? "Kirim": dt.doc_type == 'pay_waiter' ? "Ofitsantga to'lov": dt.doc_type == 'pay_supplier' ? "Ta'minotchiga to'lov" : dt.doc_type == 'order' ? 'Buyurtma': dt.doc_type}}
          {{ moment(dt.datetime * 1000).format("DD.MM.YYYY hh:mm:ss") }}
        </td>
        <td>{{ dt.food_resource.name }}</td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
              dt.kirim_sum
            )
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
              dt.chiqim_sum
            )
          }}
        </td>

        <td>
          {{
            new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
              dt.kirim_miqdor
            )
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
              dt.chiqim_miqdor
            )
          }}
        </td>
      </tr>

      <tr>
        <td colspan="2">Oborot:</td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
              reports.total.oborot_kirim_sum
            )
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
              reports.total.oborot_chiqim_sum
            )
          }}
        </td>

        <td>
          {{
            new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
              reports.total.oborot_kirim_miqdor
            )
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
              reports.total.oborot_chiqim_miqdor
            )
          }}
        </td>
      </tr>

      <tr>
        <td colspan="2">
          Oxirgi qoldiq: {{ moment(date2).format("DD.MM.YYYY") }}
        </td>
        <td colspan="2">
          {{
            new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
              reports.total.kunoxiri_sum
            )
          }}
        </td>
        <td colspan="2">
          {{
            new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
              reports.total.kunoxiri_miqdor
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
