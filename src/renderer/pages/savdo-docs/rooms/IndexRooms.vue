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
        style="width: 600px"
        title="Xona qo'shish"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable
        @close="showCreate = false"
      >
        <FormRooms
          @create="createRooms"
          type="create"
          @close="showCreate = false"
        ></FormRooms>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showUpdate">
      <n-card
        style="width: 600px"
        title="Xona qo'shish"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        closable
        @close="showUpdate = false"
      >
        <FormRooms
          @update="updateRooms"
          :id="updateId"
          type="update"
          @close="showUpdate = false"
        ></FormRooms>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import RoomService from "../../../services/room.service";
import { onMounted, ref, h } from "vue";
import { NButton, NIcon, useDialog, useMessage } from "naive-ui";
import { Pencil, Trash, Plus } from "@vicons/tabler";
import FormRooms from "./FormRooms.vue";
const emits = defineEmits(["rowClick", "createRoom"]);

//table data start
const tableData = ref([]);
const dialog = useDialog();
const updateId = ref(null);
const message = useMessage();

const getAll = () => {
  RoomService.getAll().then((res) => {
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
                onPositiveClick: () => {
                  RoomService.delete(row.id).then((res) => {
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

const pagination = {
  pageSize: 7,
};

//table data end
//modal start
const showCreate = ref(false);
const showUpdate = ref(false);

const createRooms = (data) => {
  emits("createRoom", data);
  getAll();
  showCreate.value = false;
};

const updateRooms = () => {
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
}
</style>
