<template>
  <div>
    <n-form>
      <div class="top_section">
        <n-form-item label="Sana">
          <n-date-picker
            :value="form_data.datetime * 1000"
            type="datetime"
            disabled
          />
        </n-form-item>

        <n-form-item style="width: 200px" label="To'lov turini tanlang">
          <n-select
            v-model:value="form_data.pay_type"
            :options="payTypes"
            placeholder="Tanlang"
            style="width: 200px"
          ></n-select>
        </n-form-item>

        <n-form-item style="width: 200px" label="Taminotchini tanlang">
          <n-select
            v-model:value="form_data.supplier_id"
            label-field="name"
            value-field="id"
            :options="suppliers"
          ></n-select>
          <n-button @click="showAddSupplier = true"> ... </n-button>
        </n-form-item>

        <n-form-item style="width: 200px" label="Taom tarqatish bo'limini tanlang">
          <n-select
            v-model:value="form_data.branch_id"
            label-field="name"
            value-field="id"
            :options="branches"
          ></n-select>
          <n-button @click="showAddBranch = true"> ... </n-button>
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
          <thead>
            <tr>
              <th style="width: 200px;">Mahsulot</th>
              <th style="width: 200px;">Partiya</th>
              <th>Miqdori</th>
              <th>O'lchov birligi</th>
              <th>Narxi</th>
              <th>Summa</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in form_data.doc_debit_table">
              <td style="width: 200px;">
                <n-input-group>
                  <n-select
                    v-model:value="item.food_resource_id"
                    :options="foodResource"
                    label-field="name"
                    value-field="id"
                    filterable
                    clearable
                    @update:value="change(item.id, $event)"
                  />
                  <n-button @click="showAddFoodResource = true, choosedId = item.id">...</n-button>
                </n-input-group>
              </td>
              <td style="width: 270px;">
                <n-input-group>
                  <n-select
                    v-model:value="item.partiya_id"
                    :options="item.partiyes"
                    label-field="sana"
                    value-field="id"
                    :render-label="renderPartiya"
                    :render-tag="renderPartiyaSelect"
                    @update:value="changePartiya(item.id, $event)"
                    :disabled="item.food_resource_id == null"
                    />
                  <n-button :disabled="item.food_resource_id == null" @click="showIndexPartiya = true, choosedFoodResourceId = item.food_resource_id, choosedId=item.id">...</n-button>
                </n-input-group>
              </td>
              <td style="width: 180px">
                <n-input-number
                  @update:value="changeAmount(item.id, $event)"
                  v-model:value="item.amount"
                  clearable
                  :format="useFormatnumber"
                  :parse="useParsenumber" 
                />
              </td>
  
              <td style="width: 200px">
                <n-input v-model:value="item.measure" type="text" disabled />
              </td>
              <td style="width: 150px">
                <n-input-number  :format="useFormatnumber" :parse="useParsenumber"  disabled :show-button="false" v-model:value="item.price" type="text" />
              </td>
              <td style="width: 150px">
                <n-input-number :format="useFormatnumber" :parse="useParsenumber" :show-button="false" :value="item.sum" type="text" disabled />
              </td>
              <td  style="width: 80px; text-align: center;">
                <n-button type="error" @click="removeItem(item.id)">
                  <template #icon>
                    <n-icon size="22">
                      <Trash />
                    </n-icon>
                  </template>
                </n-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="top_section" style="margin-top: 20px">
        <n-form-item label="Umumiy summa">
          <h1>{{ new Intl.NumberFormat('ru-RU').format(form_data.total_sum) }}</h1>
        </n-form-item>
        <n-form-item label="Naqd to'lov" style="width: 300px">
          <n-input-number v-model:value="form_data.cash_sum" :format="useFormatnumber" :parse="useParsenumber" />
        </n-form-item>
        <n-form-item label="Izoh" style="width: 300px">
          <n-input
            v-model:value="form_data.comment"
            type="text"
            placeholder="Izohni kiriting"
          />
        </n-form-item>
      </div>
      <div class="footer" v-if="props.type !== 'sverka'">
        <n-button type="error" @click="close">Bekor qilish</n-button>
        <n-button color="#306EBF" @click="save" style="margin-left: 10px"
          >Saqlash</n-button
        >
      </div>
    </n-form>
    <n-modal v-model:show="showAddSupplier" preset="card" style="width: 800px">
      <IndexSuppliers
        @createSupplier="createSupplier"
        @row-click="chooseSupplier"
      ></IndexSuppliers>
    </n-modal>
    <n-modal v-model:show="showAddFoodResource" preset="card" style="width: 600px;">
      <FoodResourceIndex @rowClick="chooseFoodResource" @createFoodResource="createFoodResource"></FoodResourceIndex>
    </n-modal>
    <n-modal v-model:show="showAddBranch" preset="card" style="width: 800px">
      <IndexBranch
        @createBranch="createBranch"
        @row-click="chooseBranch"
      ></IndexBranch>
    </n-modal>
    <n-modal v-model:show="showIndexPartiya" preset="card" style="width: 400px">
      <PartiyaIndex @createPartiya="createPartiya" :datetime="form_data.datetime" :id="choosedFoodResourceId" @rowClick="rowClickPartiya"/>
    </n-modal>
  </div>
