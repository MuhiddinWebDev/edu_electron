<template>
  <div>
    <n-form>
      <n-form-item label="Name">
        <n-input v-model:value="form_data.name"> </n-input>
      </n-form-item>
      <n-form-item label="Faollik">
        <n-switch
          v-model:value="form_data.room_active"
          :checked-value="1"
          :unchecked-value="0"
        ></n-switch>
      </n-form-item>

      <n-form-item label="Izoh">
        <n-input v-model:value="form_data.comment"> </n-input>
      </n-form-item>

      <div class="footer">
        <n-button type="error" @click="close">Bekor qilish</n-button>
        <n-button color="#306EBF" @click="save" style="margin-left: 10px"
          >Saqlash</n-button
        >
      </div>
    </n-form>
    <n-modal v-model:show="showAddBranch" preset="card" style="width: 800px">
      <IndexBranch
        @createBranch="createBranch"
        @row-click="chooseBranch"
      ></IndexBranch>
    </n-modal>
  </div>
</template>

<script setup>
import RoomService from "../../../services/room.service";
import IndexBranch from "../branches/IndexBranch.vue";
import BranchService from "../../../services/branch.service";
import { ref, onMounted } from "vue";
const props = defineProps(["type", "id"]);
const emits = defineEmits("create", "update", "close");
const showAddBranch = ref(false);
const branches = ref([]);

onMounted(() => {
  if (props.type == "update") {
    RoomService.getOne(props.id).then((res) => {
      form_data.value.name = res.name;
      form_data.value.room_active = res.room_active;
      form_data.value.comment = res.comment;
    });
  }

  getAllBranch();
});

const getAllBranch = () => {
  BranchService.getAll().then((res) => {
    branches.value = res;
  });
};

const form_data = ref({
  name: "",
  room_active: null,
  comment: ""
});

const close = () => {
  emits("close");
};

const save = () => {
  if (props.type == "create") {
    RoomService.create(form_data.value).then((res) => {
      emits("create", res);
    });
  } else {
    RoomService.update(props.id, form_data.value)
      .then((res) => {
        emits("update");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const chooseBranch = (row) => {
  form_data.value.branch_id = row.id;
  showAddBranch.value = false;
};

const createBranch = (data) => {
  branches.value.push(data);
  form_data.value.branch_id = data.id;
  showAddBranch.value = false;
};
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: flex-end;
}
</style>
