<script setup>
import { ref, onMounted, inject, watch, reactive, computed, h } from 'vue';
import { useRoute } from 'vue-router';
import { NButton, useMessage, NTag } from 'naive-ui'
import OrderService from '../../services/order.service';
import { useCurrentTime } from './useCurrentTime'
import FoodGroup from '../../services/food-group.service';
import BranchService from '../../services/branch.service';
import { ArrowBigLeft as LeftMain } from '@vicons/tabler'
import { Home, Clock, BrandPaypal, InfoCircle, Star } from '@vicons/tabler'
import { Heart as FavoriteFilled, ArrowUpCircle, Urgent,  } from '@vicons/tabler'
import { LayoutGridAdd as MobileAdd } from '@vicons/tabler'
import { Search, ArrowBackUp } from '@vicons/tabler'
import { PrintOutlined, CloseOutlined, PlusFilled, MinusFilled, ArrowBackFilled, HomeTwotone, SearchRound, SendFilled } from '@vicons/material'
import { useRouter } from 'vue-router'
import SimpleKeyboard from './SimpleKeyboard.vue'
import NumericKeyboard from './NumericKeyboard.vue'
import  { orderStore } from '../../stores/order';
import FoodService from '../../services/food.service';
const imgUrl = inject('img_url');
const message = useMessage()
const { currentTime } = useCurrentTime()
const food_groups = ref([]);
const branches = ref([]);
const tableId = ref(null)
const parentIds = ref([]);
const foods = ref([]);
const route = useRoute();
const router = useRouter();
const order_store = orderStore()
const getAllBranches = () => {
    BranchService.getAll().then((res) => {
        branches.value = res;
        if(branches.value.length > 0) {
            tabValue.value = branches.value[0].id;
            clickBranch(branches.value[0].id)
        }
    })
}
const waiterInfo = ref({
    waiter: {},
    table: {}
})


const getAllFood = () => {
    FoodService.getAll().then((res) => {
        foods.value = res;
        food_groups.value = []
    })
}
const clickBranch = (id) => {
    FoodGroup.getByBranchId(id).then((res) => {
        food_groups.value =  res;
        foods.value = [];
        parentIds.value = []
    })
}

onMounted(() => {
    getAllBranches()
    getAllFood()
    OrderService.getOrderFoodById(route.params.order_id).then((res) => {
        orderFoods.value = res
    })
    OrderService.getOne(route.params.order_id).then((res) => {
        waiterInfo.value['waiter'] = res.waiter;
        waiterInfo.value['table'] = res.table;
        tableId.value = res.table_id;
    })
    if(parentIds.value.length == 0) {
        FoodGroup.getByParentId(0).then((res) => {
            food_groups.value = res;
        })
        FoodGroup.getByParentIdFood(0).then((res) => {
            foods.value = res;
        })
    } else {
        FoodGroup.getByParentId(parentIds.value[parentIds.value.length - 1]).then((res) => {
            food_groups.value = res;
        })
        FoodGroup.getByParentIdFood(parentIds.value[parentIds.value.length - 1]).then((res) => {
            foods.value = res;
        })
    } 
    FoodService.getAll().then((res) => {
        searchedFood.value = res;
    })
})
const clickFoodGroup = (id, e) => {
    e.stopPropagation();
    parentIds.value.push(id);
    FoodGroup.getByParentId(id).then((res) => {
        food_groups.value = res;
    })
    FoodGroup.getByParentIdFood(id).then((res) => {
        foods.value = res;
    })
}

const all_sum = ref(0);
const orderFoods = ref([])

watch(orderFoods, (val) => {
    let summ = 0;
    val.forEach((item) => {
        summ += item.sum;
    })
    all_sum.value = summ;
})
const clickFood = (food, e) => {
    e.stopPropagation()
    const fd = orderFoods.value.find((val) => val.food_id == food.id && val.status == 'waiting');
    if(fd) {
        const body = {
            order_id: route.params.order_id,
            food_id: food.id,
            amount: fd.amount+1,
            table_id: tableId.value,
            all_summ: all_sum.value + food.sell_price
        }   
        OrderService.addOrderFoods(body).then((res) => {
            orderFoods.value = res;
        })
    } else {
        const body = {
            order_id: route.params.order_id,
            food_id: food.id,
            amount: 1,
            table_id: tableId.value,
            all_summ: all_sum.value + food.sell_price
        }
        OrderService.addOrderFoods(body).then((res) => {
            orderFoods.value = res;
        })
    }
}

