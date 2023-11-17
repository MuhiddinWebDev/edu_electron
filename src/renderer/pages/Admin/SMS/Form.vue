<script setup>
import { ref, onMounted, inject } from "vue";
import ModelService from "../../../services/message.service";
import DraftService from "../../../services/draft.service";
import BranchService from "../../../services/branch.service";
import { useMessage, useNotification } from "naive-ui";
import { Copy20Regular as copyIcon } from "@vicons/fluent";
import DraftIndex from "../Draft/Index.vue";
// variables
const props = defineProps(["type", "id"]);
const emit = defineEmits(["create", "update"]);
const message = useMessage();
const notification = useNotification();
const formRef = ref(null);
const spinBtn = ref(false);
const dayJS = inject('dayJS')
const tabData = ref([]);
const activeTab = ref("All")
const loading = ref(true);
const showDraft = ref(false);
const draftData = ref([]); 
const branchOptions = ref([]);

const findRole = ref(localStorage.getItem("role"));
const findBranch = ref(JSON.parse(localStorage.getItem("filial_id")));

const tabTitle = ref([
  {
    name: "Hammasi",
    key: "All",
  },
  {
    name: "Talabalar",
    key: "User",
  },
  {
    name: "O'qituvchilar",
    key: "Teacher",
  },
  {
    name: "Adminlar",
    key: "Admin",
  },

  {
    name: "Kurslar",
    key: "Course",
  },
  {
    name: "Guruhlar",
    key: "Group",
  },
]);

const searchData = (key) => {
  return {
    filial_id: findBranch.value,
    key: key,
  };
};


const form_data = ref({
  datetime: new Date().getTime(),
  text: null,
  name:null,
  selected:[],
  filial_id:findBranch.value
});

const rules = {
  filial_id: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        return new Error("Filialni tanlang ");
      }
    },
  },
  text: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null || value =='') {
        return new Error("Xabar matni kiritish majburiy!");
      }
    },
  },
}

const getAllUsers = (key) => {
  ModelService.getUsers(searchData(key)).then((res) => {
    tabData.value = res;
    loading.value = false;
  });
};

const getAllBranches = ()=>{
  BranchService.getAll().then((res)=>{
    branchOptions.value = res;
  })
}

const formatUzbekPhoneNumber = (phoneNumber) => {
  if (phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, "");
    const match = cleaned.match(/^998(\d{2})(\d{3})(\d{4})$/);
    if (match) {
      return `998 ${match[1]}  ${match[2]}  ${match[3].slice(
        0,
        2
      )} ${match[3].slice(2, 4)}`;
    }
    return phoneNumber;
  }
};

const columns = ref([]);

const userTabs = ref(["All", "Teacher", "Admin", "User"]);

const tableColFun = (key) => {
  let action = userTabs.value.includes(key);
  let action2 = ["Course", "Group"].includes(key);

  columns.value = [
    {
      type: "selection",
    },
    {
      title: "ID",
      key: action ? "id" : action2 ? "users.id" : "",
      align: "center",
      width: 50,
    },
    {
      title: "F.I.O",
      key: action ? "fullname" : action2 ? "users.fullname" : "",
      resizable: true,
    },
    {
      title: "Telefon",
      key: "phone",
      resizable: true,
      render(row) {
        return action
          ? "+" + formatUzbekPhoneNumber(row.phone)
          : action2
          ? "+" + formatUzbekPhoneNumber(row.users.phone)
          : "";
      },
    },
    {
      title: "Huquqi",
      key: "role",
      resizable: true,
      render(row) {
        if (action) {
          return row.role == "User"
            ? "Talaba"
            : row.role == "Teacher"
            ? "O'qituvchi"
            : row.role;
        } else if (action2) {
          return row.users.role == "User"
            ? "Talaba"
            : row.users.role == "Teacher"
            ? "O'qituvchi"
            : row.users.role;
        }
      },
    },
    {
      title: "Filial",
      key: action ? "branch.name" : action2 ? "users.branch.name" : "tes",
      resizable: true,
    },
  ];
  form_data.value.selected =[]
};

const rowKey = (row, key) => {
  return row.id ? row.id : row.user_id;
};

const updaeTabpane = (key) => {
  getAllUsers(key);
  tableColFun(key);
};

const updateBranch = (branch)=>{
  findBranch.value= branch;
  getAllUsers(activeTab.value)
}

const btnDraft = () => {
  showDraft.value = true;
  DraftService.getAll().then((res) => {
    draftData.value = res;
  });
};

const chooseOne = (id) => {
  showDraft.value = false;
  DraftService.getOne(id).then((res) => {
    form_data.value.text = res.name;
  });
};

const chooseDraft = (id) => {
  chooseOne(id);
};

onMounted(() => {
  getAllUsers("All");
  tableColFun("All");
  getAllBranches();
});

