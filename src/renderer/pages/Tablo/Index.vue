<script setup>
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useCurrentTime } from '../selling_window/useCurrentTime'
import OrderService from '../../services/order.service';
import moment from 'moment';
import SocketService from '../../socket/socket.js'
import { AccessTimeOutlined, TimerOutlined, CheckCircleOutlined, BackspaceOutlined } from '@vicons/material'
const audioUrl = '../../assets/sound.wav'
const { currentTime } = useCurrentTime()
const router = useRouter();
const say  = () => {
    let audio = new Audio(audioUrl);
    audio.play()
}

const orders = ref([])
const orderReadies = ref([])
SocketService.socket.on('readyToTablo', (data) => {
    const indexOrd = orders.value.findIndex((val) => val.id == data.id)
    orders.value.splice(indexOrd, 1)
    orderReadies.value.push(data)
    let audio = new Audio(audioUrl);
    audio.play()
})
SocketService.socket.on('newOrderToTablo', (data) => {
    orders.value.push(data);
    let audio = new Audio(audioUrl);
    audio.play()
})
SocketService.socket.on('removeReady', (data) => {
    const index = orderReadies.value.findIndex((val) => val.id == data.id)
    orderReadies.value.splice(index, 1)
})

onMounted(() => {
    OrderService.getAll().then((res) => {
        res.forEach(element => {
            if(element.status == 'ready') {
                orderReadies.value.push(element);
            } else {
                orders.value.push(element)
            }
        });
    })
})


</script>

<template>
    <div>
        <div class="header">
            <div class="time">
                <n-icon size="35">
                    <AccessTimeOutlined></AccessTimeOutlined>
                </n-icon>
                <span style="margin-left: 10px; font-size: 25px;">
                    {{currentTime.toLocaleTimeString()}}
                </span>
            </div>
            <n-button @click="router.go(-1)" type="error">
                <template #icon>
                    <BackspaceOutlined></BackspaceOutlined>
                </template>
            </n-button>
        </div>
        <div class="content">
            <div class="content_left">
                <div class="left_title">
                    <n-icon size="40">
                        <AccessTimeOutlined></AccessTimeOutlined>
                    </n-icon>
                    Tayyorlanmoqda
                </div>
                <div class="items">
                    <div class="left-item" v-for="ord in orders">
                        <span style="border-radius: 50%; margin-bottom: 42px; ">{{ ord.id }}</span>
                        <div class="datas">
                            <span >{{ moment(ord.datetime * 1000).format("HH:mm:ss") }}</span>
                            <span style="font-size: 40px; margin-top: -10px;width: 100%; height: 50px; overflow: hidden;">{{ ord.table.name }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content_right">
                <div class="right_title">
                    <n-icon size="40">
                        <CheckCircleOutlined></CheckCircleOutlined>
                    </n-icon>
                    Tayyor
                </div>
                <div class="items">
                    <div class="right-item" v-for="ord in orderReadies">
                        <span style="border-radius: 50%; margin-bottom: 42px;">{{ ord.id }}</span>
                        <div class="datas">
                            <span>{{ moment(ord.datetime * 1000).format("HH:mm:ss") }}</span>
                                <span style="font-size: 40px; margin-top: -10px;width: 100%; height: 50px; overflow: hidden;">
                                {{ ord.table.name }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.content {
    height: calc(100vh - 100px);
    display: flex;
    justify-content: space-between;
}
.left_title {
    color: #fff;
    display: flex;
    align-items: center;
}
.content_left {
    height: calc(100vh - 50px);
    width: 50%;
    background-color: #2573a0;
    border: 3px dashed #e8e9ea;
    justify-content: left;
}
.content_right {
    width: 50%;
    height: calc(100vh - 50px);
    margin-left: 10px;
    background-color: #4cd137;
    border: 3px dashed #fff;
}
.items {
    overflow: scroll;
    max-height: calc(100vh - 130px);
    border-top: 2px solid #fff;;
    display: grid;
    grid-template-columns: 30% 30% 30%;
    gap: 20px;
}
.items::-webkit-scrollbar{
    display: none;
}
.time {
    display: flex;
    align-items: center;
}
.content_left, .content_right {
    padding: 10px;
}
.left-item {
    display: flex;
    align-items: center;
    justify-content: left;
    color: white;
    border-top: 2px solid #eee;
    font-size: 20px;
    background-color: #3A98B9;
    height: 100px;
    padding: 0px 20px;
    border-radius: 10px;
    margin-top: 10px;
    /* width: 30%; */
}
.datas {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
}
.right-item {
    display: flex;
    align-items: center;
    justify-content: left;
    color: white;
    border-top: 2px solid #eee;
    font-size: 20px;
    background-color: #44bd32;
    height: 100px;
    padding: 0px 20px;
    border-radius: 10px;
    margin-top: 10px;
    /* width: 30%;/ */
}
.left_title, .right_title {
    font-size: 25px;
    color: white;
    display: flex;
    align-items: center;
    padding: 5px;
    font-weight: bold;
}

</style>