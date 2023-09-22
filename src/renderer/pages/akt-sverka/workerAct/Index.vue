<script setup>
import { ref, onMounted } from "vue";
import WorkerService from "../../../services/worker.service";
import WorkerActService from "../../../services/report.service";
import moment from 'moment'
const form_data = ref({
  datetime1: new Date().setHours(0, 0, 0, 0),
  datetime2: new Date().setHours(23, 59, 59, 999),
  worker_id: null,
});

const workers = ref([]);
const workersSelect = ref([]);
const selectedWorker = ref(null);
const reports = ref(null);

onMounted(async () => {
  workers.value = await WorkerService.getAll();
  for (let i = 0; i < workers.value.length; i++) {
    const element = workers.value[i];
    workersSelect.value.push({
      label: element.name,
      value: element.id,
    });
  }
});

const getReport = () => {
  WorkerActService.workerAct({
    datetime1: Math.floor(form_data.value['datetime1'] / 1000),
    datetime2: Math.floor(form_data.value['datetime2'] / 1000),
    worker_id: form_data.value['worker_id'],
  }).then((res) => {
    console.log(res)
    reports.value = res.data;
  });
};




//top drawer start
import DocSalary from '../../kirim-docs/pay_to_worker/FormSalary.vue';
import PayWorker from '../../payments/pay-worker/FormPayWorker.vue';
import { CloseRound } from '@vicons/material'
const showTopDrawer = ref(false);
const drawerHeight = ref(0)
const chId = ref(null)
const ChdocType = ref(null)
const openTopDrawer = (data) => {
  showTopDrawer.value = true;
  chId.value = data.doc_id;
  ChdocType.value = data.doc_type;
  if(data.doc_type == 'order') {
    drawerHeight.value = 600
  } else if(data.doc_type == 'pay_to_worker') {
    drawerHeight.value = 300
  }
}


//top drawer end


</script>

<template>
  <!--top drawer start-->
  <n-drawer v-model:show="showTopDrawer" placement="top" :height="drawerHeight">
      <n-drawer-content title="Document">
        <DocSalary @close="showTopDrawer = false" v-if="ChdocType == 'doc_salary'" type="sverka" :id="chId"></DocSalary>
        <PayWorker v-else-if="ChdocType == 'pay_to_worker'" type="sverka" :id="chId"></PayWorker>
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
      v-model:value="form_data.worker_id"
      :options="workersSelect"
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
        <th>Ishchi</th>
        <th>Qarzi</th>
        <th>Haqqi</th>
      </tr>
      <tr>
        <td>Kun boshiga:</td>
       
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
          {{  dt.doc_id }}
          {{moment(dt.datetime * 1000).format("DD.MM.YYYY")}}
          {{ dt.doc_type == 'pay_to_worker' ? "Ishchiga to'lov": dt.doc_type == "doc_salary" ? "Ishchiga to'lov belgilash": dt.doc_type }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
              dt.qarzi
            )
          }}
        </td>
        <td>
          {{
            new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
              dt.haqqi
            )
          }}
        </td>
      </tr>
      <tr>
        <td>Oxirgi qarz</td>
        <td colspan="2" style="text-align: center;">
          {{
            new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
              reports.total.oxirgi
            )
          }}
        </td>
      </tr>
    </table>
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
