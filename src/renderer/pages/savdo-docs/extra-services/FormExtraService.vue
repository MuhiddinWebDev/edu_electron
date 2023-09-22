<template>
  <div>
    <n-form ref="formRef" :rules="rules" :model="form_data">
      <n-form-item label="Name" path="name">
        <n-input v-model:value="form_data.name"> </n-input>
      </n-form-item>

      <n-form-item label="Rangni kiriting" path="color">
        <n-color-picker v-model:value="form_data.color" />
      </n-form-item>
      <div>
        <p>Rasm yuklash</p>
        <div style="display: flex; justify-content: left;">
          
          <n-upload style="width:300px" :max="1" list-type="image-card" v-model:file-list="fileList"> Click to Upload </n-upload>
          <n-image v-if="props.type == 'update' && form_data.picture" width="200" :src="imgUrl+form_data.picture"></n-image>
        </div>
      </div>

      <n-form-item label="Narxni kiriting">
        <n-input-number v-model:value="form_data.price" :format="useFormatnumber" :parse="useParsenumber" style="width: 600px" />
      </n-form-item>

      <n-form-item label="Menyuga chiqarish">
        <n-switch
          v-model:value="form_data.showMenu"
          :checked-value="1"
          :unchecked-value="0"
        ></n-switch>
      </n-form-item>

      <n-form-item label="Birlikni tanlang" path="measure_id">
        <n-select
          v-model:value="form_data.measure_id"
          label-field="name"
          value-field="id"
          :options="measures"
        />
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
import ExtraService from "../../../services/extra_service.service";
import { useFormatnumber, useParsenumber } from "../../../composables/numberFormat.js"
import { ref, onMounted, inject } from "vue";
import IndexMeasure from "../../kirim-docs/measure/IndexMeasure.vue";
import MeasureService from "../../../services/measure.service";
import { useMessage } from "naive-ui";
const props = defineProps(["type", "id"]);
const emits = defineEmits("create", "update", "close");
const measures = ref([]);
const imgUrl = inject('img_url');
const showAddMeasure = ref(false);
const message = useMessage();
const formRef = ref(null);
const fileList = ref([])
onMounted(() => {
  if (props.type == "update") {
    ExtraService.getOne(props.id).then((res) => {
      form_data.value.name = res.name;
      form_data.value.color = res.color;
      form_data.value.price = res.price;
      form_data.value.picture = res.picture;
      form_data.value.showMenu = res.showMenu;
      form_data.value.measure_id = res.measure_id;
    });
  }
  getAllMeasures();
});

const getAllMeasures = () => {
  MeasureService.getAll().then((res) => {
    measures.value = res;
  });
};

const form_data = ref({
  name: null,
  color: null,
  price: 0,
  picture: null,
  showMenu: 0,
  measure_id: null,
});

const close = () => {
  emits("close");
  message.warning("Bekor qilindi");
};

const save = () => {
  const sendData = new FormData();
  sendData.append('name', form_data.value.name)
  sendData.append('measure_id', form_data.value.measure_id)
  sendData.append('showMenu', form_data.value.showMenu)
  sendData.append('price', form_data.value.price)
  sendData.append('color', form_data.value.color)
  if(fileList.value.length > 0) {
    sendData.append('picture', fileList.value[0].file)
  }
  if (props.type == "create") {
    ExtraService.create(sendData).then((res) => {
      emits("create");
      message.success("Muvaffaqqiyatli");
    });
  } else {
    ExtraService.update(props.id, sendData)
      .then((res) => {
        emits("update");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const chooseMeasure = (row) => {
  form_data.value.measure_id = row.id;
  showAddMeasure.value = false;
};

const createMeasure = (data) => {
  measures.value.push(data);
  form_data.value.measure_id = data.id;
  showAddMeasure.value = false;
};

const rules = {
  name: {
    required: true,
    message: "Iltimos nomni kiriting",
    trigger: "blur",
  },
  price: {
    required: true,
    message: "Iltimos narxni kiriting",
    trigger: "blur",
  },
  measure_id: {
    required: true,
    message: "Iltimos tanlang",
    trigger: "blur",
  },
};
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: flex-end;
}
</style>
