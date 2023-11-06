<script setup>
import { ref, onMounted, watch, reactive, h } from "vue";
import ModelService from "../../../services/message.service";
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


const message = useMessage();

const showCreate = ref(false);
const showRead = ref(false);
const readId = ref(null);
const data = ref([]);

const branchOption = ref([]);
const messageOption = ref([]);
const loading = ref(true);

const branchId = ref(null);
const sms_type = ref(null);

const findRole = ref(localStorage.getItem("role"));
const findBranch = ref(JSON.parse(localStorage.getItem("filial_id")));


const columns = ref([
  {
    title: "№",
    key: "index",
    width: 50,
    render(row) {
      return data.value.findIndex((item) => item.id == row.id) + 1;
    },
  },

  {
    title: "Kimga",
    key: "name",
    resizable: true,
    sortOrder: true,
    sorter: "default",
  },
  {
    title: "Matni",
    key: "text",
    resizable: true,
    render(row){
      return row.text.slice(0, 75) +'...'
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
    title: "Amal",
    key: "action",
    width: 55,
    render(row) {
      return [
        h(
          NButton,
          {
            size: "small",
            type: "info",
            block: true,
            onClick: (e) => {
              showRead.value = true;
              readId.value = row.id;
            },
          },
          {
            icon: () =>
              h(NIcon, {
                component: EyeIcon,
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
  
  getAllData()
  getAllBranches();
});

/////  create and update functions
const createModel = (res) => {
  showCreate.value = false;
  getAllData()
};
const showClose = (e) => {
  if (e == "create") {
    showCreate.value = false;
  } else if (e == "read") {
    showRead.value = false;
  }
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
          <h2>SMS xabarlar</h2>
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
        <!-- <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>Nomi</n-input-group-label>
            <n-select
              v-model:value="sms_type"
              :options="messageOption"
              @update:value="updateName"
              label-field="name"
              value-field="id"
              placeholder="Qidiruv"
              filterable
              clearable
            >
            </n-select>
          </n-input-group>
        </div> -->
        <div class="search-action_item" v-if="findRole == 'SuperAdmin'">
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
        :pagination="pagination"
        :loading="loading"
        :columns="columns"
        :data="data"
        :bordered="true"
        :single-line="false"
        size="small"
        max-height="calc(100vh - 300px)"
        style="min-width: 400px;"
      >
      </n-data-table>
    </div>
  </div>
  <!-- Modal create and Update -->
  <section>
    <n-modal v-model:show="showCreate" :mask-closable="false">
      <n-card
        transform-orign="center"
        style="width: calc(100vw - 35px); max-width: 900px;"
        title="Xabar yozish"
        :bordered="false"
        role="dialog"
        aria-modal="true"
        closable
        @close="showClose('create')"
      >
        <ModelForm
          @create="createModel"
          type="create"
        />
      </n-card>
    </n-modal>
    <n-modal v-model:show="showRead" :mask-closable="false">
      <n-card
        transform-orign="center"
        style="width: calc(100vw - 35px); max-width: 900px;"
        title="Xabar"
        :bordered="false"
        size="medium"
        role="dialog"
        aria-modal="true"
        closable
        @close="showClose('read')"
      >
        <ModelRead type="read" :id="readId" />
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
