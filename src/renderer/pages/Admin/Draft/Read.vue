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

onMounted(() => {
  if (props.type == "read") {
    ModelService.getOne(props.id).then((res) => {
      form_data.value = res;
    });
  }
});
</script>
<template>
  <div class="modal-read">
    <div class="modal-read-row">
      <b>Filial:</b>
      <b>{{ form_data.branch?.name }}</b>
    </div>
    <div class="modal-read-text">
      <n-scrollbar  style="max-height: 120px">
        <b>{{ form_data.name }}</b>
      </n-scrollbar >
    </div>
  </div>
 
</template>

<style scoped>
.modal-read-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0px;
  border-bottom: 2px dotted;
}
</style>
