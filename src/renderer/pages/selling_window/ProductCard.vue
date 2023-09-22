<script setup>
import { inject } from 'vue';
const props = defineProps(['product'])
const imgUrl = inject('img_url');
</script>
<template>
    <div class="product">
        <img style="width: 100px;border-radius: 50%; margin-top: 10px;" :src="imgUrl+props.product.picture" alt="">
        <div class="info">
            <div class="name">
                {{ props.product.name }}
            </div>
            <div class="price">
                {{ new Intl.NumberFormat('ru-Ru', {
                    style: 'decimal',
                }).format(props.product.sell_price)  }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.product {
    border-radius: 10px;
    background-color: #fff;
    border: 2px solid #324b97;
    width: 130px;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}
.info {
    color: #324b97;
}
.name {
    text-align: center;
    padding: 3px;
    box-sizing: border-box;
    line-height: 15px;
    height: 40px;
    margin-top: 4px;
    /* word-break: break-all; */
    overflow: hidden;
    /* border: 1px solid red; */
}
.price {
    text-align: center;
    font-weight: bold;
}
</style>