const back = () => {
    const p = parentIds.value.pop()
    if(parentIds.value.length > 0) {
        FoodGroup.getByParentId(parentIds.value[parentIds.value.length - 1]).then((res) => {
            food_groups.value = res;
        })
        FoodGroup.getByParentIdFood(parentIds.value[parentIds.value.length - 1]).then((res) => {
            foods.value = res;
        })
    } else {
        clickBranch(tabValue.value);
    }
}

const productColumn = [
    {
        title: 'Mahsulot',
        key: 'food.name',
    },
    {
        title: 'Miqdori',
        key: 'amount',
        render: (_) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'decimal',
        }).format(_.amount)
      },
    },
    {
        title: 'Summa',
        key: 'sum',
        render: (_) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'decimal',
        }).format(_.sum)
      },
    },
    {
        title: 'Status',
        key: 'status',
        render: (_) => {
            if(_.status == 'waiting') {
                return h(NTag, {
                    type: 'error',
                    style: {
                        'border-radius': '10px',
                        width: '100%',
                        'text-align': 'center',
                    },
                    bordered: true,
                 }, {
                    default: () => 'Kutilmoqda'
                })
                // return "Kutilmoqda"
            } else if(_.status == 'sending'){
                return h(NTag, {
                    type: 'info',
                    style: {
                        'border-radius': '10px',
                        width: '100%',
                        'text-align': 'center',
                    },
                    bordered: true,
                 }, {
                    default: () => 'Jo\'natilgan'
                })
            } else if(_.status == 'completed') {
                return h(NTag, {
                    type: 'success',
                    style: {
                        'border-radius': '10px',
                        width: '100%',
                        'text-align': 'center',
                    },
                    bordered: true,
                 }, {
                    default: () => 'Tayyor'
                })
            } else if(_.status == 'processing') {
                return h(NTag, {
                    type: 'warning',
                    style: {
                        'border-radius': '10px',
                        width: '110%',
                        'text-align': 'center',
                    },
                    bordered: true,
                 }, {
                    default: () => 'Tayyorlanmoqda'
                })
            }
        }
    }
]
const rowClassNameProduct = (row) => {    
    if(row.selected == true) {
        return "selected_product"
    } else if(row.status == 'waiting') {
        return 'waiting_product'
    } else if(row.status == 'sending'){
        return "sending_product"
    } else if(row.status == 'processing') {
        return "processing_product"
    } else if(row.status == 'completed') {
        return "completed_product"
    } else if(row.status == 'cancel') {
        return "cancel_product"
    }
 }
const rowPropsProduct = (row) => {
    return {
        style: "cursor: pointer;",
        onClick: () => {
            const index = orderFoods.value.findIndex((val) => val.id == row.id);
            const index2 = orderFoods.value.findIndex((val) => val.selected == true);
            if(index2 != -1) {
                orderFoods.value[index2]['selected'] = false;
            }
            orderFoods.value[index]['selected'] = true;
        }
    };
}
const productPlus = () => {
    const index = orderFoods.value.findIndex((val) => val.selected == true && val.status == 'waiting');
    if(index != -1) {
        const prod = orderFoods.value[index];
        OrderService.addOrderFoods({
            order_id: route.params.order_id,
            food_id: prod.food_id,
            amount: prod.amount+1,
            table_id: tableId.value,
            all_summ: (all_sum.value + prod.sell_price)
        }).then((res) => {
            orderFoods.value = res;
            const index2 = orderFoods.value.findIndex((val) => val.id == prod.id);
            if(index2 != -1) {
                orderFoods.value[index2]['selected'] = true;
            }
        })
    }
}
const productMinus = () => {
    const index = orderFoods.value.findIndex((val) => val.selected == true && val.status == 'waiting');
    if(index != -1) {
        const prod = orderFoods.value[index];
        OrderService.addOrderFoods({
            order_id: route.params.order_id,
            food_id: prod.food_id,
            amount: prod.amount-1,
            table_id: tableId.value,
            all_summ: (all_sum.value - prod.sell_price)
        }).then((res) => {
            orderFoods.value = res;
            const index2 = orderFoods.value.findIndex((val) => val.id == prod.id);
            if(index2 != -1) {
                orderFoods.value[index2]['selected'] = true;
            }
        })
    }
}


