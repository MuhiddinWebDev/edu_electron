<script setup>
import { ref, onMounted, inject } from "vue";
import ModelService from "../../../services/users.service";
import { Exit as ExitIcon } from "@vicons/ionicons5";

const props = defineProps(["type", "id"]);
const emit = defineEmits(["create", "update", "close"]);
const img_url = inject('img_url')
const readData = ref({});

const formatUzbekPhoneNumber = (phoneNumber) => {
  if (phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, "");

    // Check if the phone number is valid
    const match = cleaned.match(/^998(\d{2})(\d{3})(\d{4})$/);

    if (match) {
      // Format the phone number as +998 XX YYY YYYY
      return `998 ${match[1]}  ${match[2]}  ${match[3].slice(
        0,
        2
      )} ${match[3].slice(2, 4)}`;
    }

    // If the phone number is not valid, return the original input
    return phoneNumber;
  }
};

onMounted(() => {
  if (props.type == "read") {
    ModelService.getOne(props.id).then((res) => {
      readData.value = res;
    });
  }
});

const exit = () => {
  emit("close");
};

///
</script>
<template>
  <div class="model-read">
    <div class="model-read-image" v-if="readData.image">
      <n-image
        lazy
        width="100"
        height="100"
        :style="{ borderRadius: '50%' }"
        :src="img_url + readData.image"
      >
      </n-image>
    </div>
    <div class="no-image" v-else>
      <div class="no-image_item"><b>Rasm yo'q</b></div>
    </div>
    <div class="model-read-row">
      <b>F.I.O</b>
      <b>{{ readData.fullname }}</b>
    </div>
    <div class="model-read-row">
      <b>Telefon raqami</b>
      <b>{{ "+" + formatUzbekPhoneNumber(readData.phone) }}</b>
    </div>
    <div class="model-read-row">
      <b>Filial nomi</b>
      <b>{{ readData.branch ? readData.branch.name : null }}</b>
    </div>
    <!-- <div class="model-read-row">
      <b>Tili</b>
      <b>{{ readData.lang }}</b>
    </div> -->
    <div class="model-read-row">
      <b>Huquqi</b>
      <b>{{
        readData.role == "User"
          ? "Talaba"
          : readData.role == "Teacher"
          ? "O'qituvchi"
          : readData.role
      }}</b>
    </div>
    <div class="model-read-row">
      <b>Faol</b>
      <b>  <n-button size="small" :type="readData.active ? 'success':'warning'">{{ readData.active ? "Xa" : "Yo'q" }}</n-button> </b>
    </div>

    <div class="btn-action">
      <n-button @click="exit" type="warning">
        <template #icon>
          <exit-icon />
        </template>
        Chiqish
      </n-button>
    </div>
  </div>
</template>

<style scoped>
.btn-action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 15px;
}
.model-read-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0px;
  border-bottom: 2px dotted;
}

.model-read-image {
  display: flex;
  align-items: center;
  justify-content: center;
}
.no-image {
  display: flex;
  align-items: center;
  justify-content: center;
}
.no-image_item {
  padding: 25px 10px;
  border-radius: 50%;
  background: #e4dfdf;
}
</style>