const sendMessage = async () => {
  try {
    
    const index = tabTitle.value.findIndex((item)=> item.key == activeTab.value);
    form_data.value.name = tabTitle.value[index].name;
    const result = await formRef.value?.validate();
    if(form_data.value.selected.length == 0){
      message.warning('Shaxslarni tanglang!!!')
    }else{
      ModelService.create(form_data.value).then((res)=>{
        // notification.success({
        //   title: 'Muvofaqqiyatli',
        //   content: `Xabarlar ${form_data.value.name}ga jo'natildi`,
        //   duration: 2500,
        //   keepAliveOnHover: true,
        //   meta: dayJS
        // })
        notification.warning({
          title: 'Ogohlantirish',
          content: `SMS tarifga ulanmagan`,
          duration: 2500,
          keepAliveOnHover: true,
          meta: dayJS
        })
        emit('create')
      })
    }

  } catch (error) {
    console.log(error);
  }
};

// ///// pagination start
// const pagination = reactive({
//   page: 1,
//   pageSize: 10,
//   showSizePicker: true,
//   pageSizes: [10, 15, 20],
//   onChange: (page) => {
//     pagination.page = page;
//   },
//   onUpdatePageSize: (pageSize) => {
//     pagination.pageSize = pageSize;
//     pagination.page = 1;
//   },
// });
// ///// pagination end
//// branch index end
</script>
<template>
  <div class="modal-box">
    <n-form 
      ref="formRef"
      :model="form_data"
      :rules="rules"
    >
      <div class="modal-box-header">
        <n-form-item label="Sana" path="datetime">
          <n-date-picker
            :style="{ width: '100%' }"
            :disabled="true"
            type="datetime"
            v-model:value="form_data.datetime"
          ></n-date-picker>
        </n-form-item>
        <n-form-item label="Filial" path="filial_id">
          <n-select
              :options="branchOptions"
              v-model:value="form_data.filial_id"
              @update:value="updateBranch"
              label-field="name"
              value-field="id"
              filterable
            >
            </n-select>
        </n-form-item>
      </div>
      <n-tabs v-model:value="activeTab" type="bar" animated @update:value="updaeTabpane">
        <n-tab-pane
          v-for="(item, index) in tabTitle"
          :name="item.key"
          :tab="item.name"
        >
          <div class="tab-pane_item" v-if="userTabs.includes(item.key)">
              <n-data-table
                :loading="loading"
                :columns="columns"
                :data="tabData"
                :bordered="true"
                :single-line="false"
                :row-key="rowKey"
                v-model:checked-row-keys="form_data.selected"
                size="small"
                :max-height="250"
              >
              </n-data-table>
          </div>
          <div class="tab-pane_item" v-else-if="item.key == 'Course'">
            <n-scrollbar style="max-height: 280px">
              <n-collapse>
                <n-collapse-item
                  v-for="(item, index) in tabData"
                  :key="index"
                  :title="item.name"
                  :name="index"
                >
                  <n-collapse>
                    <n-collapse-item
                      v-for="(child, idx) in item.group"
                      :key="index"
                      :title="child.name"
                      :name="idx"
                    >
                      <n-data-table
                        :loading="loading"
                        :columns="columns"
                        :data="child.group_table"
                        v-model:checked-row-keys="form_data.selected"
                        :bordered="true"
                        :single-line="false"
                        :row-key="rowKey"
                        :max-height="250"
                        size="small"
                      >
                      </n-data-table>
                    </n-collapse-item>
                  </n-collapse>
                </n-collapse-item>
              </n-collapse>
            </n-scrollbar>
          </div>
          <div class="tab-pane_item" v-else-if="item.key == 'Group'">
            <n-scrollbar style="max-height: 280px">
              <n-collapse>
                <n-collapse-item
                  v-for="(item, index) in tabData"
                  :title="item.name"
                  :key="index"
                  :name="index"
                >
                  <n-data-table
                    :loading="loading"
                    :columns="columns"
                    :data="item.group_table"
                    :bordered="true"
                    :single-line="false"
                    :row-key="rowKey"
                    size="small"
                  >
                  </n-data-table>
                </n-collapse-item>
              </n-collapse>
            </n-scrollbar>
          </div>
        </n-tab-pane>
      </n-tabs>
      <div class="message-text">
        <div class="message-draft">
          <n-button type="info" @click="btnDraft">
            <n-icon size="20">
              <copyIcon />
            </n-icon>
            SMS namuna
          </n-button>
        </div>
        <n-form-item label="Xabar matni" path="text">
          <n-input type="textarea" v-model:value="form_data.text" />
        </n-form-item>
       
      </div>
      <div class="btn-action">
        <n-spin :show="spinBtn">
          <n-button type="success" @click="sendMessage">Jo'natish</n-button>
        </n-spin>
      </div>
    </n-form>
    <section class="draft-index">
      <n-modal
        v-model:show="showDraft"
        preset="card"
        style="max-width: calc(100% - 35px)"
        transform-orign="center"
      >
        <div class="no-padding">
          <DraftIndex @select="chooseDraft" :branch_id="form_data.filial_id" />
        </div>
      </n-modal>
    </section>
  </div>
</template>

<style scoped>
.message-draft{
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.message-text {
  padding: 12px 0px;
  position: relative;
}
.btn-action {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.modal-box-header{
  display: grid;
  grid-template-columns: repeat(3,1fr);
  align-items: center;
  gap:12px;
}
</style>