//search start
const showSearch = ref(false);
const showKeyboard = ref(false)
const searchText = ref('');
const leaveSearch = () => {
  searchText.value = ''
}

const onChange = (input) => {
  searchText.value = input
}

const columnsSearch = [
    {
        title: 'Qidiruv kodi',
        key: 'search_code'
    },
    {
        title: 'Name',
        key: 'name'
    },
]
const searchedFood = ref([])
watch(searchText, (val) => {
    if(val != '') {
        FoodService.search({
            name: val
        }).then((res) => {
            searchedFood.value = res;
        })
    } else {
        FoodService.getAll().then((res) => {
            searchedFood.value = res;
        })
    }
})
// calculate amount start
const showCalcAmount = ref(false);
const choosedProduct = ref({})
const rowPropsSearch = (row) => {
    return {
        style: 'cursor: pointer',
        onClick: () => {
            showSearch.value = false
            choosedProduct.value['food_id'] = row.id;
            choosedProduct.value['name'] = row.name;
            choosedProduct.value['measure_id'] = row.measure.id;
            choosedProduct.value['measure'] = row.measure.name;
            choosedProduct.value['measure'] = row.measure.name;
            choosedProduct.value['body_price'] = row.body_price;
            choosedProduct.value['sell_price'] = row.sell_price;
            choosedProduct.value['status'] = 'wait';
            choosedProduct.value['sum'] = 0;
            choosedProduct.value['comment'] = '';
            showCalcAmount.value = true;
        }  
    }
}
const searchAmount = ref(0)
const updateSearchAmount = (e) => {
    if(e) {    
        searchAmount.value = e;
        
    } else {
        searchAmount.value = 0;
    }
    choosedProduct.value['sum'] = Number(e) * choosedProduct.value['sell_price']
}
const onChangeNumeric = (input) => {
  choosedProduct.value['sum'] = Number(input) * choosedProduct.value['sell_price']
  searchAmount.value = Number(input)
}
const addProductCalc = () => {
    let copied = { ...choosedProduct.value }
    showCalcAmount.value = false
    const fd = orderFoods.value.find((val) => val.food_id == copied.food_id);
    OrderService.addOrderFoods({
        order_id: route.params.order_id,
        food_id: copied.food_id,
        amount: fd.amount + searchAmount.value,
        table_id: tableId.value,
        all_summ: (+choosedProduct.value.sum + all_sum.value)
    }).then((res) => {
        orderFoods.value = res;
    })
    choosedProduct.value = {}
    searchAmount.value = 0
}
//calculate amount end
//search end
//send to kitchen start
const sendToKitchen = () => {
    const waitings = orderFoods.value.filter((val) => val.status == 'waiting');
    let waitingFoods = []
    waitings.forEach((val) => {
        waitingFoods.push({
            id: val.id,
            food_id: val.food_id,
            amount: val.amount,
        })
    })
    OrderService.sendToKitchen({
        order_id: route.params.order_id,
        foods: waitingFoods
    }).then((res) => {
        OrderService.getOrderFoodById(route.params.order_id).then((res) => {
            orderFoods.value = res
        })
        OrderService.getOne(route.params.order_id).then((res) => {
            waiterInfo.value['waiter'] = res.waiter;
            waiterInfo.value['table'] = res.table;
            tableId.value = res.table_id;
        })
        message.success("Jo'natildi")
    })
}
//send to kitchen end
const tabValue = ref(null);

import ProdcutCard from './ProductCard.vue';

