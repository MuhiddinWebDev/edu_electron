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
    </div>
    <n-modal v-model:show="showCreate">
      <n-card
        style="width: 700px; height: 100%"
        title="Ishchiga to'lov"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable
        @close="showCreate = false"
      >
        <FormPay
          @create="createData"
          type="create"
          @close="showCreate = false"
        ></FormPay>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showUpdate">
      <n-card
        style="width: 700px; height: 100%"
        title="Ishchiga to'lov"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable
        @close="showUpdate = false"
      >
        <FormPay
          @update="updateData"
          :id="updateId"
          type="update"
          @close="showUpdate = false"
        ></FormPay>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import SalaryService from "../../../services/doc_salary.service";
import { onMounted, ref, h } from "vue";
import moment from "moment";
import { NButton, NIcon, useDialog, useMessage, NInput } from "naive-ui";
import { Pencil, Trash, Plus } from "@vicons/tabler";
import FormPay from "./FormSalary.vue";

//table data start
const tableData = ref([]);
const updateId = ref(null);
const dialog = useDialog();
const message = useMessage();

const getAll = () => {
  SalaryService.getAll().then((res) => {
    tableData.value = res;
  });
};

onMounted(() => {
  getAll();
});

const pagination = {
  pageSize: 10,
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
    title: "Sana",
    key: "created_at",
    defaultSortOrder: "ascend",
    sorter: "default",
    render: (_, index) => {
      return moment(_.created_at * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    title: "Action",
    key: "actions",
    align: "center",
    width: 120,
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
                  SalaryService.delete(row.id).then((res) => {
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
