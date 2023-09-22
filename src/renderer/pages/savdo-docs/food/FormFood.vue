<template>
  <div>
    <n-form ref="formRef" :rules="rules" :model="form_data">
      <div class="top_section">
        <n-form-item label="Name" path="name">
          <n-input
            v-model:value="form_data.name"
            style="width: 350px"
          ></n-input>
        </n-form-item>
        <n-form-item style="width: 140px; margin-top: 8px;margin-left: -100px;" label="Rasm yuklash">
          <n-upload v-model:file-list="imageList" :max="1" list-type="image-card">
          </n-upload>
          <n-image style="margin-left: 20px" v-if="props.type == 'update'" width="100" :src="imgUrl+pictureName"></n-image>
        </n-form-item>
        <n-form-item style="width: 300px" label="O'lchov birligini tanlang">
          <n-select
            v-model:value="form_data.measure_id"
            label-field="name"
            value-field="id"
            :options="measures"
          ></n-select>
          <n-button @click="showAddMeasure = true">...</n-button>
        </n-form-item>
      </div>
      <div class="top_section">
        <n-form-item label="Sotuv narxi">
          <n-input-number
            style="width: 350px"
            v-model:value="form_data.sell_price"
            @update:value="changeSellPrice"
            clearable
            :format="useFormatnumber"
            :parse="useParsenumber"
          />
        </n-form-item>
        <n-form-item label="Rangni tanlang">
          <n-color-picker
            style="width: 140px"
            v-model:value="form_data.color"
          />
        </n-form-item>
        <n-form-item label="Taom guruhini tanlang" style="width: 350px">
          <n-select
            v-model:value="form_data.food_group_id"
            label-field="name"
            value-field="id"
            :options="foodGroups"
          ></n-select>
          <n-button @click="showAddFoodGroup = true">...</n-button>
        </n-form-item>
      </div>
      <div class="top_section">
        <n-form-item label="Oshpaz xaqi">
          <n-input-number
            style="width: 350px"
            v-model:value="form_data.chief_percent"
            @update:value="chiefPercent"
            clearable
            :format="useFormatnumber"
            :parse="useParsenumber"
          />
        </n-form-item>
        <n-form-item style="width: 145px" label="Qidirish kodi">
          <n-input
            v-model:value="form_data.search_code"
            type="text"
            placeholder="Qidirish kodi"
          />
        </n-form-item>
        <n-form-item label="Oshpazni tanlang" style="width: 350px">
          <n-select
            v-model:value="form_data.chief_id"
            label-field="full_name"
            value-field="id"
            :options="chiefGroup"
          ></n-select>
          <n-button @click="showAddChief = true">...</n-button>
        </n-form-item>
      </div>
      <div class="top_section1">
        <n-form-item
          style="align-self: flex-start; width: 350px"
          label="Menyuda ko'rsatish"
        >
          <n-switch
            v-model:value="form_data.showMenu"
            :checked-value="1"
            :unchecked-value="0"
          ></n-switch>
        </n-form-item>

        <n-form-item
          style="align-self: flex-start; width: 145px"
          label="Ommabop taomlar"
        >
          <n-switch
            v-model:value="form_data.popularMenu"
            :checked-value="1"
            :unchecked-value="0"
          ></n-switch>
        </n-form-item>

        <n-form-item
          style="align-self: flex-start; width: 350px"
          label="Menyudan faolligni o'chirish"
        >
          <n-switch
            v-model:value="form_data.disableMenu"
            :checked-value="1"
            :unchecked-value="0"
          ></n-switch>
        </n-form-item>
      </div>
      <div style="margin-bottom: 10px">
        <n-button type="info" @click="addItem">
          <template #icon>
            <n-icon size="22">
              <Plus />
            </n-icon>
          </template>
        </n-button>
      </div>
      <div>
        <table id="customers">
          <tr>
            <th style="width: 340px;">Mahsulot</th>
            <th>Miqdori</th>
            <th>O'lchov birligi</th>
            <th style="text-align: center;">Actions</th>
          </tr>

          <tr v-for="item in form_data.food_tables">
            <td style="display: flex">
              <n-select
                v-model:value="item.food_resource_id"
                :options="foodResource"
                label-field="name"
                style="width: 100%;"
                value-field="id"
                @update:value="change(item.id, $event)"
                filterable
              />
              <n-button
                @click="(showAddFoodResource = true), openChooseFR(item.id)"
                >...</n-button
              >
            </td>
            <td style="width: 250px">
              <n-input-number
                v-model:value="item.amount"
                @update:value="changeAmount(item.id, $event)"
                clearable
                :show-button="false"
                :format="useFormatnumber"
                :parse="useParsenumber"
              />
            </td>

            <td style="width: 200px">
              <n-input v-model:value="item.measure" type="text" disabled />
            </td>
            <td style="text-align: center;">
              <n-button type="error" @click="removeItem(item.id)">
                <template #icon>
                  <n-icon size="22">
                    <Trash />
                  </n-icon>
                </template>
              </n-button>
            </td>
          </tr>
        </table>
      </div>
      <div>
        <h3>Kamida bitta mahsulot biriktiring</h3>
      </div>
      <div class="footer">
        <n-button type="error" @click="close">Bekor qilish</n-button>
        <n-button color="#306EBF" @click="save" style="margin-left: 10px"
          >Saqlash</n-button
        >
      </div>
    </n-form>
    <n-modal v-model:show="showAddFoodGroup" preset="card" style="width: 600px">
      <IndexFoodGroup
        @createFoodGroup="createFoodGroup"
        @row-click="chooseFoodGroup"
      ></IndexFoodGroup>
    </n-modal>

    <n-modal v-model:show="showAddMeasure" preset="card" style="width: 600px">
      <IndexMeasure
        @createMeasure="createMeasure"
        @row-click="chooseMeasure"
      ></IndexMeasure>
    </n-modal>

    <n-modal v-model:show="showAddChief" preset="card" style="width: 800px">
      <IndexChief
        @createChief="createChief"
        @row-click="chooseChief"
      ></IndexChief>
    </n-modal>

    <n-modal
      v-model:show="showAddFoodResource"
      preset="card"
      style="width: 800px"
    >
      <IndexFoodResource
        @createFoodResource="createFoodResource"
        @row-click="chooseFoodResource"
      ></IndexFoodResource>
    </n-modal>
  </div>
