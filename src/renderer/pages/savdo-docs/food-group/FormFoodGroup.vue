<template>
  <div>
    <n-form>
      <n-form-item label="Name">
        <n-input v-model:value="form_data.name"> </n-input>
      </n-form-item>
      <n-form-item label="Menyuga chiqarish">
        <n-switch
          v-model:value="form_data.showMenu"
          checked-value="1"
          unchecked-value="0"
        ></n-switch>
      </n-form-item>
      <n-form-item label="Ovqat tarqatish bo'limini tanlang">
        <n-select
          v-model:value="form_data.branch_id"
          label-field="name"
          value-field="id"
          :options="branches"
        />
        <n-button @click="showAddBranch = true">...</n-button>
      </n-form-item>
      <n-form-item label="Printerni tanlang">
        <n-select
          v-model:value="form_data.printer_id"
          label-field="name"
          value-field="id"
          :options="printers"
        />
        <n-button @click="showAddPrinter = true">...</n-button>
      </n-form-item>
      <n-form-item label="Ovqat guruhi">
        <n-select v-model:value="form_data.parent_id" :options="foodGroups" label-field="name" value-field="id"></n-select>
      </n-form-item>
      <div class="footer">
        <n-button type="error" @click="close">Bekor qilish</n-button>
        <n-button color="#306EBF" @click="save" style="margin-left: 10px"
          >Saqlash</n-button
        >
      </div>
    </n-form>
    <n-modal v-model:show="showAddPrinter" preset="card" style="width: 600px">
      <IndexPrinter
        @createPrinter="createPrinter"
        @row-click="choosePrinter"
      ></IndexPrinter>
    </n-modal>
    <n-modal v-model:show="showAddBranch" preset="card" style="width: 500px;">
      <IndexBranch @createBranch="createBranch" @row-click="chooseBranch"></IndexBranch>
    </n-modal>
  </div>
</template>

<script setup>
import FoodGroupService from "../../../services/food-group.service";
import PrinterService from "../../../services/printer.service";
import BranchService from "../../../services/branch.service";
import IndexPrinter from "../printer/IndexPrinter.vue";
import IndexBranch from "../branches/IndexBranch.vue";
import { ref, onMounted } from "vue";
const props = defineProps(["type", "id"]);
const emits = defineEmits("create", "update", "close");
const printers = ref([]);
const branches = ref([]);
const foodGroups = ref([]);
const showAddPrinter = ref(false);
const showAddBranch = ref(false);
onMounted(async () => {
  foodGroups.value = await FoodGroupService.getAll()
  if (props.type == "update") {
    FoodGroupService.getOne(props.id).then((res) => {
      form_data.value.name = res.name;
      form_data.value.printer_id = res.printer_id;
      form_data.value.showMenu = res.showMenu;
      form_data.value.parent_id = res.parent_id;
      const index = foodGroups.value.findIndex((val) => val.id == res.id);
      foodGroups.value.splice(index, 1);
    });
  }
  getAllPrinters();
  getAllBranches()
});

const getAllPrinters = () => {
  PrinterService.getAll().then((res) => {
    printers.value = res;
  });
};
const getAllBranches = () => {
  BranchService.getAll().then((res) => {
    branches.value = res;
  })
}
const form_data = ref({
  name: "",
  printer_id: null,
  showMenu: 0,
  branch_id: null,
  parent_id: null
});

const close = () => {
  emits("close");
};

const save = () => {
  if (props.type == "create") {
    FoodGroupService.create(form_data.value).then((res) => {
      emits("create", res);
    });
  } else {
    FoodGroupService.update(props.id, form_data.value)
      .then((res) => {
        emits("update");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const choosePrinter = (row) => {
  form_data.value.printer_id = row.id;
  showAddPrinter.value = false;
};
const chooseBranch = (row) => {
  form_data.value.branch_id = row.id;
  showAddBranch.value = false;
}
const createBranch = (data) => {
  branches.value.push(data);
  form_data.value.branch_id = data.id;
  showAddBranch.value = false;
}
const createPrinter = (data) => {
  printers.value.push(data);
  form_data.value.printer_id = data.id;
  showAddPrinter.value = false;
};
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: flex-end;
}
</style>
