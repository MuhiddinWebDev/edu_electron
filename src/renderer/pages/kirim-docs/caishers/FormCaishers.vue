<script setup>
import ChiefsService from "../../../services/caisher.service.js";
import { useFormatnumber, useParsenumber } from "../../../composables/numberFormat.js"

import { ref, onMounted } from "vue";
const props = defineProps(["type", "id"]);
const emits = defineEmits(["create", "update", "close"]);

onMounted(() => {
  if (props.type == "update") {
    ChiefsService.getOne(props.id).then((res) => {
      (form_data.value.username = res.username),
        (form_data.value.full_name = res.full_name),
        (form_data.value.password = res.password),
        (form_data.value.confirm_password = res.confirm_password),
        (form_data.value.email = res.email),
        (form_data.value.showMenu = res.showMenu);
        form_data.value.salary = res.salary;
        status.value = res.status
    });
  }
});

const form_data = ref({
  username: "",
  full_name: "",
  password: "",
  confirm_password: "",
  email: "",
  showMenu: 0,
  salary: 0
});
const close = () => {
  emits("close");
};
const save = () => {
  if (props.type == "create") {
    ChiefsService.create(form_data.value).then((res) => {
      emits("create");
    });
  } else {
    if(!form_data.value['password'] && !form_data.value['confirm_password']) {
      form_data.value['change_password'] = 0;
    } else {
      form_data.value['change_password'] = 1;
    }
    form_data.value['status'] = status.value;
    ChiefsService.update(props.id, form_data.value)
      .then((res) => {
        emits("update");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

//status start
const statuses = [
  {
    name: 'Faol',
    value: 'active'
  },
  {
    name: 'Nofaol',
    value: 'inactive'
  },
  {
    name: 'Block',
    value: 'blocked'
  }
]
const status = ref(null);
//status end
</script>

<template>
  <div>
    <n-form>
      <n-form-item label="Username">
        <n-input v-model:value="form_data.username"> </n-input>
      </n-form-item>
      <n-form-item label="F I O ">
        <n-input v-model:value="form_data.full_name"> </n-input>
      </n-form-item>
      <n-form-item label="Status" v-if="props.type == 'update'">
        <n-select v-model:value="status" :options="statuses" label-field="name" value-field="value"></n-select>
      </n-form-item>
      <n-form-item label="Parol">
        <n-input v-model:value="form_data.password" type="password"> </n-input>
      </n-form-item>
      <n-form-item label="Parolni Tasdiqlang">
        <n-input v-model:value="form_data.confirm_password" type="password">
        </n-input>
      </n-form-item>
      <n-form-item label="Oylik">
        <n-input-number :format="useFormatnumber" :parse="useParsenumber" style="width: 100%" v-model:value="form_data.salary"> </n-input-number>
      </n-form-item>
      <n-form-item label="Email">
        <n-input v-model:value="form_data.email"> </n-input>
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

<style scoped>
.footer {
  display: flex;
  justify-content: flex-end;
}
</style>
