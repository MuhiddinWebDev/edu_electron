<script setup>
import BranchService from '../../../services/branch.service';
import { ref, onMounted } from 'vue'
const props = defineProps(['type', 'id']);
const emits = defineEmits('create', 'update', 'close')

onMounted(() => {
    if(props.type == 'update') {
        BranchService.getOne(props.id).then((res) => {
            form_data.value.name = res.name
            form_data.value.showMenu = res.showMenu
        })
    }
})




const form_data = ref({
    name: '',
    showMenu: 0,
});
const close = () => {
    emits('close')
}
const save = () => {
    if(props.type == 'create') {
        BranchService.create(form_data.value).then((res) => {
            emits('create')
        })
    } else {
        BranchService.update(props.id, form_data.value).then((res) => {
            emits('update')
        }).catch((err) => {
            console.log(err)
        })
    }
}
</script>

<template>
    <div>
        <n-form>
            <n-form-item label="Name">
                <n-input
                    v-model:value="form_data.name"
                >
                </n-input>
            </n-form-item>
            <n-form-item label="Menyuga chiqarish">
                <n-switch
                    v-model:value="form_data.showMenu"
                    checked-value="1"
                    unchecked-value="0"
                ></n-switch>
            </n-form-item>
                <div class="footer">
                    <n-button type="error" @click="close">Bekor qilish</n-button>
                    <n-button color="#306EBF" @click="save" style="margin-left: 10px">Saqlash</n-button>
                </div>
        </n-form>
    </div>
</template>

<style scoped>
.footer {
    display: flex;
    justify-content: flex-end;
}
</style>