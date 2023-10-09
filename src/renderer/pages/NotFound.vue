<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
onMounted(()=>{
    router.push({name:'Login'})
})
</script>
<template>
    <div>
        Not found
    </div>
</template>