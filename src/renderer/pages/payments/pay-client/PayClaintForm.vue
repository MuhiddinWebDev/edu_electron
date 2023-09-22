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
  
          <n-form-item label="Klient">
            <n-select
              v-model:value="form_data.client_id"
              :options="clients"
              label-field="name"
              value-field="id"
              :on-update:value="change"
              style="width: 165px"
            />
            <n-button @click="showAddClient = true">...</n-button>
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
              style="width: 210px"
            />
          </n-form-item>
  
          <n-form-item label="Summa" style="margin-left: 0px">
            <n-input-number :format="useFormatnumber" :parse="useParsenumber" v-model:value="form_data.summa"></n-input-number>
          </n-form-item>
        </div>
  
        <div class="footer" v-if="props.type !== 'sverka'">
          <n-button type="error" @click="close">Bekor qilish</n-button>
          <n-button color="#306EBF" @click="save" style="margin-left: 10px"
            >Saqlash</n-button
          >
        </div>
      </n-form>
      <n-modal v-model:show="showAddClient" preset="card" style="width: 800px">
        <IndexClient
          @createClient="createClient"
          @row-click="chooseClient"
        ></IndexClient>
      </n-modal>
    </div>
  </template>
  
  <script setup>
  import PayClientService from "../../../services/pay-client.service";
  import ClientService from "../../../services/client.service";
  import IndexClient from "../../savdo-docs/clients/IndexClient.vue";
  import { ref, onMounted } from "vue";
  import { useFormatnumber, useParsenumber } from "../../../composables/numberFormat.js"
  const props = defineProps(["type", "id"]);
  const emits = defineEmits("create", "update", "close");
  const clients = ref([]);
  const showAddClient = ref(false);
  
  onMounted(() => {
    if (props.type == "update" || props.type == "sverka") {
      PayClientService.getOne(props.id).then((res) => {
        form_data.value.datetime = res.datetime;
        form_data.value.client_id = res.client_id;
        form_data.value.pay_type = res.pay_type;
        form_data.value.comment = res.comment;
        form_data.value.summa = res.summa;
        form_data.value.ost = res.ost;
      });
    }
    getAllClients();
  });
  
  const form_data = ref({
    datetime: Math.floor(new Date().getTime() / 1000),
    client_id: null,
    pay_type: null,
    comment: "",
    summa: 0,
    ost: 0,
  });
  
  const payTypes = [
    { label: "Naqt", value: "cash" },
    { label: "Plastik", value: "plastic" },
  ];
  
  const change = (e) => {
    const client = clients.value.find((val) => val.id == e);
    form_data.value.client_id = e;
    form_data.value.ost = client.ost?client.ost:0;
  };
  
  const getAllClients = () => {
    ClientService.getAll().then((res) => {
      clients.value = res;
    });
  };
  
  const close = () => {
    emits("close");
  };
  
  const save = () => {
    if (props.type == "create") {
      PayClientService.create(form_data.value).then((res) => {
        emits("create");
      });
    } else {
      PayClientService.update(props.id, form_data.value)
        .then((res) => {
          emits("update");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  
  const chooseClient = (row) => {
    form_data.value.client_id = row.id;
    form_data.value.ost = row.ost?row.ost:0;
    showAddClient.value = false;
  };
  
  const createClient = (data) => {
    clients.value.push(data);
    form_data.value.client_id = data.id;
    form_data.value.ost = 0;
    showAddClient.value = false;
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
  