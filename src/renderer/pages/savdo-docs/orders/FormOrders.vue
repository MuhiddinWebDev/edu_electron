<template>
  <div>
    <n-form>
      <div class="d-flex">
        <n-form-item label="Yaratilgan sana">
          <n-date-picker
            :value="form_data.datetime * 1000"
            type="datetime"
            disabled
            style="width: 300px"
          />
        </n-form-item>
        <n-form-item label="Mijozni tanlang">
          <n-select
            v-model:value="form_data.client_id"
            style="width: 265px"
            label-field="name"
            value-field="id"
            :options="clients"
          />
          <n-button @click="showAddClient = true">...</n-button>
        </n-form-item>
        <n-form-item label="Afitsantni tanlang">
          <n-select
            v-model:value="form_data.waiter_id"
            style="width: 265px"
            label-field="full_name"
            value-field="id"
            :options="waiters"
          />
          <n-button @click="showAddWaiter = true">...</n-button>
        </n-form-item>
      </div>

      <div class="d-flex">
        <n-form-item label="Xonani tanlang">
          <n-select
            v-model:value="form_data.room_id"
            style="width: 265px"
            label-field="name"
            value-field="id"
            :options="rooms"
          />
          <n-button @click="showAddRoom = true">...</n-button>
        </n-form-item>

        <n-form-item label="Stolni tanlang">
          <n-select
            v-model:value="form_data.table_id"
            style="width: 265px"
            label-field="name"
            value-field="id"
            :options="tables"
          />
          <n-button @click="showAddTable = true">...</n-button>
        </n-form-item>
        <n-form-item label="Status">
          <n-select
            style="width: 300px"
            v-model:value="form_data.status"
            :options="status"
          />
        </n-form-item>
      </div>
      <div class="d-flex">
        <n-form-item label="Umumiy summa">
          <n-input-number
            v-model:value="form_data.common_sum"
            clearable
            style="width: 300px"
            :format="useFormatnumber"
            :parse="useParsenumber"
          />
        </n-form-item>

        <n-form-item label="Plastik">
          <n-input-number
            v-model:value="form_data.plastic_sum"
            clearable
            style="width: 300px"
            :format="useFormatnumber"
            :parse="useParsenumber"
          />
        </n-form-item>

        <n-form-item label="Naqt">
          <n-input-number
            v-model:value="form_data.cash_sum"
            clearable
            style="width: 300px"
            :format="useFormatnumber"
            :parse="useParsenumber"
          />
        </n-form-item>
      </div>

      <div class="d-flex">
        <n-form-item label="To'lov summa">
          <n-input-number
            v-model:value="form_data.pay_sum"
            clearable
            :format="useFormatnumber"
            :parse="useParsenumber"
            style="width: 300px"
          />
        </n-form-item>
        <n-form-item label="Umumiy xizmat">
          <n-input-number
            v-model:value="form_data.common_service"
            clearable
            style="width: 300px"
            :format="useFormatnumber"
            :parse="useParsenumber"
          />
        </n-form-item>
        <n-form-item label="Chegirma">
          <n-input-number
            v-model:value="form_data.skidka_sum"
            clearable
            style="width: 300px"
            :format="useFormatnumber"
            :parse="useParsenumber"
          />
        </n-form-item>
      </div>

      <div class="d-flex">
        <n-form-item label="Qarz">
          <n-input-number
            v-model:value="form_data.credit_sum"
            style="width: 300px"
            clearable
            :format="useFormatnumber"
            :parse="useParsenumber"
          />
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
            <th>Taom</th>
            <th>Miqdori</th>
            <th>Birligi</th>
            <th>Narxi</th>
            <th>Summa</th>
            <th>Status</th>
            <th>Izoh</th>
            <th>Actions</th>
          </tr>

          <tr v-for="of in form_data.order_food" :key="of.id">
            <td style="width: 210px; display: flex">
              <n-select
                :value="of.food_id"
                :options="food"
                label-field="name"
                value-field="id"
                @update:value="change(of.id, $event)"
              />
              <n-button @click="(ShowAddFood = true), openChooseFood(of.id)"
                >...</n-button
              >
            </td>
            <td style="width: 200px">
              <n-input-number
                v-model:value="of.amount"
                @update:value="changeAmount(of.id, $event)"
                clearable
                :format="useFormatnumber"
                :parse="useParsenumber"
              />
            </td>
            <td style="width: 100px">
              <n-input :value="of.measure" type="text" disabled />
            </td>
            <td style="width: 100px">
              <n-input-number
                v-model:value="of.sell_price"
                :show-button="false"
                disabled
                :format="useFormatnumber"
                :parse="useParsenumber"
              />
            </td>
            <td style="width: 100px">
              <n-input-number
                type="number"
                :value="of.sum"
                :show-button="false"
                disabled
                :format="useFormatnumber"
                :parse="useParsenumber"
              />
            </td>
            <td style="width: 200px">
              <n-select v-model:value="of.status" :options="tableStatus" />
            </td>
            <td style="width: 150px">
              <n-input v-model:value="of.comment" type="text" />
            </td>
            <td>
              <n-button type="error" @click="removeItem(of.id)">
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
        <h3 style="margin-top: 10px;">Umumiy summa</h3>
        <h1 style="margin-top: 10px;">
          {{
            new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
              form_data.all_sum
            )
          }}
        </h1>
      </div>

      <div style="margin: 10px 0">
        <n-input
          v-model:value="form_data.comment"
          type="text"
          placeholder="Izoh"
        />
      </div>
      <div class="footer" >
        <n-button v-if="props.type !== 'sverka'" type="error" @click="close">Bekor qilish</n-button>
        <n-button v-if="props.type !== 'sverka'" color="#306EBF" @click="save" style="margin-left: 10px"
          >Saqlash</n-button
        >
        <n-button v-if="props.type === 'sverka'" @click="close" type="error" style="font-size: 14px; width: 100px;">
          <template #icon>
            <n-icon>
              <CloseRound></CloseRound>
            </n-icon>
            Yopish
          </template>
        </n-button>
      </div>

    </n-form>
    <n-modal v-model:show="showAddWaiter" preset="card" style="width: 800px">
      <IndexWaiter
        @createWaiter="createWaiter"
        @row-click="chooseWaiter"
      ></IndexWaiter>
    </n-modal>

    <n-modal v-model:show="showAddRoom" preset="card" style="width: 800px">
      <IndexRoom @createRoom="createRoom" @row-click="chooseRoom"></IndexRoom>
    </n-modal>

    <n-modal v-model:show="showAddTable" preset="card" style="width: 800px">
      <IndexTable
        @createRoom="createTable"
        @row-click="chooseTable"
      ></IndexTable>
    </n-modal>

    <n-modal v-model:show="showAddClient" preset="card" style="width: 800px">
      <IndexClient
        @createClient="createClient"
        @row-click="chooseClient"
      ></IndexClient>
    </n-modal>

    <n-modal v-model:show="ShowAddFood" preset="card" style="width: 800px">
      <IndexFood
        :show-child="false"
        @createFood="createFood"
        @row-click="chooseFood"
      ></IndexFood>
    </n-modal>
  </div>
