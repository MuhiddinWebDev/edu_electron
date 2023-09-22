<template>
  <div>
    <n-form>
      <n-form-item label="Name">
        <n-input v-model:value="form_data.name"> </n-input>
      </n-form-item>
      <n-form-item label="Xonani tanlang">
        <n-select
          v-model:value="form_data.room_id"
          :options="rooms"
          label-field="name"
          value-field="id"
          filterable
          placeholder="Tanlang"
        ></n-select>
        <n-button @click="showAddRoom = true">...</n-button>
      </n-form-item>

      <n-form-item label="Stullar soni">
        <n-input-number
          style="width: 100%"
          min="0"
          v-model:value="form_data.chair_count"
          :format="useFormatnumber"
          :parse="useParsenumber"
        ></n-input-number>
      </n-form-item>

      <n-form-item label="Service foizi">
        <n-input-number
          style="width: 100%"
          min="0"
          v-model:value="form_data.service_percent"
          :format="useFormatnumber"
          :parse="useParsenumber"
        ></n-input-number>
      </n-form-item>
      <n-form-item label="Faollik">
        <n-switch
          v-model:value="form_data.active"
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
    <n-modal v-model:show="showAddRoom" preset="card" style="width: 600px">
      <IndexRoom
        @createRoom="createRoom"
        @row-click="chooseRoom"
      ></IndexRoom>
    </n-modal>
  </div>
</template>

<script setup>
import { useFormatnumber, useParsenumber } from "../../../composables/numberFormat.js"
import TableService from "../../../services/table.service";
import RoomService from "../../../services/room.service";
import { ref, onMounted } from "vue";
import IndexRoom from "../rooms/IndexRooms.vue";
const props = defineProps(["type", "id"]);
const emits = defineEmits("create", "update", "close");
const rooms = ref([]);
const showAddRoom = ref(false);

onMounted(() => {
  if (props.type == "update") {
    TableService.getOne(props.id).then((res) => {
      form_data.value.name = res.name;
      form_data.value.room_id = res.room_id;
      form_data.value.chair_count = res.chair_count;
      form_data.value.service_percent = res.service_percent;
      form_data.value.active = res.active;
    });
  }
  getRooms();
});

const form_data = ref({
  name: "",
  room_id: null,
  chair_count: null,
  service_percent: null,
  active: 0,
});

const getRooms = () => {
  RoomService.getAll().then((res) => {
    rooms.value = res;
  });
};

const close = () => {
  emits("close");
};

const save = () => {
  if (props.type == "create") {
    TableService.create(form_data.value).then((res) => {
      emits("create", res);
    });
  } else {
    TableService.update(props.id, form_data.value)
      .then((res) => {
        emits("update");
      })
      .catch((err) => {
        console.log(err);
      });
  }
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
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: flex-end;
}
</style>
