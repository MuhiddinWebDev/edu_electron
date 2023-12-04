<script setup>
import { h, ref, onMounted, watch, reactive, inject } from "vue";
import { useMagicKeys } from "@vueuse/core";
////// API service
import ModelService from "../../../services/rasxod.service";
import BranchService from "../../../services/branch.service";
import PayTypeService from "../../../services/payType.service";
////// API service

import { NButton, NIcon, useMessage, useDialog } from "naive-ui";
import { Add20Filled as AddIcon } from "@vicons/fluent";
import { Pen as PenICon } from "@vicons/carbon";
import { useReportData } from "../../../stores/report";

import ModelForm from "./Form.vue";

const reportAct = useReportData();

const dayJS = inject("dayJS");
const showCreate = ref(false);
const showUpdate = ref(false);
const loading = ref(true);
const updateId = ref(null);

const payTypeOptions = ref([]);
const branchOptions = ref([])
const data = ref([]);

const findRole = ref(localStorage.getItem("role"));
const findBranch = ref(JSON.parse(localStorage.getItem("filial_id")));

const filterItem = ref({
  filial_id: findRole.value == "SuperAdmin" ? null : findBranch.value,
  pay_type_id: null
})

const getAllData = () => {
  loading.value = true;
  ModelService.searchModel(filterItem.value).then((res) => {
    loading.value = false;
    data.value = res;
  }).catch((err)=>{
    loading.value = false;
  });
};

const getAllBranches = ()=>{
  BranchService.getAll().then((res)=>{
    branchOptions.value = res
  })
}

const getAllPayType = ()=>{
  PayTypeService.getAll().then((res)=>{
    payTypeOptions.value = res;
  })
}


