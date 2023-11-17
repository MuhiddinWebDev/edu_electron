<script setup>
import { ref, onMounted, watch, reactive, h } from "vue";
import ModelService from "../../../services/draft.service";
import BranchService from "../../../services/branch.service";

import { useMagicKeys } from "@vueuse/core";
import { useMessage, useDialog, NButton, NIcon } from "naive-ui";

import ModelForm from "./Form.vue";
import ModelRead from "./Read.vue";
import {
  Add20Filled as AddIcon,
} from "@vicons/fluent";
import {
  RemoveRedEyeRound as EyeIcon,
  CleaningServicesFilled as CleanIcon,
} from "@vicons/material";
import { TrashCan as TrashIcon, Pen as PenICon } from "@vicons/carbon";

const emits = defineEmits(["select"]);
const props = defineProps(["type", "action", "itemValue",'branch_id']);

const message = useMessage();
const dialog = useDialog();

const showCreate = ref(false);
const showUpdate = ref(false);
const showRead = ref(false);
const readId = ref(null)
const updateId = ref(null);

const data = ref([]);
const draftName = ref("");
const branchOption = ref([]);
const loading = ref(true);

const branchId = ref(null);

const findRole = ref(localStorage.getItem("role"));
const findBranch = ref(JSON.parse(localStorage.getItem("filial_id")));

const columns = ref([
  {
    title: "№",
    key: "index",
    width: 50,
    align:'center',
    render(row) {
      return data.value.findIndex((item) => item.id == row.id) + 1;
    },
  },

  {
    title: "Nomi",
    key: "name",
    resizable: true,
    render(row){
      return  row.name.length > 80 ? row.name.slice(0, 80) + '...': row.name;
    }
  },
  {
    title: "Filial",
    key: "branch.name",
    resizable: true,
    sortOrder: true,
    sorter: (row1, row2) => row1.branch.id - row2.branch.id,
  },
  {
    title: "Amallar",
    key: "action",
    width: 150,
    render(row) {
      return [
      h(
          NButton,
          {
            size: "small",
            type: "info",
            onClick: (e) => {
              showRead.value = true;
              readId.value = row.id;
            },
            style:{
              marginRight:'12px'
            }
          },
          {
            icon: () =>
              h(NIcon, {
                component: EyeIcon,
              }),
          }
        ),
        h(
          NButton,
          {
            size: "small",
            type: "success",
            onClick: (e) => {
              showUpdate.value = true;
              updateId.value = row.id;
            },
          },
          {
            icon: () =>
              h(NIcon, {
                component: PenICon,
              }),
          }
        ),
        h(
          NButton,
          {
            size: "small",
            type: "error",
            style: {
              marginLeft: "8px",
            },
            onClick: (e) => {
              dialog.warning({
                title: "Ogohlantirish",
                content: `Rostan ham o'chirasizmi`,
                positiveText: "Xa",
                negativeText: "Yo'q",
                onPositiveClick: () => {
                  ModelService.delete(row.id)
                    .then((res) => {
                      const index = data.value.findIndex((val) => val.id == row.id);
                      data.value.splice(index, 1);
                    })
                    .catch((err) => {
                      message.error("Ma'lumot o'chirilmadi");
                    });
                },
                onNegativeClick: () => {
                  message.warning("Bekor qilindi");
                },
              });
            },
          },
          {
            icon: () =>
              h(NIcon, {
                component: TrashIcon,
              }),
          }
        ),
      ];
    },
  },
]);

const searchData = (branch_id)=>{
  return {
    filial_id: findRole.value == 'SuperAdmin' ? branch_id : findBranch.value,
  }
}

const getAllData = (branch_id) => {
  ModelService.getAll(searchData(branch_id)).then((res) => {
    loading.value = false;
    data.value = res;
  });
};
const getAllBranches = () => {
  BranchService.getAll().then((res) => {
    branchOption.value = res;
  });
};



onMounted(() => {
  if (props.action) {
    showCreate.value = true;
    draftName.value = props.itemValue;
  }
  getAllData(props.branch_id);
  getAllBranches();
});