//search start
import { useDraggable } from '@vueuse/core'
const showSearchKeyboard = ref(false);
const draggableKeyboard = ref(null);
const { x, y, style } = useDraggable(draggableKeyboard, {
  initialValue: { x: 40, y: 40 },
})
const searchInput = ref('')
const onChangeKeyboard = (input) => {
    searchInput.value = input;
}
watch(searchInput, (val) => {
    if(val != '') {
        FoodService.search({
            name: val
        }).then((res) => {
            foods.value = res;
        })
    } else {
        const leng = parentIds.value.length;
        if(leng > 0) {
            const lastOne = parentIds.value[leng - 1];
            FoodGroup.getByParentIdFood(lastOne).then((res) => {
                foods.value = res;
            })
        } else {
            foods.value = []
        }
    }
})
//search end
//icons star
const logoIcon = new URL('../../assets/bmi.png', import.meta.url).href
const homeIcon = new URL('../../assets/home.png', import.meta.url).href
const printIcon = new URL('../../assets/print.png', import.meta.url).href
const minusIcon = new URL('../../assets/minus.png', import.meta.url).href
const plusIcon = new URL('../../assets/Plus.png', import.meta.url).href
const sendIcon = new URL('../../assets/send.png', import.meta.url).href
const ApprovalIcon = new URL('../../assets/approval.png', import.meta.url).href
//icons end

//populars

const getPopulars = () => {
    FoodService.getPopulars().then((res) => {
        parentIds.value = [];
        foods.value = res;
        food_groups.value = [];
    })
}
//populars



</script>

