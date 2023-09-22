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
      :rowProps="rowProps"
    >
    </n-data-table>
    <n-modal v-model:show="showCreate">
      <n-card
        style="width: 600px"
        title="Taom tarqatish bo'limi"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable
        @close="showCreate = false"
      >
        <FormBranch
          @create="createData"
          type="create"
          @close="showCreate = false"
        ></FormBranch>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showUpdate">
      <n-card
        style="width: 600px"
        title="Taom tarqatish bo'limi"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable
        @close="showUpdate = false"
      >
        <FormBranch
          @update="updateData"
          :id="updateId"
          type="update"
          @close="showUpdate = false"
        ></FormBranch>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import BranchService from "../../../services/branch.service";
import { onMounted, ref, h } from "vue";
import { NButton, NIcon, useDialog, useMessage } from "naive-ui";
import { Pencil, Trash, Plus } from "@vicons/tabler";
import FormBranch from "./FormBranch.vue";
const emits = defineEmits(["rowClick", "createBranch"]);

//table data start
const tableData = ref([]);
const updateId = ref(null);

const dialog = useDialog();
const message = useMessage();

const getAll = () => {
  BranchService.getAll().then((res) => {
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
                onPositiveClick: (e) => {
                  BranchService.delete(row.id).then((res) => {
                    getAll();
                    message.success("Muvaffaqiyatli o'chirildi");
                    const index = data.value.findIndex(
                      (val) => val.id == res.id
                    );
                    data.value.splice(index, 1);
                  });
                },
                onNegativeClick: (e) => {
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

const createData = (data) => {
  emits("createBranch", data);
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
.top__element {
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 1rem;
}
</style>
