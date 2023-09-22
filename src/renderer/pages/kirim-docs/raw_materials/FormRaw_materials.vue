<template>
  <div>
    <n-form>
      <n-form-item label="Name">
        <n-input v-model:value="form_data.name"> </n-input>
      </n-form-item>
      <n-form-item label="Birlik">
        <n-select
          v-model:value="form_data.measure_id"
          :options="olchov"
          label-field="name"
          value-field="id"
          filterable
          placeholder="Tanlang"
        ></n-select>
        <n-button @click="showAddMeasure = true">...</n-button>
      </n-form-item>
      <div class="footer">
        <n-button type="error" @click="close">Bekor qilish</n-button>
        <n-button color="#306EBF" @click="save" style="margin-left: 10px"
          >Saqlash</n-button
        >
      </div>
    </n-form>
    <n-modal v-model:show="showAddMeasure" preset="card" style="width: 600px">
      <IndexMeasure
        @createMeasure="createMeasure"
        @row-click="chooseMeasure"
      ></IndexMeasure>
    </n-modal>
  </div>
</template>

<script setup>
import Food_resourseService from "../../../services/food_resource.service";
import MeasureService from "../../../services/measure.service";
import IndexMeasure from "../measure/IndexMeasure.vue";
import { ref, onMounted } from "vue";
const props = defineProps(["type", "id"]);
const emits = defineEmits("create", "update", "close");
const showAddMeasure = ref(false);

let olchov = ref([]);
const getOne = async () => {
  olchov.value = await MeasureService.getAll();
};

onMounted(() => {
  getOne();
  if (props.type == "update") {
    Food_resourseService.getOne(props.id).then((res) => {
      (form_data.value.name = res.name),
      (form_data.value.measure_id = res.measure_id),
      form_data.value.showMenu = res.showMenu;
    });
  }
});

const form_data = ref({
  name: "",
  measure_id: null,
  showMenu: 0,
});

const close = () => {
  emits("close");
};

const save = () => {
  if (props.type == "create") {
    Food_resourseService.create(form_data.value).then((res) => {
      emits("create", res);
    });
  } else {
    Food_resourseService.update(props.id, form_data.value)
      .then((res) => {
        emits("update");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

//measure start

const chooseMeasure = (row) => {
  form_data.value.measure_id = row.id;
  showAddMeasure.value = false;
};

const createMeasure = (data) => {
  olchov.value.push(data);
  form_data.value.measure_id = data.id;
  showAddMeasure.value = false;
};
//measure end
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: flex-end;
}
</style>