const columns = ref([
  {
    title: "№",
    key: "id",
    width: 50,
    align:'center'
  },
  {
    title: "Sana",
    key: "datetime",
    resizable: true,
    width: 200,
    render(row) {
      return dayJS(row.datetime * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    title: "Masul shaxs",
    key: "user.fullname",
    resizable: true,
  },
  {
    title: "To'lov turi",
    key: "pay_type.name",
    resizable: true,
  },
  {
    title: "Summa",
    key: "summa",
    resizable: true,
    align: "right",
    render(row) {
      return new Intl.NumberFormat("ru-RU", {
        style: "decimal",
      }).format(row.summa);
    },
  },
  {
    title: "Izoh",
    key: "text",
    resizable: true,
  },
  {
    title: "Filial",
    key: "filial.name",
    resizable: true,
  },
  {
    title: "Amallar",
    key: "action",
    width: 75,
    render(row) {
      return [
        h(
          NButton,
          {
            size: "small",
            type: "success",
            block: true,
            onClick: (e) => {
              showUpdate.value = true;
              updateId.value = row.id;
            },
          },
          {
            icon: () =>
              h(NIcon, {
                component: PenICon,
              }),
          }
        ),
        // h(
        //   NButton,
        //   {
        //     size: "small",
        //     type: "error",
        //     style: {
        //       marginLeft: "8px",
        //     },
        //     onClick: (e) => {
        //       dialog.warning({
        //         title: "Ogohlantirish",
        //         content: ` Rostan ham o'chirasizmi`,
        //         positiveText: "Xa",
        //         negativeText: "Yo'q",
        //         onPositiveClick: () => {
        //           ModelService.delete(row.id)
        //             .then((res) => {
        //               const index = data.value.findIndex(
        //                 (val) => val.id == row.id
        //               );
        //               data.value.splice(index, 1);
        //               message.success("Ma'lumot o'chirildi");
        //             })
        //             .catch((err) => {
        //               message.error("Ma'lumot o'chirilmadi");
        //             });
        //         },
        //         onNegativeClick: () => {
        //           message.error("Ma'lumot o'chirilmadi");
        //         },
        //       });
        //     },
        //   },
        //   {
        //     icon: () =>
        //       h(NIcon, {
        //         component: TrashIcon,
        //       }),
        //   }
        // ),
      ];
    },
  },
]);

onMounted(() => {
  getAllData();
  getAllBranches();
  getAllPayType();
});


const clearFilter = ()=>{
  filterItem.value.filial_id = null;
  filterItem.value.pay_type_id = null;
  getAllData();
}

const UpdateBranch = (id)=>{
  filterItem.value.filial_id = id;
  getAllData();
}
const UpdatePayType = (id)=>{
  filterItem.value.pay_type_id = id;
  getAllData()
}
///  create and update functions
const createModel = () => {
  showClose()
  getAllData();
};
const showClose = () => {
  showCreate.value = false;
  showUpdate.value = false;
  reportAct.rasxodPass.read = false;
};

const updateModel = () => {
  showClose()
  getAllData();
};
///// window key event start
const { NumpadAdd /* keys you want to monitor */ } = useMagicKeys();
watch(NumpadAdd, (v) => {
  if (v) showCreate.value = true;
});
//// window key event end

///// pagination start
const pagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 15, 20],
  onChange: (page) => {
    pagination.page = page;
  },
  onUpdatePageSize: (pageSize) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
  },
});
///// pagination end
</script>
<template>
  <div class="box">
    <div class="box-wrapper">
      <div class="box-header">
        <div class="box-header_item">
          <h2>Xarajatlar</h2>
        </div>
        <div class="box-header_item">
          <n-button @click="showCreate = true" type="success">
            <template #icon>
              <n-icon size="18">
                <AddIcon />
              </n-icon>
            </template>
            Qo'shish
          </n-button>
        </div>
      </div>
      <div class="search-action">
        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>Filial</n-input-group-label>
            <n-select
              :options="branchOptions"
              v-model:value="filterItem.filial_id"
              @update:value="UpdateBranch"
              label-field="name"
              value-field="id"
              placeholder="Qidiruv"
              filterable
              clearable
            ></n-select>
          </n-input-group>
        </div>
        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>To'lov turi</n-input-group-label>
            <n-select
              :options="payTypeOptions"
              v-model:value="filterItem.pay_type_id"
              @update:value="UpdatePayType"
              label-field="name"
              value-field="id"
              placeholder="Qidiruv"
              filterable
              clearable
            ></n-select>
          </n-input-group>
        </div>
      
        <div class="search-action_item">
          <n-button @click="clearFilter" type="info">Tozalash</n-button>
        </div>
      </div>
    </div>
    <div class="box-table">
      <n-data-table
        :loading="loading"
        :columns="columns"
        :pagination="pagination"
        :data="data"
        :bordered="true"
        :single-line="false"
        size="small"
        style="min-width: 1000px; max-height: calc(100vh - 300px)"
      >
      </n-data-table>
    </div>
  </div>
  <!-- Modal create and Update -->
  <section>
    <n-modal v-model:show="showCreate" :mask-closable="false">
      <n-card
        style="width: calc(100vw - 35px);height: calc(100vh - 10px)"
        title="Xarajat qo'shish"
        :bordered="false"
        size="medium"
        role="dialog"
        aria-modal="true"
        closable
        @close="showClose()"
      >
        <ModelForm @close="showClose" @create="createModel" type="create" />
      </n-card>
    </n-modal>
    <n-modal v-model:show="showUpdate" :mask-closable="false">
      <n-card
        style="width: calc(100vw - 15px); height: calc(100vh - 10px)"
        title="Xarajatni o'zgartirish "
        :bordered="false"
        size="medium"
        role="dialog"
        aria-modal="true"
        closable
        @close="showClose('update')"
      >
        <ModelForm
          @close="showClose"
          type="update"
          :id="updateId"
          @update="updateModel"
        />
      </n-card>
    </n-modal>

    <n-modal v-model:show="reportAct.rasxodPass.read" :mask-closable="false">
      <n-card
        style="width: calc(100vw - 15px); height: calc(100vh - 10px)"
        :title="'№' + reportAct.rasxodPass.id + ' Xarajat'"
        :bordered="false"
        role="dialog"
        aria-modal="true"
        closable
        @close="showClose"
      >
        <ModelForm type="read" :id="reportAct.rasxodPass.id" />
      </n-card>
    </n-modal>
  </section>
  <!-- create more  -->
</template>