</template>

<script setup>
import DocService from "../../../services/doc_debit.service";
import MeasuresService from "../../../services/measure.service";
import FoodResource from "../../../services/food_resource.service";
import SupplierService from "../../../services/taminotchilar.service";
import BranchService from "../../../services/branch.service";
import PartiyaService from "../../../services/partiya.service";
import { useFormatnumber, useParsenumber } from "../../../composables/numberFormat.js"
import IndexSuppliers from "../suppliers/IndexSuppliers.vue";
import IndexBranch from "../../savdo-docs/branches/IndexBranch.vue";
import FoodResourceIndex from "../raw_materials/IndexRaw_materials.vue";
import PartiyaIndex from "./PartiyaIndex.vue"
import { ref, onMounted, computed, h } from "vue";
import { NButton, NInput, NIcon, NSelect, NInputNumber } from "naive-ui";
import { Plus, Trash } from "@vicons/tabler";
import moment from 'moment'
const props = defineProps(["type", "id"]);
const emits = defineEmits("create", "update", "close");
const measures = ref([]);
const foodResource = ref([]);
const suppliers = ref([]);
const branches = ref([]);
const partiyes = ref([]);
const showAddSupplier = ref(false);
const showAddBranch = ref(false);
const choosedId = ref(null)
const choosedFoodResourceId = ref(null)
const showIndexPartiya = ref(false);
const payTypes = [
  { label: "Naqt", value: "cash" },
  { label: "Plastik", value: "plastic" },
];
const showAddFoodResource = ref(false);
onMounted(() => {
  if (props.type == "update" || props.type == 'sverka') {
    DocService.getOne(props.id).then((res) => {
      form_data.value.cash_sum = Number(res.cash_sum);
      form_data.value.pay_type = res.pay_type;
      form_data.value.comment = res.comment;
      form_data.value.datetime = res.datetime;
      form_data.value.supplier_id = res.supplier.id;
      form_data.value.branch_id = res.branch.id;
      res.doc_debit_table.forEach((item) => {
        PartiyaService.getByFoodResource(item.food_resource.id).then((res) => {
          form_data.value.doc_debit_table.push({
            id: item.id,
            amount: Number(item.amount),
            food_resource_id: item.food_resource.id,
            measure: item.measure.name,
            measure_id: item.measure.id,
            price: Number(item.price),
            sum: Number(item.sum),
            partiya_id: item.partiya_id,
            partiyes: res
          });
        })
      });
    });
  }
  getAllMeasure();
  getAllFoodR();
  getAllSuppliers();
  getAllBranches();
});

const getAllBranches = () => {
  BranchService.getAll().then((res) => {
    branches.value = res;
  });
};

const getAllSuppliers = () => {
  SupplierService.getAll().then((res) => {
    suppliers.value = res;
  });
};
const createFoodResource = (data) => {
  foodResource.value.push(data);
  const index = form_data.value.doc_debit_table.findIndex((val) => val.id == choosedId.value);
  const element = form_data.value.doc_debit_table[index];
  element.measure = data.measure.name;
  element.measure_id = data.measure.id;
  form_data.value.doc_debit_table[index].food_resource_id = data.id;
  form_data.value.doc_debit_table[index].partiyes = []
  showAddFoodResource.value = false;
}
const chooseFoodResource = (row) => {
  const index = form_data.value.doc_debit_table.findIndex((val) => val.id == choosedId.value);
  const element = form_data.value.doc_debit_table[index];
  element.food_resource_id = row.id;
  PartiyaService.getByFoodResource(row.id).then((res) => {
    form_data.value.doc_debit_table[index].partiyes = res;
  })
  element.measure = row.measure.name;
  element.measure_id = row.measure.id;
  showAddFoodResource.value = false;
}
const getAllMeasure = () => {
  MeasuresService.getAll().then((res) => {
    measures.value = res;
  });
};

