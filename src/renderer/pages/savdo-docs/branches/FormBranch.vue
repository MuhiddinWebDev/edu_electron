<template>
  <div>
    <n-form ref="formRef" :rules="rules" :model="form_data">
      <n-form-item label="Name" path="name">
        <n-input v-model:value="form_data.name"> </n-input>
      </n-form-item>
      <n-form-item label="Menyuga chiqarish">
        <n-switch
          v-model:value="form_data.showMenu"
          :checked-value="1"
          :unchecked-value="0"
        ></n-switch>
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
import BranchService from "../../../services/branch.service";
import { ref, onMounted } from "vue";
import { useMessage } from "naive-ui";
const props = defineProps(["type", "id"]);
const emits = defineEmits("create", "update", "close");
const message = useMessage();
const formRef = ref(null);

onMounted(() => {
  if (props.type == "update") {
    BranchService.getOne(props.id).then((res) => {
      form_data.value.name = res.name;
      form_data.value.showMenu = res.showMenu;
    });
  }
});

const form_data = ref({
  name: "",
  showMenu: 0,
});

const close = () => {
  emits("close");
  message.warning("Bekor qilindi");
};

const save = () => {
  if (props.type == "create") {
    const result = formRef.value?.validate();
    BranchService.create(form_data.value).then((res) => {
      emits("create", res);
      message.success("Muvaffaqqiyatli");
    });
  } else {
    BranchService.update(props.id, form_data.value)
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
};
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: flex-end;
}
</style>
