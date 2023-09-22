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
        style="width: 1200px; height: 100%"
        title="Savdo xujjati"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable
        @close="showCreate = false"
      >
        <FormOrders
          @create="createData"
          type="create"
          @close="showCreate = false"
        ></FormOrders>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showUpdate">
      <n-card
        style="width: 1200px; height: 100%"
        title="Savdo xujjati"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable
        @close="showUpdate = false"
      >
        <FormOrders
          @update="updateData"
          :id="updateId"
          type="update"
          @close="showUpdate = false"
        ></FormOrders>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import OrderService from "../../../services/order.service";
import { onMounted, ref, h } from "vue";
import { NButton, NIcon, useDialog, useMessage } from "naive-ui";
import { Pencil, Trash, Plus, ReportAnalytics } from "@vicons/tabler";
import FormOrders from "./FormOrders.vue";

//table data start
const rightTData = ref([]);
const tableData = ref([]);
const dialog = useDialog();
const message = useMessage();
const updateId = ref(null);

const getAll = () => {
  OrderService.getAllCompletes().then((res) => {
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
    render: (_, index) => {
      return index + 1;
    },
  },
  {
    title: "Afitsant",
    key: "waiter.full_name",
    defaultSortOrder: "ascend",
    sorter: "default",
    filter(value, row) {
      return ~row.name.toLowerCase().indexOf(value.toLowerCase());
    },
  },
  {
    title: "Stol",
    key: "table.name",
    defaultSortOrder: "ascend",
    sorter: "default",
    filter(value, row) {
      return ~row.name.toLowerCase().indexOf(value.toLowerCase());
    },
  },
  {
    title: "Jami summa",
    key: "all_sum",
    defaultSortOrder: "ascend",
    sorter: "default",
    filter(value, row) {
      return ~row.name.toLowerCase().indexOf(value.toLowerCase());
    },
    render: (_) => {
      return _.all_sum.toLocaleString("eng-US").replaceAll(',', ' ')
    }
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
            type: "success",
            style: {
              height: "35px",
              marginRight: "10px",
            },
            onClick: (e) => {
              OrderService.getComplete(row.id).then((res) => {
                rightTData.value.length = 0;
                rightTData.value = res.order_food;
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
                  OrderService.delete(row.id).then((res) => {
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
    key: "food.name",
  },
  {
    title: "Miqdori",
    key: "amount",
    render: (_) => {
      return _.amount.toLocaleString("eng-US").replaceAll(',', ' ')
    }
  },
  {
    title: "Narxi",
    key: "food.sell_price",
    render: (_) => {
      return _.food.sell_price.toLocaleString("eng-US").replaceAll(',', ' ')
    }
  },
  {
    title: "Summa",
    key: "sum",
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
