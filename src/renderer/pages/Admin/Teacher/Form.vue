<script setup>
import { ref, onMounted, inject } from "vue";
import ModelService from "../../../services/users.service";
import BranchService from "../../../services/branch.service";
import { useMessage } from "naive-ui";
import { Add16Filled as addicon } from "@vicons/fluent";
//// icons import start
import { Save24Filled as SaveIcon } from "@vicons/fluent";
import { Exit as ExitIcon } from "@vicons/ionicons5";
import Dots from "../../../components/Dots/dots.vue";
import BranchIndex from "../Branch/Index.vue";
//// icons import end
//// variables
const props = defineProps(["type", "id", "defaultObeject"]);
const emit = defineEmits(["create", "update", "close"]);
const formRef = ref(null);
const message = useMessage();

const findRole = ref(localStorage.getItem("role"));
const branchID = ref(JSON.parse(localStorage.getItem("filial_id")));

const branchOption = ref([]);
const getAllBranches = () => {
  BranchService.getAll().then((res) => {
    branchOption.value = res;
  });
};
const form_data = ref({
  phone: "998",
  fullname: "",
  role: "Teacher",
  password: "",
  confirmPassword: "",
  filial_id: findRole.value != "SuperAdmin" ? branchID.value : null,
  lang: "uz",
});
const rules = {
  phone: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value.length <= 11) {
        return new Error("Telefon raqam to'liq kiriting!");
      } else if (value == "") {
        return new Error("Telefon raqam bo'sh ");
      }
    },
  },
  filial_id: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        return new Error("Filial tanlash majburiy!");
      }
    },
  },
  fullname: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value.length <= 3) {
        return new Error("To'liq ismi sharfi  3 tadan ko'p bo'lishi kerak   ");
      } else if (value == "") {
        return new Error("To'liq ismi sharfi bo'sh ");
      }
    },
  },
  role: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        return new Error("Huquqi majburiy!");
      }
    },
  },
  password: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == "") {
        return new Error("Parol majburiy!");
      }
    },
  },
  confirmPassword: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == "") {
        return new Error("Qayta terish parol majburiy!");
      } else if (value != form_data.value.password) {
        return new Error("Qayta terish parol bir xil emas");
      }
    },
  },
};

const defaultDisabled = ref(0);
const firstInput = ref(null);

onMounted(() => {
  firstInput.value?.focus();
  if (props.type == "update") {
    ModelService.getOne(props.id).then((res) => {
      form_data.value = res;
    });
  } else if (props.type == "create") {
    if (props.defaultObeject.actionId == 1) {
      form_data.value.fullname = props.defaultObeject.name;
      form_data.value.role = "User";
      defaultDisabled.value = 1;
    } else if (props.defaultObeject.actionId == 3) {
      form_data.value.fullname = props.defaultObeject.name;
      form_data.value.role = "Teacher";
      defaultDisabled.value = 1;
    }
  }
  getAllBranches();
});
const changeLang = (lang) => {
  if (lang) {
    form_data.value.lang = "uz";
  } else {
    form_data.value.lang = "ru";
  }
};

const spinner = ref(false);

const save = async () => {
  try {
    if (props.type == "create") {
      const result = await formRef.value?.validate();
      spinner.value = true;
      ModelService.create(form_data.value)
        .then((res) => {
          emit("create", res);
          spinner.value = false;
        })
        .catch(() => {
          spinner.value = false;
        });
    } else if (props.type == "update") {
      const result = await formRef.value?.validate();
      spinner.value = true;
      ModelService.updateAll(props.id, form_data.value)
        .then((res) => {
          emit("update", res);
          spinner.value = false;
        })
        .catch(() => {
          spinner.value = false;
        });
    }
  } catch (e) {}
};
const exitBtn = () => {
  spinner.value = true;
  emit("close");
};

// swicht start

const railStyle = ({ focused, checked }) => {
  const style = {};
  if (checked) {
    style.background = "#253e35";
    if (focused) {
      style.boxShadow = "0 0 0 2px #253e35";
    }
  } else {
    style.background = "#2080f0";
    if (focused) {
      style.boxShadow = "0 0 0 2px #2080f040";
    }
  }
  return style;
};

///// phone number format and parse function


const phoneFormat = (value) => {
  let idx = !value || /^\d+$/.test(value);
  if (!idx) {
    message.warning("Iltimos raqam kiriting");
  }
  return idx;
};
//////////////////////////////////////////////
//////////////////////////////////////////////
////// create items by index strat
const BranchName = ref("");
const showBranch = ref(false);
const showBranchForm = ref(null);
const createBranch = () => {
  showBranch.value = true;
  showBranchForm.value = 0;
  getAllBranches();
};
const SearchBranch = (branch) => {
  BranchName.value = branch;
};
const chooseBranch = (data) => {
  form_data.value.filial_id = data;
  showBranch.value = false;
  showBranchForm.value = 0;
  getAllBranches();
};

