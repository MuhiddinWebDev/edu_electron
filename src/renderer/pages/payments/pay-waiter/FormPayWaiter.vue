<template>
  <div>
    <n-form>
      <div class="modal__section">
        <n-form-item label="Yaratilgan vaqti">
          <n-date-picker
            :value="form_data.datetime * 1000"
            type="datetime"
            disabled
          />
        </n-form-item>

        <n-form-item label="Ofitsant">
          <n-select
            v-model:value="form_data.waiter_id"
            :options="waiters"
            label-field="username"
            value-field="id"
            :on-update:value="change"
            style="width: 165px"
          />
          <n-button @click="showAddWaiter = true">...</n-button>
        </n-form-item>

        <n-form-item label="Qoldiq">
          <n-input-number
            v-model:value="form_data.ost"
            disabled
            :format="useFormatnumber"
            :parse="useParsenumber"
          ></n-input-number>
        </n-form-item>
      </div>

      <div class="modal__section">
        <n-form-item label="To'lov turi">
          <n-select
            v-model:value="form_data.pay_type"
            :options="payTypes"
            placeholder="Tanlang"
            style="width: 200px"
          />
        </n-form-item>

        <n-form-item label="Summa" style="width: 200px; margin-left: 0px">
          <n-input-number  
            :format="useFormatnumber"
            :parse="useParsenumber" 
            v-model:value="form_data.sum">
          </n-input-number>
        </n-form-item>

        <n-form-item label="Izoh" style="width: 220px">
          <n-input
            v-model:value="form_data.comment"
            type="textarea"
            placeholder="Izoh"
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
    <n-modal v-model:show="showAddWaiter" preset="card" style="width: 800px">
      <IndexWaiter
        @createWaiter="createWaiter"
        @row-click="chooseWaiter"
      ></IndexWaiter>
    </n-modal>
  </div>
</template>

<script setup>
import PayWaiterService from "../../../services/pay-waiter.service";
import WaiterService from "../../../services/waiter.service";
import { ref, onMounted } from "vue";
import IndexWaiter from "../../kirim-docs/waiters/IndexWaiters.vue";
import { useFormatnumber, useParsenumber } from "../../../composables/numberFormat.js"

const props = defineProps(["type", "id"]);
const emits = defineEmits("create", "update", "close");
const waiters = ref([]);
const showAddWaiter = ref(null);

onMounted(() => {
  console.log(props)
  if (props.type == "update" || props.type == "sverka") {
    PayWaiterService.getOne(props.id).then((res) => {
      form_data.value.datetime = res.datetime;
      form_data.value.waiter_id = res.waiter_id;
      form_data.value.pay_type = res.pay_type;
      form_data.value.comment = res.comment;
      form_data.value.sum = res.sum;
      form_data.value.ost = res.ost;
    });
  }

  getAllWaiters();
});

const form_data = ref({
  datetime: Math.floor(new Date().getTime() / 1000),
  waiter_id: null,
  pay_type: null,
  comment: "",
  sum: 0,
  ost: 0,
});

const payTypes = [
  { label: "Naqt", value: "cash" },
  { label: "Plastik", value: "plastic" },
];

const change = (e) => {
  const chief = waiters.value.find((val) => val.id == e);
  form_data.value.waiter_id = e;
  form_data.value.ost += chief.ost;
};

const getAllWaiters = () => {
  WaiterService.getAll().then((res) => {
    waiters.value = res;
  });
};

const close = () => {
  emits("close");
};

const save = () => {
  if (props.type == "create") {
    PayWaiterService.create(form_data.value).then((res) => {
      emits("create");
    });
  } else {
    PayWaiterService.update(props.id, form_data.value)
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
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: flex-end;
}

.modal__section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 20px;
}
</style>
