<script setup>
import { ref, onMounted, reactive } from "vue";
import ModelService from "../../../services/message.service";
// variables
const props = defineProps(["type", "id"]);
const emit = defineEmits(["create", "update"]);
const formRef = ref(null);
const spinBtn = ref(false);

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
const tabData = ref([]);
const loading = ref(true);
const getAllUsers = (key) => {
  ModelService.getAll(searchData(key)).then((res) => {
    tabData.value = res;
    loading.value = false;
  });
};

const formatUzbekPhoneNumber = (phoneNumber) => {
  if (phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, "");
    const match = cleaned.match(/^998(\d{2})(\d{3})(\d{4})$/);
    if (match) {
      return `998 ${match[1]}  ${match[2]}  ${match[3].slice(0,2)} ${match[3].slice(2, 4)}`;
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
};

const rowKey = (row, key) => {
  return row.id ? row.id : row.user_id;
};

const updaeTabpane = (key) => {
  getAllUsers(key);
  tableColFun(key);
};

onMounted(() => {
  getAllUsers("All");
  tableColFun("All");
});

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
    <n-tabs type="bar" animated @update:value="updaeTabpane">
      <n-tab-pane
        v-for="(item, index) in tabTitle"
        :name="item.key"
        :tab="item.name"
      >
        <div class="tab-pane_item" v-if="userTabs.includes(item.key)">
          <n-scrollbar style="max-height: 420px">
            <n-data-table
              :loading="loading"
              :columns="columns"
              :data="tabData"
              :bordered="true"
              :single-line="false"
              :row-key="rowKey"
              size="small"
            >
            </n-data-table>
          </n-scrollbar>
        </div>
        <div class="tab-pane_item" v-else-if="item.key == 'Course'">
          <n-scrollbar style="max-height: 420px">
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
                      :bordered="true"
                      :single-line="false"
                      :row-key="rowKey"
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
          <n-scrollbar style="max-height: 420px">
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
      <label for="Xabar">Xabar</label>
      <n-input type="textarea" />
    </div>
    <n-spin :show="spinBtn">
      <n-button type="success">Jo'natish</n-button>
    </n-spin>
  </div>
</template>

<style scoped>
.message-text {
  padding: 12px 0px;
}
</style>
