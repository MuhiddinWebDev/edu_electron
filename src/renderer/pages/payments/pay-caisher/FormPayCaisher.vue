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
  
          <n-form-item label="Kassir">
            <n-select
              v-model:value="form_data.caisher_id"
              :options="caishers"
              label-field="username"
              value-field="id"
              style="width: 165px"
              :on-update:value="changeCaisher"
            />
            <n-button @click="showAddChief = true">...</n-button>
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
            <n-input-number :format="useFormatnumber" :parse="useParsenumber" v-model:value="form_data.sum"></n-input-number>
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
      <n-modal v-model:show="showAddChief" preset="card" style="width: 800px">
        <IndexChief
          @createChief="createChief"
          @row-click="chooseChief"
        ></IndexChief>
      </n-modal>
    </div>
  </template>
  
  <script setup>
  import PayCaisherService from "../../../services/pay-caisher.service";
  import CaisherService from "../../../services/caisher.service";
  import IndexChief from "../../kirim-docs/chiefs/IndexChiefs.vue";
  import { useFormatnumber, useParsenumber } from "../../../composables/numberFormat.js"
  import { ref, onMounted } from "vue";
  const props = defineProps(["type", "id"]);
  const emits = defineEmits("create", "update", "close");
  const caishers = ref([]);
  const showAddChief = ref(false);
  
  onMounted(() => {
    if (props.type == "update" || props.type == "sverka") {
      PayCaisherService.getOne(props.id).then((res) => {
        form_data.value.datetime = res.datetime;
        form_data.value.caisher_id = res.caisher_id;
        form_data.value.pay_type = res.pay_type;
        form_data.value.comment = res.comment;
        form_data.value.sum = res.sum;
        form_data.value.ost = res.ost;
      });
    }
    getAllCaishers();
  });
  
  const form_data = ref({
    datetime: Math.floor(new Date().getTime() / 1000),
    caisher_id: null,
    pay_type: null,
    comment: "",
    sum: 0,
    ost: 0,
  });
  
  const payTypes = [
    { label: "Naqt", value: "cash" },
    { label: "Plastik", value: "plastic" },
  ];
  
  const getAllCaishers = () => {
    CaisherService.getAll().then((res) => {
      caishers.value = res;
    });
  };
  
  const changeCaisher = (e) => {
    const caisher = caishers.value.find((val) => val.id == e);
    form_data.value.caisher_id = e;
    form_data.value.ost = caisher.ost;
  };
  
  const close = () => {
    emits("close");
  };
  
  const save = () => {
    if (props.type == "create") {
      PayCaisherService.create(form_data.value).then((res) => {
        emits("create");
      });
    } else {
      PayCaisherService.update(props.id, form_data.value)
        .then((res) => {
          emits("update");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  
  const chooseChief = (row) => {
    form_data.value.caisher_id = row.id;
    showAddChief.value = false;
  };
  
  const createChief = (data) => {
    caishers.value.push(data);
    form_data.value.caisher_id = data.id;
    showAddChief.value = false;
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
  