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
        :rowProps="rowProps"
      >
      </n-data-table>
      <n-data-table
        v-if="props.showChild"
        style="width: 600px"
        :columns="columns"
        :data="rightTData"
      />
    </div>
    <n-modal v-model:show="showCreate">
      <n-card
        style="width: 1000px; height: 100%"
        title="Taom qo'shish oynasi"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable
        @close="showCreate = false"
      >
        <FormFood
          @create="createData"
          type="create"
          @close="showCreate = false"
        ></FormFood>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showUpdate">
      <n-card
        style="width: 1000px; height: 100%"
        title="Taom qo'shish oynasi"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable
        @close="showUpdate = false"
      >
        <FormFood
          @update="updateData"
          :id="updateId"
          type="update"
          @close="showUpdate = false"
        ></FormFood>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import FoodService from "../../../services/food.service";
import { onMounted, ref, h } from "vue";
import { NButton, NIcon, useDialog, useMessage } from "naive-ui";
import { Pencil, Trash, Plus, ReportAnalytics } from "@vicons/tabler";
import FormFood from "./FormFood.vue";
const props = defineProps({
  showChild: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits(["rowClick", "createPrinter"]);

//table data start
const tableData = ref([]);
const updateId = ref(null);
const rightTData = ref([]);
const dialog = useDialog();
const message = useMessage();

const getAll = () => {
  FoodService.getAll().then((res) => {
    tableData.value = res;
  });
};

onMounted(() => {
  getAll();
});

const pagination = ref({
  pageSize: 7,
  page: 1,
  onChange: (page) => {
    pagination.value.page = page;
  },
});

const tableColumns = [
  {
    title: "#",
    key: "no",
    width: 50,
    render: (_, index) => {
      return index + 1 + (pagination.value.page - 1) * pagination.value.pageSize;
    },
  },
  {
    title: "Name",
    key: "name",
    defaultSortOrder: "ascend",
    sorter: "default",
    filter(value, row) {
      return ~row.name.toLowerCase().indexOf(value.toLowerCase());
    },
  },
  {
    title: "Narxi",
    key: "sell_price",
    defaultSortOrder: "ascend",
    sorter: "default",
    filter(value, row) {
      return ~row.name.toLowerCase().indexOf(value.toLowerCase());
    },
    render: (_) => {
      return _.sell_price.toLocaleString("eng-US").replaceAll(',', ' ')
    }
  },
  {
    title: "O'lchov birligi",
    key: "measure.name",
    defaultSortOrder: "ascend",
    sorter: "default",
    filter(value, row) {
      return ~row.name.toLowerCase().indexOf(value.toLowerCase());
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
            type: "success",
            style: {
              height: "35px",
              marginRight: "10px",
            },
            onClick: (e) => {
              e.stopPropagation();
              FoodService.getOne(row.id).then((res) => {
                rightTData.value.length = 0;
                rightTData.value = res.food_tables;
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
                  FoodService.delete(row.id).then((res) => {
                    getAll();
                    message.success("Muvaffaqiyatli o'chirildi");
                    const index = data.value.findIndex(
                      (val) => val.id == res.id
                    );

                    data.value.splice(index, 1);
                    rightTData.value = [];
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
  },
  {
    title: "Miqdori",
    key: "amount",
    render: (_) => {
      return _.amount.toLocaleString("eng-US").replaceAll(',', ' ')
    }
  },
];

//table data end
//modal start
const showCreate = ref(false);
const showUpdate = ref(false);

const createData = (data) => {
  emits("createFood", data);
  getAll();
  showCreate.value = false;
};

const updateData = () => {
  getAll();
  showUpdate.value = false;
};

const rowProps = (row) => {
  return {
    style: "cursor: pointer",
    onClick: () => {
      emits("rowClick", row);
    },
  };
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
