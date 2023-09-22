<script setup>
import { useRouter } from 'vue-router'
import SocketIns from '../../socket/socket'
import moment from 'moment';
import { useFormDataStore } from '../../stores/formdata'
import RoomService from '../../services/room.service'
import OrderService from '../../services/order.service'
import TableService from '../../services/table.service'
import { useCurrentTime } from './useCurrentTime'
import { orderStore } from '../../stores/order'
import { h, ref, onMounted, watch } from 'vue'
import { NButton, useMessage } from 'naive-ui'
import { HandStop, CreditCard } from '@vicons/tabler'
import { TableBarOutlined } from '@vicons/material'
import { ReorderThreeOutline } from '@vicons/ionicons5'
import { ConferenceRoom20Regular } from '@vicons/fluent'
import RightDrawer from './RightDrawer.vue'
import WaiterService from '../../services/waiter.service'

const userRole = ref('');
const userFullname = ref(null)
const orderColumns = [
    {
      title: 'Vaqt',
      key: 'datetime',
      className: 'datetime',
      render: (_) => {
        return moment(_.datetime * 1000).format('MM-DD-YYYY HH:mm:ss')
      },
    },
    {
      title: 'Xona',
      key: 'room.name',
      filterOptions: [],
      filter (value, row) {
        return ~row.room.name.indexOf(value)
      }
    },
    {
      title: 'Stol',
      key: 'table.name',
    },
    {
      title: "Ofitsant",
      key: 'waiter.full_name',
      filterOptions: [],
      filter (value, row) {
        return ~row.room.name.indexOf(value)
      }
    },
    {
      title: 'Jami summa',
      key: 'all_sum',
      render: (_) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'decimal',
        }).format(_.all_sum)
      },
    },
]
SocketIns.socket.on('bronTable', (data) => {
  const index = tables.value.findIndex((val) => val.id == data.table_id);
  tables.value[index].active = true;
})

const orderColumnsChild = [
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
    title: 'Birlik',
    key: 'measure.name'
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
]
const message = useMessage()

const showTables = ref(false)
const router = useRouter()
const { currentTime } = useCurrentTime()
const tables = ref([])
const orders = ref([])
const ordersChild = ref([])
const rowProps = (row) => {
  return {
    style: 'cursor: pointer',
    ondblclick: () => {
      router.push({
        name: 'SellingTable',
        params: {
          order_id: row.id
        }
      })
    },
    onclick: () => {
      const index = orders.value.findIndex((val) => val.id == row.id);
      const index2 = orders.value.findIndex((val) => val.selected == true);
      orders.value[index]['selected'] = true;
      if(index2 != -1) {
        orders.value[index2]['selected'] = false;
      }
      OrderService.getOne(row.id).then((res) => {
        ordersChild.value = res.order_food;
      })
    },
  }
}
//bottom_index icon   
import { Home, Clock, BrandPaypal, InfoCircle } from '@vicons/tabler'

//bottom_index icon buttons
//sidebar 
const siderbarStyle = ref({
    width: '0px'
})
const toggleSiderbar = () => {
    if(siderbarStyle.value.width == '300px')
        siderbarStyle.value.width = '0px'
    else
        siderbarStyle.value.width = '300px'
}
const rooms = ref([]);

onMounted(() => {
  userRole.value = localStorage.getItem('role')
  WaiterService.getAll().then((res) => {
    res.forEach(element => {
      orderColumns[3].filterOptions.push({
        label: element.full_name,
        value: element.full_name
      })
    });
  })
  OrderService.getAll().then((res) => {
    orders.value = res;
    if(orders.value.length > 0) {
      orders.value[0]['selected'] = true;
    }
  })
  RoomService.getAll().then((res) => {
    res.forEach(element => {
      orderColumns[1].filterOptions.push({
        label: element.name,
        value: element.name,
      })
    });
    rooms.value = res;
  })
  userFullname.value = localStorage.getItem('full_name')
})

const choosedRoom = ref(null)
const roomClick = (id) => {
  showTables.value = true;
  choosedRoom.value = id;
  TableService.getByRoomId(id).then((res) => {
    tables.value = res;
  })
}
const rowClassNameOrder = (row) => {
    if(row.selected == true) {
        return "selected_order"
    } else {
        return ""
    }
}
const pushHome = () => {
  if(userRole.value == 'admin') {
    router.push({
      name: 'Home'
    })
  } else {
    router.push({ name: 'Login'})
  }
}
const tableClick = async (table) => {
  if(table.active == false && table.own == 0) {
    OrderService.firstOrder({
      "room_id" : choosedRoom.value,
      "table_id" : table.id
      // "waiter_id": localStorage.getItem('userId'),
      // "caisher_id" : null
    }).then((res) => {
        router.push({
          name: 'SellingTable',
          params: {
            order_id: res.id
          }
        })
    })
  } else if (table.active == true && table.own == 1){
    const order_id = table.orders[0].id;
    router.push({
      name: 'SellingTable',
      params: {
        order_id: order_id
      }
    })
  }
}
//stop taom start
const showStopTaom = ref(false)
import StopTaom from './StopTaom.vue';