const keySave = (e) => {
  if (e.key == "Enter") {
    save();
  } else if (e.code == "F4") {
    showBranch.value = true;
    showBranchForm.value = 0;
  } else if (e.code == "Insert") {
    showBranch.value = true;
    showBranchForm.value = 1;
  }
};
////// create items by index end
</script>
<template>
  <div class="auto-height">
    <n-form
      :style="{ height: '100%' }"
      ref="formRef"
      :model="form_data"
      :rules="rules"
    >
      <div class="modal-parent">
        <div class="modal-box">
          <n-grid cols="1 s:2 m:2 " :x-gap="15" :y-gap="5" responsive="screen">
            <n-gi>
              <n-form-item label="To'liq ismi sharfi" path="fullname">
                <n-input
                  ref="firstInput"
                  v-model:value="form_data.fullname"
                  :maxlength="50"
                  show-count
                  clearable
                />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="Parol" path="password">
                <n-input
                  type="password"
                  show-password-on="mousedown"
                  v-model:value="form_data.password"
                  :minlength="3"
                  show-count
                  clearable
                />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="Telefon raqam" path="phone">
                <n-input-group>
                  <n-input-group-label>
                    <n-icon>
                      <addicon />
                    </n-icon>
                  </n-input-group-label>
                  <n-input
                    :allow-input="phoneFormat"
                    v-model:value="form_data.phone"
                    :maxlength="12"
                    :minlength="12"
                    show-count
                    clearable
                  />
                </n-input-group>
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="Qayta terish parol" path="confirmPassword">
                <n-input
                  type="password"
                  show-password-on="mousedown"
                  v-model:value="form_data.confirmPassword"
                  :minlength="3"
                  show-count
                  clearable
                />
              </n-form-item>
            </n-gi>

            <n-gi v-if="findRole == 'SuperAdmin'">
              <n-form-item label="Filiali" path="filial_id">
                <n-input-group>
                  <n-select
                    @keydown="keySave"
                    @search="SearchBranch"
                    :disabled="defaultDisabled != 0 ? true : false"
                    :options="branchOption"
                    label-field="name"
                    value-field="id"
                    placement="top"
                    v-model:value="form_data.filial_id"
                  >
                    <template #action>
                      <p style="text-align: center">Ro'yxatni ko'rish "F4"</p>
                    </template>
                    <template #empty>
                      <p style="text-align: center">Qo'shish uchun "Insert"</p>
                    </template>
                  </n-select>
                  <n-tooltip placement="top" trigger="hover">
                    <template #trigger>
                      <n-button
                        @click="createBranch"
                        type="success"
                        :style="{ padding: '0px 8px' }"
                      >
                        <template #icon>
                          <dots />
                        </template>
                      </n-button>
                    </template>
                    <span> Filial qo'shish </span>
                  </n-tooltip>
                </n-input-group>
              </n-form-item>
            </n-gi>

            <!-- <n-gi>
              <n-form-item label="Tili" path="lang">
                <n-switch
                  @update:value="changeLang"
                  :value="form_data.lang == 'uz' ? true : false"
                  :rail-style="railStyle"
                >
                  <template #checked> Uzbek </template>
                  <template #unchecked> Russian </template>
                </n-switch>
              </n-form-item>
            </n-gi> -->
          </n-grid>
          <div class="table-footer">
            <div class="table-footer_item">
              <n-spin :show="spinner">
                <n-button
                  @click="exitBtn"
                  style="min-width: 120px"
                  type="warning"
                >
                  <template #icon>
                    <n-icon>
                      <ExitIcon />
                    </n-icon>
                  </template>
                  Chiqish
                </n-button>
              </n-spin>
            </div>
            <div class="table-footer_item">
              <n-spin :show="spinner">
                <n-button @click="save" style="min-width: 120px" type="success">
                  <template #icon>
                    <n-icon>
                      <SaveIcon />
                    </n-icon>
                  </template>
                  Saqlash
                </n-button>
              </n-spin>
            </div>
          </div>
        </div>
      </div>
    </n-form>
    <!-- select adds start-->
    <n-modal
      v-model:show="showBranch"
      preset="card"
      style="max-width: calc(100% - 35px)"
      transform-orign="center"
    >
      <div class="no-padding">
        <branch-index
          @select="chooseBranch"
          :action="showBranchForm"
          :itemValue="BranchName"
        ></branch-index>
      </div>
    </n-modal>
    <!-- select adds end -->
  </div>
</template>

<style scoped>
.auto-height {
  height: 100%;
}

.modal-parent {
  height: 100%;
}

.modal-box-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.modal-box {
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}

.modal-box-footer_item {
  width: 33%;
  margin-top: 12px;
}
</style>
