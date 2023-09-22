<script setup>
import { onMounted, ref, watch, reactive } from 'vue';
import { useMessage } from 'naive-ui';
import { useRouter } from 'vue-router';
import OrderService from '../../services/order.service'
import SocketService from '../../socket/socket'
import { HomeOutline } from '@vicons/ionicons5'
import { ClockAlarm24Regular as Clock } from '@vicons/fluent'
import { AlarmOnOutlined as Alarm } from '@vicons/material'
const chiefOrders = ref([])
const router = useRouter()
const message = useMessage()
const conditions = reactive({
  is_waiting: false,
  is_preparing: false,
  is_ready: false
})
onMounted(() => {
  userRole.value = localStorage.getItem('role')
  OrderService.getChiefOrderList().then((res) => {
    chiefOrders.value = res;
    if(chiefOrders.value.length > 0) {
      chiefOrders.value[0]['selected'] = true;
    }
  })
})

const userRole = ref('')
SocketService.socket.on("newFoodsOnRestr", (data) => {
  chiefOrders.value.push(data);
  message.success("Yangi zakaz!")
})
const rowClick = (id) => {
  const index = chiefOrders.value.findIndex((val) => val.id == id);
  const index2 = chiefOrders.value.findIndex((val) => val.selected == true);
  chiefOrders.value[index]['selected'] = true;
  if(index2 != -1)
  chiefOrders.value[index2]['selected'] = false;
}


const setProccessing = () => {
  const findIndex = chiefOrders.value.findIndex((val) => val.selected == true);
  if(findIndex != -1) {
    const id = chiefOrders.value[findIndex].id;
    OrderService.setProccessing(id).then((res) => {
      message.success("Taom tayyorlanmoqda!")
      OrderService.getChiefOrderList().then((res) => {
        chiefOrders.value = res;
      })
    })
  }
}
const setComplete = () => {
  const findIndex = chiefOrders.value.findIndex((val) => val.selected == true);
  if(findIndex != -1) {
    const id = chiefOrders.value[findIndex].id;
    OrderService.setComplete(id).then((res) => {
      message.success("Taom tayyor!")
      OrderService.getChiefOrderList().then((res) => {
        chiefOrders.value = res;
      })
    })
  }
}
//icons start
const homeIcon = new URL('../../assets/home.png', import.meta.url).href

//icons end

function setDefaultPrinter() {
  // const win = remote.getCurrentWindow();
  // win.webContents.print();

}
const pushHome = () => {
  if(userRole.value == 'chief') {
    router.push({ name: 'Login'})
  } else if(userRole.value == 'admin') {
    router.push({ name: 'Home'})
  }
}

const filteredOrders = ref([])
watch(chiefOrders, (val) => {
  filteredOrders.value = chiefOrders.value.filter((item) => {
    return item.status == 'waiting' && conditions.is_waiting ||
     item.status == 'doing' && conditions.is_preparing ||
     item.status == "done" && conditions.is_ready
  })
})

watch(conditions , (val) => {
  filteredOrders.value = chiefOrders.value.filter((item) => {
    return item.status == 'waiting' && conditions.is_waiting ||
     item.status == 'doing' && conditions.is_preparing ||
     item.status == "done" && conditions.is_ready
  })
})


</script>

<template>
    <div class="main">
      <div class="header">
        <n-checkbox v-model:checked="conditions.is_waiting">
           Kutilmoqda
        </n-checkbox>
        <n-checkbox v-model:checked="conditions.is_preparing">
           Tayyorlanmoqda
        </n-checkbox>
        <n-checkbox v-model:checked="conditions.is_ready">
           Tayyor
        </n-checkbox>
      </div>
      <div class="table">
        <table>
          <thead>
              <tr>
                  <th>ID</th>
                  <th>Buyurtma ID</th>
                  <th>Taom</th>
                  <th>Miqdori</th>
                  <th>Vaqt</th>
                  <th>Holati</th>
              </tr>
          </thead>
          <tbody>
              <tr v-for="ord in filteredOrders" @click="rowClick(ord.id)" :class="{ 'active_row': ord.selected }">
                  <td>#{{ ord.id }}</td>
                  <td>#{{ ord.order_id }}</td>
                  <td>{{ ord.food.name }}</td>
                  <td>{{ ord.amount }}</td>
                  <td>{{ new Date(ord.datetime*1000).toLocaleTimeString() }}</td>
                  <td>{{ ord.status == 'waiting' ? "Kutilmoqda": ord.status == 'done' ? "Tayyor" :"Tayyorlanmoqda"}}</td>
              </tr>
          </tbody>
      </table>
      </div>
      <div class="bottom">
        <n-popover trigger="hover">
          <template #trigger>
            <n-button @click="pushHome" color="#2d364c" style="width: 70px; height: 60px; margin-left: 10px;">
              <template #icon>
                <n-icon size="60">
                  <HomeOutline></HomeOutline>
                </n-icon>
              </template>
            </n-button>
          </template>
          Home oynaga qaytish
        </n-popover>
        <n-popover>
          <template #trigger>
            <n-button  @click="setProccessing" color="#2d364c" style="width: 70px; height: 60px; margin-left: 10px;">
              <template #icon>
                <n-icon size="60">
                  <Clock></Clock>
                </n-icon>
              </template>
            </n-button>
          </template>
          Taomni tayyorlanmoqda xolatiga o'tkazish!
        </n-popover>
      <n-popover trigger="hover">
        <template #trigger>
          <n-button @click="setComplete" color="#2d364c" style="width: 70px; height: 60px">
            <template #icon>
              <n-icon size="60">
                <Alarm></Alarm>
              </n-icon>
            </template>
          </n-button>
          </template>
          <span>Taomni tayyor statusiga o'tkazish!</span>
        </n-popover>
      </div>
    </div>
</template>


<style scoped>
.header {
  height: 50px;
  /* width: 30%; */
  display: flex;
  justify-content: flex-end;
}
.header .n-checkbox {
  font-size: 20px;
  margin-right: 20px;
}
.main {
  padding: 10px;
  height: calc(100vh - 30px);
}
.bottom {
  position: absolute;
  border: 1px solid #aaa;
  border-radius: 10px;
  width: calc(100% - 20px);
  bottom: 5px;
  display: flex;
  align-items: center;
  gap: 20px;
  height: 80px;
  z-index: 100;
  background-color: white;
}
.active_row {
  background-color: #CCF381 !important;
  color: white;
}

table thead {
  position: sticky;
  top: 0;
  background-color: #2d364c;
  color: white;
  font-size: 20px;
  z-index: 100;
}
table {
  width: 100%;        
  font-family: arial, sans-serif;
  border-collapse: collapse;
  overflow: auto;
}
.table {
  height: calc(100vh - 100px);
  max-height: calc(100vh - 100px);
  overflow: auto !important;
}
/* table tbody {
  height: calc(100vh - 200px); 
  max-height: calc(100vh - 200px);
} */
thead  tr {
  border-radius: 10px !important;
}
th, td {
  padding: 8px;
  text-align: left;
  border-top: 1px solid #dee2e6;
  font-size: 20px;
}
tbody tr:nth-child(odd) {
  background-color: #f2f2f2;
}
</style>