</template>

<script setup>
import OrderService from "../../../services/order.service";
import WaiterService from "../../../services/waiter.service";
import { useFormatnumber, useParsenumber } from "../../../composables/numberFormat.js"
import RoomService from "../../../services/room.service";
import FoodService from "../../../services/food.service";
import TablesService from "../../../services/table.service";
import ClientsService from "../../../services/client.service";
import IndexWaiter from "../../kirim-docs/waiters/IndexWaiters.vue";
import IndexRoom from "../../savdo-docs/rooms/IndexRooms.vue";
import IndexTable from "../../savdo-docs/tables/IndexTables.vue";
import IndexClient from "../../savdo-docs/clients/IndexClient.vue";
import IndexFood from "../../savdo-docs/food/IndexFood.vue";
import { ref, onMounted, computed } from "vue";
import { CloseRound } from '@vicons/material'
import moment from "moment";
import { Plus, Trash } from "@vicons/tabler";
import {
  NButton,
  NInput,
  NIcon,
  NSelect,
  NInputNumber,
  NDatePicker,
} from "naive-ui";

const props = defineProps(["type", "id"]);
const emits = defineEmits("create", "update", "close");
const thisTime = ref(new Date());
const waiters = ref([]);
const rooms = ref([]);
const tables = ref([]);
const clients = ref([]);
const food = ref([]);
const showAddWaiter = ref(false);
const showAddRoom = ref(false);
const showAddTable = ref(false);
const showAddClient = ref(false);
const ShowAddFood = ref(false);

const status = ref([
  { label: "Yaratilgan", value: "created" },
  { label: "To'lovda", value: "pay" },
  { label: "Tugallangan", value: "completed" },
  { label: "Bekor qilingan", value: "cancel" },
]);

const tableStatus = ref([
  { label: "Kutilmoqda", value: "waiting" },
  { label: "Jo'natilgan", value: "sending" },
  { label: "Tayyorlanmoqda", value: "processing" },
  { label: "Tugallangan", value: "completed" },
  { label: "Bekor qilingan", value: "cancel" },
]);

onMounted(() => {
  if (props.type == "update" || props.type == "sverka") {
    OrderService.getComplete(props.id).then((res) => {
      form_data.value.pay_sum = res.pay_sum;
      form_data.value.branch = res.branch;
      form_data.value.cash_sum = res.cash_sum;
      form_data.value.credit_sum = res.credit_sum;
      form_data.value.client = res.client;
      form_data.value.comment = res.comment;
      form_data.value.common_service = res.common_service;
      form_data.value.common_sum = res.common_sum;
      form_data.value.datetime = res.datetime;
      form_data.value.order_food = res.order_food;
      form_data.value.pay_sum = res.pay_sum;
      form_data.value.plastic_sum = res.plastic_sum;
      form_data.value.room = res.room;
      form_data.value.skidka_sum = res.skidka_sum;
      form_data.value.status = res.status;
      form_data.value.table = res.table;
      form_data.value.waiter_id = res.waiter_id;
      form_data.value.waiter = res.waiter;
      form_data.value.branch_id = res.branch_id;
      form_data.value.room_id = res.room_id;
      form_data.value.table_id = res.table_id;
      form_data.value.client_id = res.client_id;
      form_data.value.order_food = [];
      res.order_food.forEach((item) => {
        form_data.value.order_food.push({
          id: item.id,
          amount: item.amount,
          body_price: item.body_price,
          sum: item.sum,
          food_id: item.food_id,
          status: item.status,
          comment: item.comment,
          sell_price: item.sell_price,
          measure_id: item.measure.id,
          measure: item.measure.name,
        });
      });
    });
  }
  momentFunc();
  getAllWaiter();
  getAllRooms();
  getAllTables();
  getAllClients();
  getAllFood();
});

