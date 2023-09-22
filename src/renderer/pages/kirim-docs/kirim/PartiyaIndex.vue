<script setup>
import PartiyaService from "../../../services/partiya.service"
import PartiyaForm from './PartiyaForm.vue';
import { onMounted, ref } from "vue";
const props = defineProps(['id', 'datetime'])
const emits = defineEmits(['rowClick', 'createPartiya'])
const partiyes = ref([])
import moment  from 'moment'
onMounted(() => {
    PartiyaService.getByFoodResource(props.id).then((res) => {
        partiyes.value = res
    })
})
const columns = [
    {
        title: "Pariya",
        key: 'sana',
        render: (_) => {
        return moment(_.sana * 1000).format('MM-DD-YYYY HH:mm:ss')
    },
    },
    {
        title: "Narxi",
        key: 'price',
        render: (_) => {
            return _.price.toLocaleString("eng-US").replaceAll(',', ' ')
        } 
    }
]

const rowProps = (row) => {
  return {
    style: "cursor: pointer",
    onClick: () => {
      emits("rowClick", row);
    },
  };
};

const showPariyaForm = ref(false)
const createPariya = (row) => {
    emits('createPartiya', row)
}


</script>

<template>
    <div style="display: flex;flex-direction: column; align-items: flex-end">
        <n-button style="font-size: 25px" @click="showPariyaForm = true" type="info">+</n-button>
        <n-data-table style="margin-top: 20px;" :columns="columns" :data="partiyes" :rowProps="rowProps">
        </n-data-table>
        <n-modal v-model:show="showPariyaForm" preset="card" style="width: 400px">
            <PartiyaForm @create="createPariya" :id="props.id" :datetime="props.datetime"></PartiyaForm>
        </n-modal>
    </div>
</template>