<template>
    <div>
        <div class="header">
            <div class="logo">
                <img :src="logoIcon" alt="">
            </div>
            <n-input v-model:value="searchInput" @focus="showSearchKeyboard = true" placeholder="Qidiruv" style="width: 30%; margin-left: 40px;"></n-input>
            <n-button type="error" v-show="showSearchKeyboard" @click="showSearchKeyboard = false">
                <template #icon>
                    <n-icon>
                        <CloseOutlined></CloseOutlined>
                    </n-icon>
                </template>
            </n-button>
            <div ref="draggableKeyboard" v-show="showSearchKeyboard" :style="style" style="width: 70%; z-index: 200; position: fixed;margin-top: 10px;">
                <simple-keyboard
                    @onChange="onChangeKeyboard"
                    :input="searchInput"
                />
            </div>
        </div>
        <div class="content">
            <div class="contentLeftTable">
                <div style="background-color: white;">
                <n-tabs @click="clickBranch(tabValue)" pane-style="background: #eee" tab-style="min-width: 60px; min-height: 100%;" v-model:value="tabValue"  type="card" :tabs-padding="10" v-if="branches.length > 0">
                    <template #suffix>
                        <n-button type="error" @click="back" style="margin-right: 5px">
                            <template #icon>
                                <n-icon>
                                    <ArrowBackFilled></ArrowBackFilled>
                                </n-icon>
                            </template>
                        </n-button>
                    </template>
                    <n-tab-pane v-for="br in branches" style="min-height: fit-content" :name="br.id" :tab="br.name">
                        <n-scrollbar style="max-height: calc(100vh - 150px); padding-right: 10px;" >
                            <div class="grid-container">
                                <div class="grid-item" v-for="gr in food_groups">
                                    <div class="green" @click="clickFoodGroup(gr.id, $event)">
                                            {{ gr.name }}
                                    </div>
                                </div>
                                <div class="grid-item" v-for="fd in foods" @click="clickFood(fd, $event)">
                                    <ProdcutCard :product="fd"></ProdcutCard>
                                </div>
                            </div>
                        </n-scrollbar>
                    </n-tab-pane>
                </n-tabs>
            </div>                
            </div>
            <div class="contentRightTable">
                <n-data-table
                    :columns="productColumn"
                    :data="orderFoods"
                    :bordered="false"
                    :row-class-name="rowClassNameProduct"
                    :row-props="rowPropsProduct"
                    :max-height="460"
                    :min-height="460"
                    style="height:460px"
                />
                <div class="all_sum">
                Umumiy summa : {{
                            new Intl.NumberFormat('ru-RU', {
                            style: 'decimal',
                        }).format(all_sum)
                        }}
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="footer_bottom">
                <n-button @click="router.push({ name: 'sellingWindow'})" color="#fff" text-color="#324b97" style="width: 60px; height: 55px; border: 2px solid #324b97">
                    <template #icon>
                        <n-icon size="50">
                            <img :src="homeIcon">
                        </n-icon>
                    </template>
                </n-button>
                <!-- <n-button @click="showSearch = true" color="#fff" text-color="#324b97" style="width: 60px; height: 55px;margin-top: 10px;border: 2px solid #324b97">
                    <template #icon>
                        <n-icon size="50">
                            <SearchRound></SearchRound>
                        </n-icon>
                    </template>
                </n-button> -->
                <n-button color="#fff" text-color="#324b97" style="width: 60px; height: 55px; margin-top: 10px;border: 2px solid #324b97">
                    <template #icon>
                        <n-icon size="50">
                            <img :src="printIcon" alt="">
                        </n-icon>
                    </template>
                </n-button>
                <n-button style="width: 60px; height: 55px; margin-top: 10px;border: 2px solid #324b97" @click="productPlus" color="#fff" text-color="#324b97">
                    <template #icon>
                        <n-icon size="50">
                            <img style="width: 50px;" :src="plusIcon" alt="">
                        </n-icon>
                    </template>
                </n-button>
                <n-button  @click="productMinus" style="width: 60px; height: 55px; margin-top: 10px;border: 2px solid #324b97" color="#fff" text-color="#324b97">
                    <template #icon>
                        <n-icon size="50">
                            <img style="width: 50px;" :src="minusIcon" alt="">
                        </n-icon>
                    </template>
                </n-button>
                <n-button @click="getPopulars" style="width: 60px; height: 55px; margin-top: 10px;border: 2px solid #324b97" color="#fff" text-color="#324b97">
                    <template #icon>
                        <n-icon size="60">
                            <img style="width: 40px;" :src="ApprovalIcon" alt="">  
                        </n-icon>
                    </template>
                </n-button>
                <n-button @click="sendToKitchen" style="width: 60px; height: 55px; margin-top: 10px;border: 2px solid #324b97" color="#fff" text-color="#324b97">
                    <template #icon>
                        <n-icon size="60">
                            <img style="width: 40px;" :src="sendIcon" alt="">  
                        </n-icon>
                    </template>
                </n-button>
            </div>
            <n-modal
                v-model:show="showSearch"
                preset="card"
                title="Stollar"
                style="width: 800px"
                :on-after-leave="leaveSearch"
                >
                <n-input
                    placeholder="Qidirish"
                    v-model:value="searchText"
                    @focus="showKeyboard = true"
                />
                <n-data-table
                    :columns="columnsSearch"
                    :data="searchedFood"
                    :bordered="false"
                    :row-props="rowPropsSearch"
                    :max-height="300"
                    style="margin-top: 10px"
                />
                <simple-keyboard
                    style="margin-top: 20px"
                    @onChange="onChange"
                    v-show="showKeyboard"
                    :input="searchText"
                />  
                </n-modal>
                <!--calculation amount-->
                    <n-modal
                    v-model:show="showCalcAmount"
                        preset="card"
                        title="Stollar"
                        style="width: 500px"
                    >
                    <div class="search_content">
                        <div class="left_search_content">
                            <div class="name">
                                {{ choosedProduct.name }}
                            </div>
                            <div class="calcul">
                                {{
                                    new Intl.NumberFormat('ru-RU', {
                                        style: 'decimal',
                                    }).format(choosedProduct.sell_price)
                                }}
                            </div>
                            <div class="calcul">
                                *
                            </div>
                            <div class="result_calc">
                                {{
                                    new Intl.NumberFormat('ru-RU', {
                                        style: 'decimal',
                                    }).format(choosedProduct.sum)
                                }}
                            </div>
                            <div class="btns">
                                <n-button @click="addProductCalc" color="#08B60F" style="width: 100%">
                                    OK
                                </n-button>
                            </div>
                        </div>
                        <div class="right_search_content">
                            <n-input-number
                                placeholder="Kiriting"
                                :value="searchAmount"
                                @update:value="updateSearchAmount"
                                :show-button="false"
                            >
                            </n-input-number>
                            <numeric-keyboard
                                style="margin-top: 20px"
                                @onChange="onChangeNumeric"
                                :input="searchAmount.toString()"
                            />
                        </div>
                    </div>   
                    </n-modal>
                <!--calculation amount-->
        </div>
    </div>