</template>

<script setup>
import FoodService from "../../../services/food.service";
import { useFormatnumber, useParsenumber } from "../../../composables/numberFormat.js"
import MeasuresService from "../../../services/measure.service";
import FoodGroupService from "../../../services/food-group.service";
import ChiefService from "../../../services/chief.service";
import FoodResource from "../../../services/food_resource.service";
import { ref, onMounted, computed, inject } from "vue";
import IndexFoodGroup from "../food-group/IndexFoodGroup.vue";
import IndexChief from "../../kirim-docs/chiefs/IndexChiefs.vue";
import IndexFoodResource from "../../kirim-docs/raw_materials/IndexRaw_materials.vue";
import { NButton, NInput, NIcon, NSelect, NInputNumber } from "naive-ui";
import { Plus, Trash } from "@vicons/tabler";
import { useMessage } from "naive-ui";
import IndexMeasure from "../../kirim-docs/measure/IndexMeasure.vue";
const props = defineProps(["type", "id"]);
const emits = defineEmits("create", "update", "close");
const measures = ref([]);
const foodGroups = ref([]);
const chiefGroup = ref([]);
const foodResource = ref([]);
const showAddFoodGroup = ref(false);
const showAddMeasure = ref(false);
const showAddChief = ref(false);
const showAddFoodResource = ref(false);
const imgUrl = inject('img_url');
const message = useMessage();
const formRef = ref(null);
const pictureName = ref('');
onMounted(() => {
  if (props.type == "update") {
    FoodService.getOne(props.id).then((res) => {
      form_data.value.name = res.name;
      form_data.value.measure_id = res.measure_id;
      form_data.value.sell_price = Number(res.sell_price);
      form_data.value.food_group_id = res.food_group_id;
      form_data.value.color = res.color;
      pictureName.value = res.picture;
      form_data.value.chief_id = res.chief_id;
      form_data.value.popularMenu = res.popularMenu;
      form_data.value.disableMenu = res.disableMenu;
      form_data.value.search_code = res.search_code;
      form_data.value.chief_percent = res.chief_percent;
      form_data.value.profit_percent = res.profit_percent;
      form_data.value.showMenu = res.showMenu;
      form_data.value.chief = res.chief;
      console.log(res);
      res.food_tables.forEach((item) => {
        form_data.value.food_tables.push({
          id: item.id,
          amount: Number(item.amount),
          food_resource_id: item.food_resource_id,
          measure_id: item.measure.id,
          measure: item.measure.name,
          food_id: item.food_id,
        });
      });
    });
  }
  getAllChief();
  getAllMeasure();
  getAllFoodGroup();
  getAllFoodR();
});

const getAllFoodGroup = () => {
  FoodGroupService.getAll().then((res) => {
    foodGroups.value = res;
  });
};

const getAllMeasure = () => {
  MeasuresService.getAll().then((res) => {
    measures.value = res;
  });
};

const getAllChief = () => {
  ChiefService.getAll().then((res) => {
    chiefGroup.value = res;
  });
};

const getAllFoodR = () => {
  FoodResource.getAll().then((res) => {
    foodResource.value = res;
  });
};

const form_data = ref({
  name: "",
  measure_id: null,
  sell_price: 0,
  food_group_id: null,
  color: "",
  chief_id: null,
  popularMenu: 0,
  disableMenu: 0,
  search_code: "",
  chief_percent: 0,
  chief: "",
  showMenu: 0,
  food_tables: [],
  chief_money: 0,
});
const imageList = ref([])
const addItem = () => {
  form_data.value.food_tables.push({
    id: new Date().getTime(),
    amount: null,
    food_resource_id: null,
    food_resource: [],
    measure_id: null,
    measure: "",
    food_id: null,
  });
};