const form_data = ref({
  all_sum: null,
  pay_sum: null,
  branch: null,
  waiter_id: null,
  cash_sum: null,
  credit_sum: null,
  client: null,
  comment: null,
  common_service: null,
  common_sum: null,
  datetime: Math.floor(new Date() / 1000),
  pay_sum: null,
  plastic_sum: null,
  room: null,
  skidka_sum: null,
  status: null,
  table: null,
  waiter: null,
  branch_id: null,
  room_id: null,
  table_id: null,
  client_id: null,
  order_food: [],
});

const addItem = () => {
  form_data.value.order_food.push({
    id: Math.floor(new Date().getTime() / 1000),
    amount: 0,
    sum: 0,
    food_id: null,
    status: null,
    comment: "",
    sell_price: 0,
    measure_id: null,
    measure: "",
  });
};

const change = (id, e) => {
  const element = form_data.value.order_food.find((val) => val.id == id);
  element.food_id = e;
  const el = food.value.find((val) => val.id == e);
  element.measure = el.measure.name;
  element.measure_id = el.measure.id;
  element.sell_price = el.sell_price;
  element.sum = element.sell_price * element.amount;
};

const changeAmount = (id, e) => {
  const element = form_data.value.order_food.find((val) => val.id == id);
  element.amount = e;
  element.sum = element.sell_price * element.amount;
};

const removeItem = (id) => {
  const index = form_data.value.order_food.findIndex((val) => val.id == id);
  form_data.value.order_food.splice(index, 1);
};

form_data.value.all_sum = computed(() => {
  let summa = 0;
  form_data.value.order_food.forEach((val) => {
    summa += +val.sum;
  });
  return summa;
});

const getAllFood = () => {
  FoodService.getAll().then((res) => {
    food.value = res;
  });
};

const getAllWaiter = () => {
  WaiterService.getAll().then((res) => {
    waiters.value = res;
  });
};

const getAllRooms = () => {
  RoomService.getAll().then((res) => {
    rooms.value = res;
  });
};

const getAllTables = () => {
  TablesService.getAll().then((res) => {
    tables.value = res;
  });
};

const getAllClients = () => {
  ClientsService.getAll().then((res) => {
    clients.value = res;
  });
};

const momentFunc = () => {
  thisTime.value = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
};

const close = () => {
  emits("close");
};

const save = () => {
  if (props.type == "create") {
    const branch_id = rooms.value.find(
      (val) => val.id == form_data.value.room_id
    ).branch_id;
    form_data.value["branch_id"] = branch_id;
    OrderService.create(form_data.value).then((res) => {
      emits("create");
    });
  } else {
    OrderService.update(props.id, form_data.value)
      .then((res) => {
        emits("update");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const chooseWaiter = (row) => {
  form_data.value.waiter_id = row.id;
  showAddWaiter.value = false;
};

const createWaiter = (data) => {
  waiters.value.push(data);
  form_data.value.waiter_id = data.id;
  showAddWaiter.value = false;
};

const chooseRoom = (row) => {
  form_data.value.room_id = row.id;
  showAddRoom.value = false;
};

const createRoom = (data) => {
  rooms.value.push(data);
  form_data.value.room_id = data.id;
  showAddRoom.value = false;
};

const chooseTable = (row) => {
  form_data.value.table_id = row.id;
  showAddRoom.value = false;
};

const createTable = (data) => {
  tables.value.push(data);
  form_data.value.table_id = data.id;
  showAddRoom.value = false;
};

const chooseClient = (row) => {
  form_data.value.client_id = row.id;
  showAddClient.value = false;
};

const createClient = (data) => {
  clients.value.push(data);
  form_data.value.client_id = data.id;
  showAddClient.value = false;
};

const chooseFood = (row) => {
  const index = form_data.value.order_food.findIndex(
    (val) => val.id == choosedFood.value
  );
  form_data.value.order_food[index].food_id = row.id;
  ShowAddFood.value = false;
};

const choosedFood = ref(null);
const openChooseFood = (id) => {
  choosedFood.value = id;
};

const createFood = (data) => {
  food.value.push(data);
  const index = form_data.value.order_food.findIndex(
    (val) => val.id == choosedFood.value
  );
  form_data.value.order_food[index].food_id = data.id;
  ShowAddFood.value = false;
};
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: flex-end;
}

.d-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
