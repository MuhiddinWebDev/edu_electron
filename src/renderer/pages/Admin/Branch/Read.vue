<script setup>
import { ref, onMounted } from "vue";
import ModelService from "../../../services/branch.service";
import { Exit as ExitIcon } from "@vicons/ionicons5";

const props = defineProps(["type", "id", "defaultname"]);
const emit = defineEmits(["create", "update", "close"]);

const readData = ref({});

const formatUzbekPhoneNumber = (phoneNumber) => {
    if(phoneNumber){
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
      <div class="model-read-row">
        <b>Filial nomi</b>
        <b>{{ readData.name }}</b>
      </div>
      <div class="model-read-row">
        <b>Filial telefon raqami</b>
        <b>{{  '+'+ formatUzbekPhoneNumber(readData.phone)  }}</b>
      </div>
      <div class="model-read-row">
        <b>Viloyat nomi</b>
        <b>{{ readData.region ? readData.region.name : null }}</b>
      </div>
      <div class="model-read-row">
        <b>Shahar nomi</b>
        <b>{{ readData.district ? readData.district.name : null }}</b>
      </div>
      <div class="model-read-row">
        <b>Biriktirilgan</b>
        <b>{{ readData.parent ? readData.parent.name : null }}</b>
      </div>
      <div class="model-read-row" >
        <b>Bosh filial</b>
        <b>{{ readData.folder ? "Xa":"Yo'q" }}</b>
      </div>
      <div class="model-read-row" >
        <b>Izoh</b>
        <b>{{ readData.comment}}</b>
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
</style>
