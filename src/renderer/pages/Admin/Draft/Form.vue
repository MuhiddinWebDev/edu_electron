<script setup>
import { ref, onMounted } from "vue";
import ModelService from "../../../services/draft.service";
import BranchService from "../../../services/branch.service";
// variables
const props = defineProps(["type", "id", "defaultname"]);
const emit = defineEmits(["create", "update"]);
const formRef = ref(null);
const spinBtn = ref(false);
const branchs = ref([]);

const findRole = ref(localStorage.getItem("role"));
const findBranch = ref(JSON.parse(localStorage.getItem("filial_id")));

const form_data = ref({
  name: "",
  filial_id: findRole.value == "SuperAdmin" ? null : findBranch.value,
});
const rules = {
  name: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == "") {
        return new Error("Xona nomi  bo'sh ");
      }
    },
  },
  filial_id: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        return new Error("Filial nomi  tanlang ");
      }
    },
  },
};

const getAllBranch = () => {
  BranchService.getAll(props.id).then((res) => {
    branchs.value = res;
  });
};
const firsInput = ref(null);
onMounted(() => {
  if (props.type == "update") {
    ModelService.getOne(props.id).then((res) => {
      form_data.value = res;
    });
  }
  if (props.defaultname) {
    form_data.value.name = props.defaultname;
  }
  getAllBranch();
});
const spinTime = () => {
  setTimeout(() => {
    spinBtn.value = false;
  }, 500);
};
const save = async () => {
  try {
    const result = await formRef.value?.validate();
    if (props.type == "create") {
      spinBtn.value = true;
      ModelService.create(form_data.value)
        .then((res) => {
          emit("create", res);
          spinTime();
        })
        .catch(() => {
          spinTime();
        });
    } else if (props.type == "update") {
      spinBtn.value = true;
      ModelService.update(props.id, form_data.value)
        .then((res) => {
          emit("update", res);
          spinTime();
        })
        .catch(() => {
          spinTime();
        });
    }
  } catch (e) {}
};


const keySave = (e) => {
  if (e.key == "Enter") {
    save();
  }
};
//// branch index end
</script>
<template>
  <div class="modal-box">
    <n-form
      :style="{ height: '100%' }"
      ref="formRef"
      :model="form_data"
      :rules="rules"
    >
      <n-spin :show="spinBtn">
        <n-form-item
          label="Filial"
          path="filial_id"
          v-if="findRole == 'SuperAdmin'"
        >
          <n-input-group>
            <n-select
              @keydown="keySave"
              :options="branchs"
              v-model:value="form_data.filial_id"
              label-field="name"
              value-field="id"
              filterable
              clearable
            >
            </n-select>
           
          </n-input-group>
        </n-form-item>
        <n-form-item label="SMS matni" path="name">
          <n-input
            @keydown="keySave"
            type="textarea"
            v-model:value="form_data.name"
            show-count
            clearable
          />
        </n-form-item>
        <n-button @click="save" block type="success">Saqlash</n-button>
      </n-spin>
    </n-form>
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
