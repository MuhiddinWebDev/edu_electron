<template>
  <div>
    <n-form>
      <n-form-item label="Username">
        <n-input v-model:value="form_data.username"> </n-input>
      </n-form-item>
      <n-form-item label="FIO">
        <n-input v-model:value="form_data.full_name"> </n-input>
      </n-form-item>
      <n-form-item label="Ovqat guruhi">
        <n-select v-model:value="form_data.food_group_id" :options="foodGroups" label-field="name" value-field="id"></n-select>
        <n-button @click="showFoodGroup = true">...</n-button>
      </n-form-item>
      <n-form-item label="Parol">
        <n-input v-model:value="form_data.password" type="password"> </n-input>
      </n-form-item>
      <n-form-item label="Parolni Tasdiqlang">
        <n-input v-model:value="form_data.confirm_password" type="password">
        </n-input>
      </n-form-item>
      <n-form-item label="Oylik">
        <n-input-number :parse="useParsenumber" :format="useFormatnumber" style="width: 100%" v-model:value="form_data.salary"> </n-input-number>
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
    <n-modal 
      v-model:show="showFoodGroup"
      preset="card"
      style="width: 60%;"
    >
      <FoodGroupIndex @rowClick="clickFoodGroup" @createFoodGroup="createFoodGroup"></FoodGroupIndex>
    </n-modal>
  </div>
</template>

<script setup>
import ChiefsService from "../../../services/chief.service.js";
import FoodGroupService from "../../../services/food-group.service.js";
import FoodGroupIndex from "../../savdo-docs/food-group/IndexFoodGroup.vue";
import { useFormatnumber, useParsenumber } from "../../../composables/numberFormat.js"
import { ref, onMounted } from "vue";
const props = defineProps(["type", "id"]);
const emits = defineEmits(["create", "update", "close"]);

onMounted(() => {
  FoodGroupService.getAll().then((res) => {
    foodGroups.value = res;
  })
  if (props.type == "update") {
    ChiefsService.getOne(props.id).then((res) => {
        form_data.value.username = res.username
        form_data.value.full_name = res.full_name
        form_data.value.food_group_id = res.food_group_id
        form_data.value.email = res.email
        form_data.value.salary = res.salary;
    });
  }
});

const form_data = ref({
  username: "",
  full_name: "",
  password: null,
  food_group_id: null,
  confirm_password: null,
  email: "",
  salary: 0
});
const showFoodGroup = ref(false)
const foodGroups = ref([])

const close = () => {
  emits("close");
};

const save = () => {
  if (props.type == "create") {
    ChiefsService.create(form_data.value).then((res) => {
      emits("create", res);
    });
  } else {
    if(!form_data.value['password'] && !form_data.value['confirm_password']) {
      form_data.value['change_password'] = 0;
    } else {
      form_data.value['change_password'] = 1;
    }
    ChiefsService.update(props.id, form_data.value)
      .then((res) => {
        emits("update");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const clickFoodGroup = (row) => {
  showFoodGroup.value = false;
  form_data.value.food_group_id = row.id
}
const createFoodGroup = (data) => {
  foodGroups.value.push(data);
  form_data.value.food_group_id = data.id;
  showFoodGroup.value = false;
}

</script>

<style scoped>
.footer {
  display: flex;
  justify-content: flex-end;
}
</style>
