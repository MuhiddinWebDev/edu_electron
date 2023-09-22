<script setup lang="ts">
import { onMounted, reactive, ref, h } from 'vue';
import { NIcon, NButton, useMessage, useDialog } from 'naive-ui';
import type { DataTableColumns, DataTableCreateSummary } from 'naive-ui'
import moment from 'moment';
import { User } from '../../../types/index';
import axios from 'axios';
import { Pencil, Trash, Plus, ReportAnalytics } from "@vicons/tabler";
const message = useMessage()
const dialog = useDialog()
let resultData = ref([]);
const childData = ref([]);
const getAll = async () => {
    resultData.value = await (await axios.get('/employee-salary')).data    
}
const deleteOne = async (id: number) => {
    await axios.delete(`/employee-salary/id/${id}`)
    getAll()
}
onMounted(() => {
    getAll()
})

type mainRowData = {
  id: number
  datetime: number
}



const pagination = ref({
  pageSize: 7,
  page: 1,
  onChange: (page: number) => {
    pagination.value.page = page;
  },
});

const mainTableColumns: DataTableColumns<mainRowData> = [
    {
        title: "#",
        key: "no",
        width: 50,
        render: (_, index) => {
            return index + 1 + (pagination.value.page - 1) * pagination.value.pageSize;
        },
    },
    {
        title: 'Sana',
        key: 'datetime',
        render(rowData, rowIndex) {
            return moment(rowData.datetime).format("YYYY-MM-DD HH:mm:ss");
        },
    },
    {
    title: "Action",
    key: "actions",
    align: "center",
    width: 180,
    render(row) {
      return [
        h(
          NButton,
          {
            size: "small",
            type: "primary",
            style: {
              height: "35px",
            },
            onClick: () => {
                showUpdate.value = true;
                updateId.value = row.id;
            },
          },
          {
            icon: () =>
              h(NIcon, {
                component: Pencil,
              }),
          }
        ),
        h(
          NButton,
          {
            size: "small",
            type: "error",
            style: {
              height: "35px",
              marginLeft: "10px",
            },
            onClick: (e: any) => {
                e.stopPropagation();
                dialog.success({
                    title: "Ogohlantirish",
                    content: "O'chirilsinmi ?",
                    positiveText: "Ha",
                    negativeText: "Yo'q",
                    onPositiveClick: () => {
                        deleteOne(row.id)
                    },
                    onNegativeClick: () => {
                        message.info("O'chirilmadi");
                    },
              });
                console.log(e)
            },
          },
          {
            icon: () =>
              h(NIcon, {
                component: Trash,
              }),
          }
        ),
      ];
    },
  },
]
//form data
import Form from './FormEmpSalary.vue'
const showCreate = ref<boolean>(false)
const showUpdate = ref<boolean>(false)
const updateId = ref<number>(0);
const createEmp = () => {
    getAll()
    showCreate.value = false;
}
const updateEmp = () => {
    getAll()
    showUpdate.value = false;
}
//form data






</script>
<template>
    <div>
        <n-modal v-model:show="showCreate" preset="card" style="width: 1000px">
            <Form type="create" @close="showCreate = false" @create="createEmp"></Form>
        </n-modal>
        <n-modal v-model:show="showUpdate" preset="card" style="width: 1000px">
            <Form type="update" @close="showUpdate = false" :id="updateId" @update="updateEmp"></Form>
        </n-modal>
        <div class="header">
            <n-button type="info" @click="showCreate = true">
                <template #icon>
                <n-icon size="22">
                    <Plus />
                </n-icon>
                </template>
            </n-button>
            <n-input style="margin-left: 20px" placeholder="Qidirish" />
        </div>
        <div class="content">
            <n-data-table
                :bordered="false"
                :single-line="false"
                single-column
                :columns="mainTableColumns"
                :data="resultData"
                :pagination="pagination"
            />
        </div>
    </div>
</template>

<style scoped>
.content {
    display: flex;
    border: 1px solid black;
    min-height: calc(100vh - 130px);
    padding: 20px;
}
</style>