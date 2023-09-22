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
    <n-data-table
      :columns="tableColumns"
      :data="tableData"
      style="margin-top: 10px"
      :pagination="pagination"
      :rowProps="rowProps"
    >
    </n-data-table>

    <n-modal v-model:show="showCreate">
      <n-card
        style="width: 500px"
        title="Taminotchi"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable
        @close="showCreate = false"
      >
        <FormSuppliers
          @create="createSupplier"
          type="create"
          @close="showCreate = false"
        ></FormSuppliers>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showUpdate">
      <n-card
        style="width: 500px"
        title="Suppliers"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable
        @close="showUpdate = false"
      >
        <FormSuppliers
          @update="updateSuppliers"
          :id="updateId"
          type="update"
          @close="showUpdate = false"
        >
        </FormSuppliers>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import SuppliersService from "../../../services/taminotchilar.service.js";
import { onMounted, ref, h } from "vue";
import { NButton, useDialog, useMessage, NIcon, NInput } from "naive-ui";
import { Pencil, Trash, Plus } from "@vicons/tabler";
import FormSuppliers from "./FormSuppliers.vue";
const emits = defineEmits(["rowClick", "createSupplier"]);

//table data start
const tableData = ref([]);
const updateId = ref(null);

const dialog = useDialog();
const message = useMessage();

const getAll = () => {
  SuppliersService.getAll().then((res) => {
    tableData.value = res;
  });
};

const pagination = {
  pageSize: 7,
};

onMounted(() => {
  getAll();
});

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
    key: "name",
    defaultSortOrder: "ascend",
    sorter: "default",
    filter(value, row) {
      return ~row.name.toLowerCase().indexOf(value.toLowerCase());
    },
  },
  {
    title: "Tel",
    key: "tel",
    defaultSortOrder: "ascend",
    sorter: "default",
    filter(value, row) {
      return ~row.name.toLowerCase().indexOf(value.toLowerCase());
    },
  },
  {
    title: "Izoh",
    key: "comment",
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
    width: 170,
    render(row) {
      return [
        h(
          NButton,
          {
            size: "small",
            type: "primary",
            style: {
              height: "35px",
              marginLeft: "10px",
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
                  SuppliersService.delete(row.id).then((res) => {
                    message.success("Muvaffaqiyatli o'chirildi");
                    getAll();
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

//table data end
//modal start
const showCreate = ref(false);
const showUpdate = ref(false);

const createSupplier = (data) => {
  emits("createSupplier", data);
  getAll();
  showCreate.value = false;
};

const updateSuppliers = () => {
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

.top__item {
  display: flex;
  align-items: center;
  column-gap: 1rem;
  margin-bottom: 10px;
}
</style>