</template>


<style scoped>

.all_sum {
    padding: 10px;
    text-align: right;
    background-color: #fff;
    position: absolute;
    width: calc(100% - 20px);
    bottom: 20px;
    font-size: 23px;
    color: blue;
}

.logo img {
    /* border: 1px solid black; */
    width: 50px;
    margin-top: 8px;
    border-radius: 10px;
    margin-left: 12px;
}
.search_content {
    display: flex;
    justify-content: space-between;
}
.left_search_content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 40%;
}
.left_search_content .name {
    font-size: 20px;
    text-align: center;
    font-weight: bold;
    
    box-shadow: 0px 0px 10px #aaa;
}
.food_control {
    box-shadow: 0px 0px 10px #aaa;
    width: 100px;
    display: flex;
    flex-direction: row;
    margin-left: 10px;
    box-sizing: border-box;
    height: 100%-20px;
}

.grid-container {
  display: grid;
  grid-template-columns: 20%  20%  20%  20% 20%;
  padding: 5px;
  gap: 3px;
  /* min-height: calc(100vh - 150px); */
  /* background-color: #eee; */
}

.calcul, .result_calc {
    text-align: center;
    font-weight: bold;
    box-shadow: 0px 0px 10px #aaa;
}
.light-green {
  height: 108px;
  background-color: rgba(0, 128, 0, 0.12);
}
.logo {
    font-weight: bold;
    font-size: 25px;
    cursor: pointer;
    color: #324b97;
}
.green {
  height: 180px;
  background-color: #fff;
  border: 2px solid #324b97;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
  /* word-wrap: break-word; */
  font-size: 25px;
  font-weight: bold;
  width: 130px;
  /* letter-spacing: 3px; */
  cursor:pointer;
  border-radius: 10px;
  transition: background .3s;
  text-align: center;
  color: #324b97;
  word-break: break-all;
}
.food_name {
    text-align: center;
    width: 100%;
}

.content {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background-color: #eee;
    height: calc(100vh - 80px);
}
.contentLeftTable {
    width: 60%;
    margin-left: 95px;
    box-shadow: 0px 0px 3px #aaa;
}
.contentRightTable {
    box-shadow: 0px 0px 3px #aaa;
    height: 100px;
    width: 45%;
    margin-left: 10px;
    height: calc(100vh - 100px);
    box-sizing: border-box;
    padding: 10px;
}
.header {
    background-color: #fff;
    display: flex;
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    height: 60px;
    justify-content: flex-start;
    border: 1px solid #eee;
}
.footer {
    background-color: #fff;
    /* height: 95px; */
    padding: 10px;
    box-sizing: border-box;
    height: calc(100% - 60px);
    position: absolute;
    top: 60px;
    left: 0;
}

.main {
  width: 98%;
  margin-left: auto;
  margin-right: auto;
}
.title {
  text-align: center;
  width: 40%;
  background-color: #195FB0;
  color: white;
  border-radius: 10px;
  font-weight: bold;
  border: 1px solid #aaa;
}
.value {
  margin-left: 20px;
  width: 40%;
  text-align: center;
  font-weight: bold;
  color: white;
  border-radius: 10px;
  background-color: #08B60F;
  border: 1px solid #aaa;
}
.table {
  width: 40%;
  margin-left: 20px;
  display: flex;
  height: 20px;
  font-weight: bold;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 90px;
  font-size: 30px;
  padding: 0 75px;
  font-weight: 550;
}
.bottom {
  display: flex;
  /* justify-content: center; */
  justify-content: flex-start;
  height: 65px;
  align-items: flex-end;
}
.bottom button {
  height: 40px;
  font-size: 20px;
}
.footer_bottom {
    padding: 10px;
    box-sizing: border-box;
    box-shadow: 0px 0px 3px #aaa;
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    align-items: center;
    height: 100%;
}

</style>