//stop taom end
//printer start
const printerRef = ref(null);
const printerBtn = () => {
  document.body.innerHTML = printerRef.value.innerHTML;
  document.body.style.border = '1px solid black'
  print()
  router.go()
}


//printer end

//payment start
const showPayment = ref(false);
import PaymentWindow from './PaymentWindow.vue';
const paymentId = ref(null)
const openPayment = () => {
  const index = orders.value.findIndex((val) => val.selected == true);
  if(index != -1) {
    showPayment.value = true;
    paymentId.value = orders.value[index].id;
  } else {
    message.error("Buyurmalardan birini tanlang!")
  }
}

const paymentEnd = () => {
  OrderService.getAll().then((res) => {
    orders.value = res;
    if(orders.value.length > 0) {
      orders.value[0]['selected'] = true;
    }
  })
  showPayment.value = false;
}

//payment end

</script>

<template>
  <div class="main">
    <div v-show="false" ref="printerRef">
      salom
    </div>
    <div class="content">
      <div class="contentLeft">
        <div class="contentLeftTop">
          <div class="Time">{{ currentTime.toLocaleTimeString() }}</div>
          <div class="userName">
              {{ userFullname }}
          </div>
        </div>
        <div class="rooms">
          <n-button
            v-for="room in rooms"
            :key="room.id"
            color="#2d364c"
            style="font-size: 22px; height: 50px; margin-top: 10px; width: 100%"
            @click="roomClick(room.id)"
            >{{ room.name }}
              <template #icon>
                <n-icon size="30">
                  <ConferenceRoom20Regular></ConferenceRoom20Regular>
                </n-icon>
              </template>
            </n-button
          >
        </div>

      </div>
      <div class="contentCenter">
        <div class="contentCenterTop">
          <div class="contentCenterLeft">
            <n-data-table
              :columns="orderColumns"
              :data="orders"
              :bordered="false"
              :max-height="400"
              :min-height="400"
              :rowProps="rowProps"
              :row-class-name="rowClassNameOrder"
            />
          </div>
          <div class="contentCenterRight">
          <n-data-table
            :columns="orderColumnsChild"
            :data="ordersChild"
            :bordered="false"
            :max-height="315"
          />
          </div>
        </div>
        <div class="contentCenterBottom">
          <div class="bottom_index">
              <n-button @click="pushHome" color="#2d364c" text-color="#F4EEE0" style="width: 60px; height: 55px; margin-left: 10px;">
                  <template #icon>
                    <n-icon size="50">
                        <Home></Home>
                    </n-icon>
                  </template>
              </n-button>
              <n-button v-if="userRole == 'admin' || userRole == 'caisher'" @click="openPayment" color="#2d364c" text-color="#F4EEE0" style="width: 60px; height: 55px; margin-left: 10px">
                  <template #icon>
                    <n-icon size="50">
                        <CreditCard></CreditCard>
                    </n-icon>
                  </template>
              </n-button>
              <n-button @click="toggleSiderbar" color="#2d364c" text-color="#F4EEE0" style="width: 60px; height: 55px; margin-left: 10px">
                  <template #icon>
                    <n-icon size="50">
                      <img src="https://img.icons8.com/office/48/null/information.png"/>
                    </n-icon>
                  </template>
              </n-button>
              <n-button @click="showStopTaom = true" color="#2d364c" text-color="#F4EEE0" style="width: 60px; height: 55px; margin-left: 10px">
                  <template #icon>
                    <n-icon size="50">
                      <img src="https://img.icons8.com/office/48/null/stop-sign.png"/>
                    </n-icon>
                  </template>
              </n-button>
              <n-button @click="toggleSiderbar" color="#2d364c" text-color="#F4EEE0" style="width: 60px; height: 55px;margin-left: 10px">
                <template #icon>
                  <n-icon size="50">
                    <ReorderThreeOutline></ReorderThreeOutline>
                  </n-icon>
                </template>
            </n-button>
           </div>
        </div>
      </div>
      
    </div>
    <div class="sidebar" :style="siderbarStyle">
      <RightDrawer></RightDrawer>
    </div>

    <div  class="footer">
      <n-modal
        v-model:show="showTables"
        preset="card"
        title="Stollar"
        style="width: 800px; height: 500px;"
      >
      <div  v-if="tables.length == 0" class="no_data">
        Stollar yo'q
      </div>
        <div style="padding: 10px; border: 2px solid #fff;">
          <n-grid cols="2 s:3 m:4 l:5 xl:6 2xl:7" responsive="screen" style="max-height: calc(100vh - 300px); min-height: calc(100vh - 300px); overflow: scroll; padding-right: 10px; padding-bottom: 10px;">
          <n-grid-item
            v-for="table in tables"
            :key="table.id"
            style="width: 100%"
          >
            <div
              @click="tableClick(table)"
              style="
                height: 100px;
                cursor: pointer;
                margin-left: 10px;
                margin-top: 10px;
                font-size: 20px;
                overflow: hidden;
                color: rgb(31, 34, 37);
                box-sizing: border-box;
                border-radius: 5px;
                box-shadow: 0px 0px 5px #aaa;
                background-color: #F4F3F3;
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
              "
              :disabled="table.active && table.own == 0"
            >
              <div class="name" style="margin-top: 20px;">
                {{ table.name }}
              </div>
              <div>
                <n-icon size="40" color="#1DD887" v-if="table.active && table.own == 1">
                  <TableBarOutlined></TableBarOutlined>
                </n-icon>
                <n-icon size="40" color="red" v-else-if="table.active">
                  <TableBarOutlined></TableBarOutlined>
                </n-icon>
                <n-icon size="40" color="#000" v-else>
                  <TableBarOutlined></TableBarOutlined>
                </n-icon>
              </div>
              <div v-if="table.active || table.active && table.own == 1" :class="{'backRed': table.active && table.own == 0, 'own': table.active && table.own == 1}"></div>
            </div>
          </n-grid-item>
        </n-grid>
      </div>
      </n-modal>
    </div>
    <n-modal
      preset="card"
      v-model:show="showStopTaom"
      style="width: 80%; height: 600px"
      :mask-closable="false"
    >
      <stop-taom></stop-taom>
    </n-modal>
    <!--PAYMENT START-->
    <n-modal v-model:show="showPayment" preset="card" style="width: 800px; height: 640px">
      <PaymentWindow @pay="paymentEnd" :orderId="paymentId"></PaymentWindow>
    </n-modal>
    <!--PAYMENT END-->
  </div>
