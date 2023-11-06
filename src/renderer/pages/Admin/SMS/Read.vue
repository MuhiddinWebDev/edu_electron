<script setup>
import { ref, onMounted, inject } from "vue";
import ModelService from "../../../services/message.service";
// variables
const props = defineProps(["type", "id"]);
const emit = defineEmits(["read"]);
const dayJS = inject('dayJS')
const readData = ref({
  name:"",
  datetime:0
});

const loading = ref(true);
const getOneData = ()=>{
    ModelService.getOne(props.id).then((res)=>{
        readData.value = res;
        loading.value = false;
    })
}
onMounted(() => {
  getOneData()
});


</script>
<template>
  <div class="modal-read">
    <n-spin :show="loading">
      <n-grid :x-gap="12" :y-gap="8" cols="1 s:2 m:3 l:3" responsive="screen">
        <n-grid-item> <b>Sana: </b>{{ dayJS(readData.datetime * 1000).format('YYYY-MM-DD HH:mm:ss') }}</n-grid-item>
        <n-grid-item> <b>Filial: </b> {{ readData.branch ? readData.branch.name:null }}</n-grid-item>
        <n-grid-item> <b>Kimga: </b> {{ readData.name }}</n-grid-item>
      </n-grid>
      <n-divider style="margin: 8px 0px;" title-placement="center" >Xabar matni</n-divider>
      <n-scrollbar style="max-height: 120px;">
        {{ readData.text }}
      </n-scrollbar>
    </n-spin>
  </div>
</template>