const removeItem = (id) => {
  const index = form_data.value.food_tables.findIndex((val) => val.id == id);
  form_data.value.food_tables.splice(index, 1);
};

const change = (id, e) => {
  const element = form_data.value.food_tables.find((val) => val.id == id);
  element.food_resource_id = e;
  const el = foodResource.value.find((val) => val.id == e);
  element.measure = el.measure.name;
  element.measure_id = el.measure.id;
};

const changeAmount = (id, e) => {
  const element = form_data.value.food_tables.find((val) => val.id == id);
  element.amount = e;
  element.sum = element.amount * element.purchase_price;
};

const changeSellPrice = (e) => {
  form_data.value.sell_price = e;
  if (form_data.value.total_sum > 0)
    form_data.value.profit_percent = (
      100 *
      ((e - form_data.value.total_sum) / form_data.value.total_sum)
    ).toFixed(2);
  form_data.value.chief_money = (e * form_data.value.chief_percent) / 100;
};

const changeProfitPercent = (e) => {
  form_data.value.profit_percent = e;
  if (form_data.value.total_sum > 0)
    form_data.value.sell_price = (
      (e * form_data.value.total_sum) / 100 +
      form_data.value.total_sum
    ).toFixed(2);
  form_data.value.chief_money =
    (form_data.value.sell_price * form_data.value.chief_percent) / 100;
};

const chiefPercent = (e) => {
  form_data.value.chief_percent = e;
  form_data.value.chief_money = Number((form_data.value.sell_price / 100) * e);
};


const close = () => {
  emits("close");
  message.warning("Bekor qilindi");
};

const save = async () => {
  try {
    const result = await formRef.value?.validate();
    const formData = new FormData()
    formData.append('name', form_data.value.name)
    formData.append('picture', form_data.value.picture)
    formData.append('measure_id', form_data.value.measure_id)
    formData.append('sell_price', form_data.value.sell_price)
    formData.append('food_group_id', form_data.value.food_group_id)
    formData.append('color', form_data.value.color)
    formData.append('chief_id', form_data.value.chief_id)
    formData.append('showMenu', form_data.value.showMenu)
    formData.append('popularMenu', form_data.value.popularMenu)
    formData.append('disableMenu', form_data.value.disableMenu)
    formData.append('search_code', form_data.value.search_code)
    formData.append('chief_percent', form_data.value.chief_percent)
    for (let index = 0; index < form_data.value.food_tables.length; index++) {
      const element = form_data.value.food_tables[index]
      formData.append(`food_tables[${index}][food_resource_id]`, element.food_resource_id )
      formData.append(`food_tables[${index}][measure_id]`, element.measure_id)
      formData.append(`food_tables[${index}][amount]`, element.amount)
    }
    
    if(imageList.value.length > 0) {
      formData.append('change_img', 1);
      formData.append('picture', imageList.value[0].file);
    } else {
      formData.append(' ', 0);
    }
    if (props.type == "create") {
      FoodService.create(formData).then((res) => {
        emits("create", res);
        message.success("Muvaffaqqiyatli");
      });
    } else {
      FoodService.update(props.id, formData)
        .then((res) => {
          emits("update");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } catch (error) {}
};

const chooseFoodGroup = (row) => {
  form_data.value.food_group_id = row.id;
  showAddFoodGroup.value = false;
};

const createFoodGroup = (data) => {
  foodGroups.value.push(data);
  form_data.value.food_group_id = data.id;
  showAddFoodGroup.value = false;
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

const createChief = (data) => {
  chiefGroup.value.push(data);
  form_data.value.chief_id = data.id;
  showAddChief.value = false;
};

const chooseChief = (row) => {
  form_data.value.chief_id = row.id;
  showAddChief.value = false;
};

const chooseFoodResource = (row) => {
  const index = form_data.value.food_tables.findIndex(
    (val) => val.id == choosedFR.value
  );
  form_data.value.food_tables[index].food_resource_id = row.id;
  form_data.value.food_tables[index].measure = row.measure.name;
  form_data.value.food_tables[index].measure_id = row.measure_id;
  form_data.value.food_tables[index].purchase_price = row.purchase_price;
  showAddFoodResource.value = false;
};

const choosedFR = ref(null);
const openChooseFR = (id) => {
  choosedFR.value = id;
};

const createFoodResource = (data) => {
  foodResource.value.push(data);
  const index = form_data.value.food_tables.findIndex(
    (val) => val.id == choosedFR.value
  );
  form_data.value.food_tables[index].food_resource_id = data.id;
  form_data.value.food_tables[index].measure = data.measure.name;
  form_data.value.food_tables[index].measure_id = data.measure.id;
  showAddFoodResource.value = false;
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
};
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: flex-end;
}

.top_section {
  display: flex;
  column-gap: 10px;
  align-items: center;
  justify-content: space-between;
}

.top_section1 {
  display: flex;
  column-gap: 10px;
  align-items: center;
  justify-content: space-between;
}

#customers {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

#customers td,
#customers th {
  border: 1px solid #ddd;
  padding: 8px;
}

#customers th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #04aa6d;
  color: white;
}
</style>
