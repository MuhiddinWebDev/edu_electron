import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useFormDataStore = defineStore('formdata', () => {
    const modalValidations = ref({});
    const sellingTable = ref({})

    const clear = () => {
        modalValidations.value = {}
    }
    return { modalValidations, clear, sellingTable }
})