<script setup>
import { ref, onMounted } from 'vue';
import { useMessage } from 'naive-ui';
import ClientService from '../../services/client.service';
import OrderService from '../../services/order.service';
const message = useMessage()
import NumericKeyboard from './NumericKeyboard.vue'
const okUrl =  new URL('../../assets/ok.png', import.meta.url).href
import { Trash } from '@vicons/tabler'
import { Add12Regular } from '@vicons/fluent'
const props = defineProps({
    orderId: {
        type: Number,
        default: 0
    }
})
const emits = defineEmits(['pay'])
const clients = ref([])
const getAllClient = () => {
    ClientService.getAll().then((res) => {
        clients.value = res;
    })
}
const pay_data = ref({
    "datetime" : null,
    "pay_sum" : 0,
    "common_service" : 0,
    "common_sum" : 0,
    "all_sum" : 0,
    "cash_sum" : 0,
    "plastic_sum" : 0,
    "comment" : "",
    "status" : null,
    "waiter_id" : null,
    "caisher_id" : null,
    "room_id" : null,
    "client_id" : null,
    "table_id" : null,
    "skidka_sum" : 0,
    "credit_sum" : 0
})
onMounted(() => {
    getAllClient()
    OrderService.getOne(props.orderId).then((res) => {
        pay_data.value.datetime = res.datetime;
        pay_data.value.pay_sum = res.pay_sum;
        pay_data.value.common_service = res.common_service;
        pay_data.value.common_sum = res.common_sum;
        pay_data.value.all_sum = res.all_sum;
        pay_data.value.cash_sum = res.cash_sum;
        pay_data.value.plastic_sum = res.plastic_sum;
        pay_data.value.comment = res.comment;
        pay_data.value.status = res.status;
        pay_data.value.waiter_id = res.waiter_id;
        pay_data.value.caisher_id = res.caisher_id;
        pay_data.value.room_id = res.room_id;
        pay_data.value.client_id = res.client_id;
        pay_data.value.table_id = res.table_id;
        pay_data.value.skidka_sum = res.skidka_sum
        pay_data.value.credit_sum = res.credit_sum
    })
})
const setNaqt = () => {
    const pay_sum = pay_data.value['pay_sum'];
    if(!pay_data.value.client_id) {
        if(!inputValue.value) {
            pay_data.value['cash_sum'] = pay_sum;
            pay_data.value['plastic_sum'] = 0;
    
        } else if(pay_sum >= inputValue.value) {
            pay_data.value['cash_sum'] = inputValue.value;
            pay_data.value['plastic_sum'] = pay_sum - inputValue.value;
            inputValue.value = null;
        } else {
            message.error("To'lov summadan o'tib ketdi!")
        }
    } else {
        if(!inputValue.value) {
            pay_data.value['cash_sum'] = pay_sum;
            pay_data.value['plastic_sum'] = 0;
        } else if(pay_sum >= inputValue.value) {
            const plastic = pay_data.value['plastic_sum'];
            if((inputValue.value + plastic) > pay_sum) {
                pay_data.value['cash_sum'] = inputValue.value;
                pay_data.value['plastic_sum'] = pay_sum - inputValue.value;
            } else {
                pay_data.value['cash_sum'] = inputValue.value;
            }
            inputValue.value = null;
        } else {
            message.error("To'lov summadan o'tib ketdi!")
        }
    }
}

const setPlastic = () => {
    const pay_sum = pay_data.value['pay_sum'];
    if(!pay_data.value.client_id) {
        if(!inputValue.value) {
            pay_data.value['plastic_sum'] = pay_sum;
            pay_data.value['cash_sum'] = 0;
    
        } else if(pay_sum >= inputValue.value) {
            pay_data.value['plastic_sum'] = inputValue.value;
            pay_data.value['cash_sum'] = pay_sum - inputValue.value;
            inputValue.value = null;
        } else {
            message.error("To'lov summadan o'tib ketdi!")
        }
    } else {
        if(!inputValue.value) {
            pay_data.value['plastic_sum'] = pay_sum;
            pay_data.value['cash_sum'] = 0;
        } else if(pay_sum >= inputValue.value) {
            const cash = pay_data.value['cash_sum'];
            if((inputValue.value + cash) > pay_sum) {
                pay_data.value['plastic_sum'] = inputValue.value;
                pay_data.value['cash_sum'] = pay_sum - inputValue.value;
            } else {
                pay_data.value['plastic_sum'] = inputValue.value;
            }
            inputValue.value = null;
        } else {
            message.error("To'lov summadan o'tib ketdi!")
        }
    }
}

const setDiscount = () => {
    if(inputValue.value < pay_data.value['all_sum']) {
        pay_data.value['skidka_sum'] = inputValue.value;
        pay_data.value['pay_sum'] = pay_data.value['common_sum'] - inputValue.value;
        pay_data.value['cash_sum'] = 0;
        pay_data.value['plastic_sum'] = 0;
        inputValue.value = null;
    }
}
const inputValue = ref(null)
const onChangeNumeric = (inp) => {
    inputValue.value = Number(inp)
}


const finish = () => {
    OrderService.payment(props.orderId, pay_data.value).then((res) => {
        emits('pay', res)
    })
}

const showAddClient = ref(false);
import ClientForm from '../savdo-docs/clients/FormClient.vue';
const createClient = (data) => {
    clients.value.push(data);
    pay_data.value.client_id = data.id;
    showAddClient.value = false;
}

