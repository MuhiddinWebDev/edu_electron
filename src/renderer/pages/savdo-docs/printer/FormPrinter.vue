<template>
  <div>
    <n-form ref="formRef" :rules="rules" :model="form_data">
      <n-form-item label="Name" path="name">
        <n-input v-model:value="form_data.name"> </n-input>
      </n-form-item>

      <n-form-item label="IP" path="ip">
        <n-input v-model:value="form_data.ip"> </n-input>
      </n-form-item>

      <div class="footer">
        <n-button type="error" @click="close">Bekor qilish</n-button>
        <n-button color="#306EBF" @click="save" style="margin-left: 10px"
          >Saqlash</n-button
        >
      </div>
    </n-form>
  </div>
</template>

<script setup>
import PrinterService from "../../../services/printer.service";
import { useMessage } from "naive-ui";
import { ref, onMounted } from "vue";
const props = defineProps(["type", "id"]);
const emits = defineEmits("create", "update", "close");
const formRef = ref(null);
const message = useMessage();

onMounted(() => {
  if (props.type == "update") {
    PrinterService.getOne(props.id).then((res) => {
      form_data.value.name = res.name;
      form_data.value.ip = res.ip;
    });
  }
});

const form_data = ref({
  name: "",
  ip: "",
});

const close = () => {
  emits("close");
  message.warning("Bekor qilindi");
};

const save = async () => {
  if (props.type == "create") {
    try {
      const result = await formRef.value?.validate();
      PrinterService.create(form_data.value).then((res) => {
        emits("create", res);
        message.success("Muvaffaqqiyatli");
      });
    } catch (e) {
      console.log(e);
    }
  } else {
    PrinterService.update(props.id, form_data.value)
      .then((res) => {
        emits("update");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const rules = {
  name: {
    required: true,
    message: "Iltimos nomni kiriting",
    trigger: "blur",
  },
  ip: {
    required: true,
    message: "Iltimos ipni kiriting",
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
