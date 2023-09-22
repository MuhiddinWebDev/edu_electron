<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import SupplierServer from "../../../services/taminotchilar.service";
import moment from "moment";
const date1 = ref(new Date().setHours(0, 0, 0, 0));
const date2 = ref(new Date().setHours(23, 59, 59, 999));
const suppliers = ref([]);
const suppliersSelect = ref([]);
const selectedSupplier = ref(null);
const reports = ref(null);

onMounted(async () => {
  suppliers.value = await SupplierServer.getAll();
  for (let i = 0; i < suppliers.value.length; i++) {
    const element = suppliers.value[i];
    suppliersSelect.value.push({
      label: element.name,
      value: element.id,
    });
  }
});

const getReport = () => {
  axios
    .post(`/akt-sverka/supplier-act`, {
      datetime1: Math.floor(date1.value / 1000),
      datetime2: Math.floor(date2.value / 1000),
      supplier_id: selectedSupplier.value,
    })
    .then((res) => {
      reports.value = res.data;
    });
};


//top drawer start
import KirimForm from '../../kirim-docs/kirim/FormKirim.vue';
import PaySupplier from '../../payments/pay-supplier/FormPaySupplier.vue';
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
  } else if(data.doc_type == 'pay_supplier') {
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
        <PaySupplier v-else-if="ChdocType == 'pay_supplier'" type="sverka" :id="chId"></PaySupplier>
        <n-button style="position: absolute; right: 10px; bottom: 10px" type="error" @click="showTopDrawer = false">
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
      v-model:value="selectedSupplier"
      :options="suppliersSelect"
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
        <th rowspan="2">Yetkazib beruvchi</th>
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
          #{{ dt.doc_id }} {{ dt.doc_type == 'doc_debit' ? 'Kirim': dt.doc_type == 'pay_supplier' ? "Ta'minotchiga to'lov": dt.doc_type }}
          {{ moment(dt.datetime * 1000).format("YYYY-MM-DD hh:mm:ss") }}
        </td>
        <td>{{ dt.supplier.name }}</td>
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