</script>

<template>
    <div style="display: flex;flex-direction: column; justify-content: space-between; height: 100%;">
        <n-modal 
            v-model:show="showAddClient"
            preset="card"
            style="width: 400px;"
        >
            <ClientForm type="create" @create="createClient"></ClientForm>
        </n-modal>
        <div class="header">
            <div class="header_item">
                <div class="header_item_caption">
                    Sana    
                </div>
                <div class="header_item_child datetime">
                    <n-date-picker :value="pay_data.datetime * 1000" type="datetime" disabled />
                </div>
            </div>
            <div class="header_item" @click="setDiscount">
                <div class="header_item_caption">
                    Skidka
                </div>
                <div class="header_item_child">
                    {{
                        new Intl.NumberFormat('ru-RU', {
                            style: 'decimal',
                        }).format(pay_data.skidka_sum)
                    }}
                </div>
            </div>
            <div class="header_item">
                <div class="header_item_caption">
                    Umumiy summa
                </div>
                <div class="header_item_child">
                    {{
                        new Intl.NumberFormat('ru-RU', {
                            style: 'decimal',
                        }).format(pay_data.common_sum)
                    }}
                </div>
            </div>
        </div>
        <div class="header">
            <div class="header_item">
                <div class="header_item_caption">
                    Xizmati
                </div>
                <div class="header_item_child">
                    {{
                        new Intl.NumberFormat('ru-RU', {
                            style: 'decimal',
                        }).format(pay_data.common_service)
                    }}
                </div>
            </div>
            <div class="header_item">
                <div class="header_item_caption">
                    Jami summa    
                </div>
                <div class="header_item_child datetime">
                    {{
                        new Intl.NumberFormat('ru-RU', {
                            style: 'decimal',
                        }).format(pay_data.all_sum)
                    }}
                </div>
            </div>
            <div class="header_item">
                <div class="header_item_caption">
                    To'lov
                </div>
                <div class="header_item_child">
                    {{
                        new Intl.NumberFormat('ru-RU', {
                            style: 'decimal',
                        }).format(pay_data.pay_sum)
                    }}
                </div>
            </div>
        </div>
        <div class="content">
            <n-select filterable size="large" placeholder="Klientni tanlang" :options="clients" label-field="name" value-field="id" v-model:value="pay_data.client_id">
                <template #empty>
                    <n-button @click="showAddClient = true" style="width: 100%;">
                        <template #icon>
                            <n-icon>
                                <Add12Regular></Add12Regular>
                            </n-icon>
                        </template>
                        Qo'shish</n-button>
                </template>
            </n-select>
            <n-input-number size="large"  style="margin-left: 10px; width: 100%;font-size: 35px;" v-model:value="inputValue"></n-input-number>
        </div>
        <div class="content_middle">
            <div class="content_middle_left">
                <div class="middle_item">
                    <n-button @click="setNaqt" class="middle_button" color="#195FB0">Naqt</n-button>
                    <div class="middle_value">
                        {{
                            new Intl.NumberFormat('ru-RU', {
                                style: 'decimal',
                            }).format(pay_data.cash_sum)
                        }}
                    </div>
                </div>
                <div class="middle_item">
                    <n-button @click="setPlastic" class="middle_button" color="#195FB0">Plastik</n-button>
                    <div class="middle_value">  
                        {{
                            new Intl.NumberFormat('ru-RU', {
                                style: 'decimal',
                            }).format(pay_data.plastic_sum)
                        }}
                    </div>
                </div>
                <n-input
                    type="textarea"
                    class="comment"
                    v-model:value="pay_data.comment"
                    style="width: 100%; height: 130px; margin-top: 10px;"
                />  
            </div>
            <div class="content_middle_right">
                <NumericKeyboard @onChange="onChangeNumeric" :input="inputValue?.toString()"></NumericKeyboard>
            </div>
        </div>
        <n-button @click="finish" color="#195FB0" style="width: 100px; height: 80px; position: absolute; bottom: 0px;right: 10px; font-size:40px;">
            OK
            <!-- <n-icon size="30" style="margin-left: -19px;margin-top: -15px">
                <img :src="okUrl">
            </n-icon> -->
        </n-button>

    </div>
</template>
<style scoped>
.comment {
    height: 80px;
    width: 200px;
}
.footer {
    display: flex;
    height: 100px;
    align-items: right;
}
.header {
    background-color: #F3F5F6;
    height: 100px;
    width: 100%;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}
.content_middle_right {
    width: 50%;

}
.middle_button {
    width: 30%;
    font-size: 20px;
    height: 60px;
}
.content_middle_left {
    display: flex;
    width: 50%;
    height: 300px;
    flex-direction: column;
    margin-right: 10px;
}
.content_middle {
    height: 300px;
    display: flex;
}
.middle_item {
    display: flex;
    margin-top: 10px;
}
.middle_value {
    border: 2px solid #80bdff!important;
    border-radius: 8px;
    width: 70%;
    text-align: right;
    line-height: 56px;
    font-size: 22px;
}
.content {
    display: flex;
    margin-top: 10px;
}
.header_item {
    text-align: center;
    width: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.header_item_caption {
    color: #195FB0;
    font-weight: bold;
    font-size: 20px;
}
.header_item_child {
    background-color: #fff;
    width: 80%;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 8px;
    font-size: 18px;
}
.datetime {
    width: 110%;
    margin-left: 10px;
}
</style>