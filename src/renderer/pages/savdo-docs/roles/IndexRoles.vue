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
    >
    </n-data-table>
    <n-modal v-model:show="showCreate">
      <n-card
        style="width: 600px"
        title="Xuquq"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable
        @close="showCreate = false"
      >
        <FormRoles
          @create="createData"
          type="create"
          @close="showCreate = false"
        ></FormRoles>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showUpdate">
      <n-card
        style="width: 600px"
        title="Xuquq"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable
        @close="showUpdate = false"
      >
        <FormRoles
          @update="updateData"
          :id="updateId"
          type="update"
          @close="showUpdate = false"
        ></FormRoles>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import RoleService from "../../../services/role.service";
import { onMounted, ref, h } from "vue";
import { NButton, NIcon, useDialog, useMessage } from "naive-ui";
import { Pencil, Trash, Plus } from "@vicons/tabler";
import FormRoles from "./FormRoles.vue";

//table data start
const tableData = ref([]);
const updateId = ref(null);
const dialog = useDialog();
const message = useMessage();

const getAll = () => {
  RoleService.getAll().then((res) => {
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
                  RoleService.delete(row.id).then((res) => {
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

.top__item {
  display: flex;
  align-items: center;
  column-gap: 1rem;
}
</style>