const getAllFoodR = () => {
  FoodResource.getAll().then((res) => {
    foodResource.value = res;
  });
};

const form_data = ref({
  datetime: Math.floor(new Date().getTime() / 1000),
  comment: "",
  pay_type: null,
  total_sum: 0,
  cash_sum: 0,
  supplier_id: null,
  branch_id: null,
  doc_debit_table: [],
});

const addItem = () => {
  form_data.value.doc_debit_table.push({
    id: new Date().getTime(),
    amount: null,
    food_resource: null,
    measure: null,
    price: null,
    sum: null,
    food_resource_id: null,
    measure_id: null,
    partiya_id: null,
    partiyes: []
  });
};

form_data.value.total_sum = computed(() => {
  let summa = 0;
  form_data.value.doc_debit_table.forEach((val) => {
    summa += +val.sum;
  });
  return summa;
});

const removeItem = (id) => {
  const index = form_data.value.doc_debit_table.findIndex(
    (val) => val.id == id
  );
  form_data.value.doc_debit_table.splice(index, 1);
};

const change = (id, e) => {
  const element = form_data.value.doc_debit_table.find((val) => val.id == id);
  element.food_resource_id = e;
  const el = foodResource.value.find((val) => val.id == e);
  element.measure = el.measure.name;
  element.measure_id = el.measure.id;
  element.sum = element.price * element.amount;
  PartiyaService.getByFoodResource(e).then((res) => {
    element.partiyes = res;
  })
};
const createPartiya = (row) => {
  const element = form_data.value.doc_debit_table.find((val) => val.id == choosedId.value);
  element.partiya_id = row.id;
  element.partiyes.push(row)
  element.price = Number(row.price);
  showIndexPartiya.value = false;
}
const changePartiya = (id, e) => {
  const element = form_data.value.doc_debit_table.find((val) => val.id == id);
  element.partiya_id = e;
  const el = element.partiyes.find((val) => val.id == e);
  element.price = Number(el.price);
  element.sum = Number(el.price) * Number(element.amount);
}
const rowClickPartiya = (row) => {
  const element = form_data.value.doc_debit_table.find((val) => val.id == choosedId.value);
  element.partiya_id = row.id;
  const el = element.partiyes.find((val) => val.id == row.id);
  element.price = Number(el.price);
  showIndexPartiya.value = false;
}
const changeAmount = (id, e) => {
  const element = form_data.value.doc_debit_table.find((val) => val.id == id);
  element.amount = e;
  element.sum = element.price * e;
};

const close = () => {
  emits("close");
};

const save = () => {
  if (props.type == "create") {
    DocService.create(form_data.value).then((res) => {
      emits("create");
    });
  } else {
    DocService.update(props.id, form_data.value)
      .then((res) => {
        console.log(res)
        emits("update");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const chooseSupplier = (row) => {
  form_data.value.supplier_id = row.id;
  showAddSupplier.value = false;
};

const createSupplier = (data) => {
  suppliers.value.push(data);
  form_data.value.supplier_id = data.id;
  showAddSupplier.value = false;
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



//// render select function start
const renderPartiyaSelect = ({ option }) => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
      },
    },
    [moment.unix(option.sana).format('DD.MM.YYYY HH:mm:ss')]
  );
};
const renderPartiya = (option) => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
      },
    },
    [
      h(
        "div",
        {
          style: {
            marginLeft: "12px",
            padding: "4px 0",
          },
        },
        [
          h("div", null, [moment.unix(option.sana).format('DD.MM.YYYY HH:mm:ss')]),
          h("div", null, [
            option.price.toLocaleString("eng-US").replaceAll(',', ' ')
          ]),
        ]
      ),
    ]
  );
};
//// render select function end
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
