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
      <n-input placeholder="Qidirish" @input="searchCaisher" />
    </div>
    <n-data-table
      :columns="tableColumns"
      :data="tableData"
      :pagination="pagination"
    >
    </n-data-table>

    <n-modal v-model:show="showCreate">
      <n-card
        style="width: 500px"
        title="Kassirlar"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable
        @close="showCreate = false"
      >
        <Formcaishers
          @create="createcaishers"
          type="create"
          @close="showCreate = false"
        >
        </Formcaishers>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showUpdate">
      <n-card
        style="width: 500px"
        title="O'chov birligi"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable
        @close="showUpdate = false"
      >
        <Formcaishers
          @update="updatecaishers"
          :id="updateId"
          type="update"
          @close="showUpdate = false"
        >
        </Formcaishers>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import caishersService from "../../../services/caisher.service.js";
import { onMounted, ref, h } from "vue";
import { NButton, useDialog, useMessage, NIcon, NInput } from "naive-ui";
import { Pencil, Trash, Plus } from "@vicons/tabler";
import Formcaishers from "./FormCaishers.vue";

//table data start
const tableData = ref([]);
const updateId = ref(null);

const dialog = useDialog();
const message = useMessage();

const getAll = () => {
  caishersService.getAll().then((res) => {
    tableData.value = res;
  });
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
    key: "username",
    defaultSortOrder: "ascend",
    sorter: "default",
    filter(value, row) {
      return ~row.name.toLowerCase().indexOf(value.toLowerCase());
    },
  },
  {
    title: "FIO",
    key: "full_name",
    defaultSortOrder: "ascend",
    sorter: "default",
    filter(value, row) {
      return ~row.name.toLowerCase().indexOf(value.toLowerCase());
    },
  },
  {
    title: "Email",
    key: "email",
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
                  caishersService.delete(row.id).then((res) => {
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

const pagination = {
  pageSize: 7,
};

//table data end
//modal start
const showCreate = ref(false);
const showUpdate = ref(false);

const createcaishers = () => {
  getAll();
  showCreate.value = false;
};

const updatecaishers = () => {
  getAll();
  showUpdate.value = false;
};

//modal end
const searchCaisher = (e) => {
  caishersService.value.filter({
    username: [e],
  });
};
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
