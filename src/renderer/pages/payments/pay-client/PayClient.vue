<script setup>
import PayClientService from "../../../services/pay-client.service";
import moment from "moment";
import { onMounted, ref, h } from "vue";
import { NButton, NIcon, useDialog, useMessage } from "naive-ui";
import { Pencil, Trash, Plus } from "@vicons/tabler";
import Form from "./PayClaintForm.vue";

//table data start
const tableData = ref([]);
const updateId = ref(null);
const message = useMessage();
const dialog = useDialog();

const getAll = () => {
  PayClientService.getAll().then((res) => {
    tableData.value = res;
  });
};

const getDate = (date) => {
  return moment(new Date(date)).format("YYYY-MM-DD HH:mm:ss");
};

onMounted(() => {
  getAll();
});

const pagination = {
  pageSize: 5,
};

const tableColumns = [
  {
    title: "#",
    key: "no",
    width: 50,
    render: (_, index) => {
      return index + 1;
    },
  },
  {
    title: "Name",
    key: "client.name",
    defaultSortOrder: "ascend",
    sorter: "default",
    filter(value, row) {
      return ~row.client.name.toLowerCase().indexOf(value.toLowerCase());
    },
  },
  {
    title: "Summa",
    key: "summa",
    defaultSortOrder: "ascend",
    sorter: "default",
    filter(value, row) {
      return ~row.name.toLowerCase().indexOf(value.toLowerCase());
    },
    render: (_) => {
      return _.summa.toLocaleString("eng-US").replaceAll(',', ' ')
    }
  },
  {
    title: "Qoldiq",
    key: "ost",
    defaultSortOrder: "ascend",
    sorter: "default",
    filter(value, row) {
      return ~row.name.toLowerCase().indexOf(value.toLowerCase());
    },
    render: (_) => {
      return _.ost.toLocaleString("eng-US").replaceAll(',', ' ')
    }
  },
  {
    title: "Sana",
    key: "datetime",
    render: (_, index) => {
      return moment(_.datetime * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    title: "Action",
    key: "actions",
    align: "center",
    width: 150,
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
            onClick: (e) => {
              e.stopPropagation();
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
            onClick: (e) => {
              e.stopPropagation();
              dialog.success({
                title: "Ogohlantirish",
                content: "O'chirilsinmi ?",
                positiveText: "Ha",
                negativeText: "Yo'q",
                onPositiveClick: () => {
                  PayClientService.delete(row.id).then((res) => {
                    getAll();
                    message.success("Muvaffaqiyatli o'chirildi")
                  });
                },
                onNegativeClick: () => {
                  message.info("O'chirilmadi");
                },
              });
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
];

//table data end
//modal start
const showCreate = ref(false);
const showUpdate = ref(false);

const createData = () => {
  getAll();
  showCreate.value = false;
};

const updateData = () => {
  getAll();
  showUpdate.value = false;
};

//modal end
</script>
<template>
    <div class="main">
      <div class="top__element">
        <n-button type="info" @click="showCreate = true">
          <template #icon>
            <n-icon size="22">
              <Plus />
            </n-icon>
          </template>
        </n-button>
        <n-input placeholder="Qidirish" />
      </div>
      <n-data-table
        :columns="tableColumns"
        :data="tableData"
        style="margin-top: 10px"
        :pagination="pagination"
      >
      </n-data-table>
      <n-modal v-model:show="showCreate">
        <n-card
          style="width: 800px"
          title="Klientga to'lov"
          :bordered="false"
          size="huge"
          role="dialog"
          aria-modal="true"
          closable
          @close="showCreate = false"
        >
          <Form
            @create="createData"
            type="create"
            @close="showCreate = false"
          ></Form>
        </n-card>
      </n-modal>
      <n-modal v-model:show="showUpdate">
        <n-card
          style="width: 800px"
          title="Klientga to'lov"
          :bordered="false"
          size="huge"
          role="dialog"
          aria-modal="true"
          closable
          @close="showUpdate = false"
        >
          <Form
            @update="updateData"
            :id="updateId"
            type="update"
            @close="showUpdate = false"
          ></Form>
        </n-card>
      </n-modal>
    </div>
  </template>
  
  <style scoped>
  .main {
    padding: 0 1rem;
  }
  .top__element {
    display: flex;
    align-items: center;
    justify-content: space-between;
    column-gap: 1rem;
  }
  </style>
  