/////  create and update functions
const createModel = () => {
  showCreate.value = false;
  message.success("Ma'lumot qo'shildi");
  getAllData();
};
const showClose = (e) => {
  if (e == "create") {
    showCreate.value = false;
  } else if (e == "update") {
    showUpdate.value = false;
  }else if(e == 'read'){
    showRead.value = false;
  }
};

const updateModel = () => {
  showUpdate.value = false;
  getAllData()
};

//// selected rooms
const rowProps = (row) => {
  return {
    style: "cursor: pointer;",
    onClick: () => {
      if(!showUpdate.value){
        emits("select", row.id);
      }
    },
  };
};
//// search function start;
const UpdateBranch = (branch_id) => {
  getAllData(branch_id);
};

const clearBtn = () => {
  branchId.value = null;
  getAllData(null)
};
//// search function end;

///// window key event start
const { insert /* keys you want to monitor */ } = useMagicKeys();
watch(insert, (v) => {
  if (v) showCreate.value = true;
});
//// window key event end
///// pagination start
const pagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 15, 20],
  onChange: (page) => {
    pagination.page = page;
  },
  onUpdatePageSize: (pageSize) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
  },
});
///// pagination end
</script>

<template>
  <div class="box">
    <div class="box-wrapper">
      <div class="box-header">
        <div class="box-header_item">
          <h2>SMS namunalar</h2>
        </div>
        <div class="box-header_item">
          <n-button @click="showCreate = true" type="success">
            <template #icon>
              <n-icon size="18">
                <AddIcon />
              </n-icon>
            </template>
            Qo'shish <span class="Insert-key">Insert</span>
          </n-button>
        </div>
      </div>
      <div class="search-action">
        <div class="search-action_item" v-if="findRole == 'SuperAdmin'">
          <n-input-group>
            <n-input-group-label>Filial</n-input-group-label>
            <n-select
              v-model:value="branchId"
              :options="branchOption"
              @update:value="UpdateBranch"
              label-field="name"
              value-field="id"
              placeholder="Qidiruv"
              filterable
              clearable
            >
            </n-select>
          </n-input-group>
        </div>
  
        <div class="search-action_item">
          <n-button @click="clearBtn" type="info">
            <n-icon>
              <CleanIcon/>
            </n-icon>
            Tozalash
          </n-button>
        </div>
      </div>
    </div>
    <div class="box-table">
      <n-data-table
        :row-props="rowProps"
        :pagination="pagination"
        :loading="loading"
        :columns="columns"
        :data="data"
        :bordered="true"
        :single-line="false"
        size="small"
        style="min-width: 1000px; max-height: calc(100vh - 300px)"
      >
      </n-data-table>
    </div>
  </div>
  <!-- Modal create and Update -->
  <section>
    <n-modal v-model:show="showCreate" :mask-closable="false">
      <n-card
        transform-orign="center"
        style="max-width: 500px; width: calc(100vw - 35px)"
        title="SMS namuna qo'shish"
        :bordered="false"
        size="medium"
        role="dialog"
        aria-modal="true"
        closable
        @close="showClose('create')"
      >
        <ModelForm
          @create="createModel"
          type="create"
          :defaultname="draftName"
        />
      </n-card>
    </n-modal>
    <n-modal v-model:show="showUpdate" :mask-closable="false">
      <n-card
        transform-orign="center"
        style="max-width: 500px; width: calc(100vw - 35px)"
        title="SMS namunani o'zgartirish"
        :bordered="false"
        size="medium"
        role="dialog"
        aria-modal="true"
        closable
        @close="showClose('update')"
      >
        <ModelForm type="update" :id="updateId" @update="updateModel" />
      </n-card>
    </n-modal>
    <n-modal v-model:show="showRead" :mask-closable="false">
      <n-card
        transform-orign="center"
        style="max-width: 500px; width: calc(100vw - 35px)"
        title="SMS namuna"
        :bordered="false"
        size="medium"
        role="dialog"
        aria-modal="true"
        closable
        @close="showClose('read')"
      >
        <ModelRead type="read" :id="readId"/>
      </n-card>
    </n-modal>
  </section>
</template>

<style scoped>
.header_item {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
