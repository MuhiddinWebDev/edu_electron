<script setup>
import { ref, onMounted } from 'vue';
import PartiyaService from "../../../services/partiya.service"
import { useFormatnumber, useParsenumber } from "../../../composables/numberFormat.js"
import moment from 'moment'
const props = defineProps(['datetime', 'id']);
const emits = defineEmits(['create'])
const form_data = ref({
    "food_resource_id": null,
    "sana": null,
    "price": 0
})

onMounted(() => {
    form_data.value.debit_date = props.datetime;
    form_data.value.sana = props.datetime;
    form_data.value.food_resource_id = props.id;
})

const submit = () => {
    PartiyaService.create(form_data.value).then((res) => {
        emits('create', res)
    })
}


</script>
<template>
    <div>
        <n-form>
            <n-form-item label="Sana">
                <n-date-picker
                    :value="form_data.sana * 1000"
                    type="datetime"
                    disabled
                    style="width: 100%;"
                />
            </n-form-item>
            <n-form-item label="Narxi">
                <n-input-number :format="useFormatnumber" :parse="useParsenumber" style="width: 100%;" v-model:value="form_data.price">
                </n-input-number>
            </n-form-item>
        </n-form>
        <div style="display: flex; justify-content: flex-end;">
            <n-button @click="submit" type="info" style="width: 80px;">OK</n-button>
        </div>
    </div>

</template>