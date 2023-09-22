<template>
  <div class="main">
    <div class="top__item">
      <n-button type="info" @click="showCreate = true">
        <template #icon>
          <n-icon size="22">
            <Plus />
          </n-icon>
        </template>
      </n-button>
      <n-input placeholder="Qidirish" />
    </div>
    <div class="tables" style="margin-top: 10px">
      <n-data-table
        class="first-table"
        :columns="tableColumns"
        :data="tableData"
        :pagination="pagination"
      >
      </n-data-table>
      <n-data-table
        style="width: 600px"
        :columns="columns"
        :data="rightTData"
      />
    </div>
    <n-modal v-model:show="showCreate">
      <n-card
        style="width: 1300px; height: 100%"
        title="Kirim qilish oynasi"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable
        @close="showCreate = false"
      >
        <FormKirim
          @create="createData"
          type="create"
          @close="showCreate = false"
        ></FormKirim>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showUpdate">
      <n-card
        style="width: 1100px; height: 100%"
        title="Kirim qilish oynasi"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable
        @close="showUpdate = false"
      >
        <FormKirim
          @update="updateData"
          :id="updateId"
          type="update"
          @close="showUpdate = false"
        ></FormKirim>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import DebitService from "../../../services/doc_debit.service";
import { onMounted, ref, h } from "vue";
import moment from "moment";
import { NButton, NIcon, useDialog, useMessage } from "naive-ui";
import { Pencil, Trash, Plus, ReportAnalytics } from "@vicons/tabler";
import FormKirim from "./FormKirim.vue";

//table data start
const tableData = ref([]);
const updateId = ref(null);
const rightTData = ref([]);
const dialog = useDialog();
const message = useMessage();

const getAll = () => {
  DebitService.getAll().then((res) => {
    tableData.value = res;
  });
};

onMounted(() => {
  getAll();
});

const pagination = {
  pageSize: 7,
};

const tableColumns = [
  {
    title: "#",
    key: "no",
    width: 50,
    resizable: true,
    render: (_, index) => {
      return index + 1;
    },
  },
  {
    title: "Yuk beruvchi",
    key: "supplier.name",
    defaultSortOrder: "ascend",
    sorter: "default",
    resizable: true,
    filter(value, row) {
      return ~row.name.toLowerCase().indexOf(value.toLowerCase());
    },
  },
  {
    title: "Sana",
    key: "datetime",
    resizable: true,
    render: (_, index) => {
      return moment(_.datetime * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    title: "Umumiy summa",
    key: "total_sum",
    resizable: true,
    defaultSortOrder: "ascend",
    sorter: "default",
    filter(value, row) {
      return ~row.name.toLowerCase().indexOf(value.toLowerCase());
    },
    render: (_) => {
      return _.total_sum.toLocaleString("eng-US").replaceAll(',', ' ')
    }
  },
  {
    title: "Action",
    key: "actions",
    resizable: true,
    align: "center",
    width: 180,
    render(row) {
      return [
        h(
          NButton,
          {
            size: "small",
            type: "success",
            style: {
              height: "35px",
              marginRight: "10px",
            },
            onClick: (e) => {
              DebitService.getOne(row.id).then((res) => {
                rightTData.value.length = 0;
                rightTData.value = res.doc_debit_table;
              });
            },
          },
          {
            icon: () =>
              h(NIcon, {
                component: ReportAnalytics,
              }),
          }
        ),
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
            onClick: (e) => {
              dialog.success({
                title: "Ogohlantirish",
                content: "O'chirilsinmi ?",
                positiveText: "Ha",
                negativeText: "Yo'q",
                onPositiveClick: () => {
                  DebitService.delete(row.id).then((res) => {
                    getAll();
                    message.success("Muvaffaqiyatli o'chirildi");
                    const index = tableData.value.findIndex(
                      (val) => val.id == res.id
                    );
                    tableData.value.splice(index, 1);
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

const columns = [
  {
    title: "Mahsulot",
    key: "food_resource.name",
    resizable: true,
  },
  {
    title: "Miqdori",
    key: "amount",
    resizable: true,
    render: (_) => {
      return _.amount.toLocaleString("eng-US").replaceAll(',', ' ')
    }
  },
  {
    title: "Narxi",
    key: "price",
    resizable: true,
    render: (_) => {
      return _.price.toLocaleString("eng-US").replaceAll(',', ' ')
    }
  },
  {
    title: "Summa",
    key: "sum",
    resizable: true, 
    render: (_) => {
      return _.sum.toLocaleString("eng-US").replaceAll(',', ' ')
    }
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

<style scoped>
.main {
  padding: 0 1rem;
}

.tables {
  display: flex;
  justify-content: space-between;
  column-gap: 20px;
}
.top__item {
  display: flex;
  align-items: center;
  column-gap: 1rem;
}
</style>