</template>
<style scoped>
/* .datetime {
  height: 50px!important;
} */
.n-data-table-tr {
  height: 30px!important;
}

/* sidebar start */
.sidebar {
    position: fixed;
    box-sizing: border-box;
    z-index: 10;
    right: 0;
    height: 100vh;
    top: 0;
    transition:all .5s ease;
}

/* sidebar end */
.bottom_index {
    /* border: 2px solid #aaa; */
    border-radius: 20px;
    bottom: 10px;
    /* top: 120px; */
    background-color: #eee;
    width: 100%;
    height: 70px;
    display: flex;
    align-items: center;
    padding: 10px;
    box-shadow: 0px 0px 5px #aaa;
    box-sizing: border-box;
}
.modal {
  position: absolute;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  border: 1px solid red;
  background-color: #aaa;
  margin-left: -150px;
}

.secondmodal {
  position: fixed;
  z-index: 999;
  top: 70%;
  left: 50%;
  width: 300px;
  border: 1px solid red;
  background-color: #aaa;
  margin-left: -150px;
}
.main {
    padding: 20px;
    background: #eee;
    height: 100vh;
    box-sizing: border-box;
}
.headerLeft {
  font-size: 15px;
  text-align: center;
}
.headerLeft .name {
  font-weight: bold;
}
.no_data {
  text-align: center;
  width: 100%;
  height: 100%;
  line-height: inherit;
  font-size: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* border: 1px solid #eee; */
}
.headerCenter {
  width: 80%;
  display:flex;
  flex-direction: column;
  justify-content: flex-start;
  /* padding: 0; */
  /* align-items: flex-start; */
}
.headerCenter h1{
  /* margin-top: -3px;s */
  box-sizing: border-box;
  padding-left: 30px;
  font-size: 15px;
  text-align: right;
}
.footer {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-left: 40px;
}
.content {
  display: flex;
  justify-content: space-between;
  padding: 20px 0px;
  box-sizing: border-box;
  height: calc(100vh - 20px);
}
.contentCenter {
  width: 80%;
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
}
.contentCenterTop {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
  height: calc(100vh - 50px);
  border: 2px solid snow;
  padding: 10px;
}
.contentCenterLeft {
  width: 70%;
}
.content .contentCenterRight {
  width: 35%;
  margin-left: 20px;
}

.contentLeft {
  width: 18%;
  padding: 20px;
  background: #eee;
  border-radius: 10px;
  box-shadow: 0px 0px 10px #aaa;
}

.contentLeftTop {
  border: 2px solid #1DD887;
  border-radius: 10px;
  color: black;
  height: 100px;
}
.own {
  background-color: #1DD887 !important;
  height: 10px;
  width: 100%;
}
.backRed {
  background-color: red !important;
  height: 10px;
  width: 100%;
}
.userName {
  font-size: 20px;
  text-align: center;
  font-weight: 600;
  margin-top: 0px;
}
.Time {
  text-align: center;
  font-weight: 600;
  margin-top: 10px;
  /* margin-bottom: -20px; */
}
.rooms {
  border: 2px solid #1DD887;
  border-radius: 10px;
  height: calc(100vh - 200px);
  max-height: calc(100vh - 200px);
  overflow-y: scroll;
  padding: 10px;
  /* padding-right: 20px; */
  box-sizing: border-box;
  margin-top: 10px;
}
</style>