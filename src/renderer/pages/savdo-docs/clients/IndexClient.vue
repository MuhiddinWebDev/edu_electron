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
      style="margin-top: 10px; padding: 0 1rem"
      :pagination="pagination"
      :rowProps="rowProps"
    >
    </n-data-table>
    <n-modal v-model:show="showCreate">
      <n-card
        style="width: 600px"
        title="Mijoz"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable
        @close="showCreate = false"
      >
        <FormClient
          @create="createClient"
          type="create"
          @close="showCreate = false"
        ></FormClient>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showUpdate">
      <n-card
        style="width: 600px"
        title="Mijoz"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable
        @close="showUpdate = false"
      >
        <FormClient
          @update="updateClient"
          :id="updateId"
          type="update"
          @close="showUpdate = false"
        ></FormClient>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import ClientService from "../../../services/client.service";
import { onMounted, ref, h } from "vue";
import { NButton, NIcon, useDialog, useMessage } from "naive-ui";
import { Pencil, Trash, Plus } from "@vicons/tabler";
import FormClient from "./FormClient.vue";
const emits = defineEmits(["rowClick", "createClient"]);

// table data start
const tableData = ref([]);
const updateId = ref(null);
const dialog = useDialog();
const message = useMessage();

const getAll = () => {
  ClientService.getAll().then((res) => {
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
    title: "Name",
    key: "name",
    defaultSortOrder: "ascend",
    sorter: "default",
    filter(value, row) {
      return ~row.name.toLowerCase().indexOf(value.toLowerCase());
    },
  },
  {
    title: "Address",
    key: "address",
    defaultSortOrder: "ascend",
    sorter: "default",
    filter(value, row) {
      return ~row.address.toLowerCase().indexOf(value.toLowerCase());
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
                  ClientService.delete(row.id).then((res) => {
                    getAll();
                    message.success("Muvaffaqiyatli o'chirildi");
                    const index = data.value.findIndex(
                      (val) => val.id == res.id
                    );
                    data.value.splice(index, 1);
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

const createClient = (data) => {
  emits("createClient", data);
  getAll();
  showCreate.value = false;
};

const updateClient = () => {
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
.top__item {
  display: flex;
  padding: 0 1rem;
  align-items: center;
  column-gap: 1rem;
}
</style>
