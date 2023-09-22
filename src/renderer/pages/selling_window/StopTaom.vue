<script setup>
import FoodGroup from '../../services/food-group.service';
import FoodService from '../../services/food.service';
import { onMounted, ref, inject } from 'vue';
import { ArrowBackUp } from '@vicons/tabler'
import { useMessage } from 'naive-ui';
const message = useMessage()
const parentIds = ref([])
const imgUrl = inject('img_url');
const food_groups = ref([]);
const foods = ref([])
onMounted(() => {
   FoodGroup.getAll().then((res) => {
      food_groups.value = res;
  })
})
const clickFoodGroup = (id) => {
    parentIds.value.push(id);
    FoodGroup.getByParentId(id).then((res) => {
        food_groups.value = res;
    });
    FoodGroup.getByParentIdFoodForEnable(id).then((res) => {
        foods.value = res;
    });
}
const foodId = ref(null);
const showStop = ref(false);

const back = () => {
    const p = parentIds.value.pop()
    if(parentIds.value.length > 0) {
        FoodGroup.getByParentId(parentIds.value[parentIds.value.length - 1]).then((res) => {
            food_groups.value = res;
        })
        FoodGroup.getByParentIdFoodForEnable(parentIds.value[parentIds.value.length - 1]).then((res) => {
            foods.value = res;
        })
    } else {
        FoodGroup.getAll().then((res) => {
            food_groups.value = res;
            foods.value = []
        })
    }
}
const railStyle =({focused, checked}) => {
    const style = {}
    if (checked) {
        style.background = '#32CD32'
        if (focused) {
        style.boxShadow = '0 0 0 2px #d0305040'
        }
    } else {
        style.background = '#d03050'
        if (focused) {
        style.boxShadow = '0 0 0 2px #2080f040'
        }
    }
    return style
}
const updateDisableMenu = (id, val) => {
    if(val == 1) {
        FoodService.stopFood(id).then((res) => {
            FoodGroup.getByParentIdFoodForEnable(parentIds.value[parentIds.value.length - 1]).then((res) => {
                foods.value = res;
            })
        }).catch((e) => {
            message.error("Taom allaqachon o'chirilgan!")
        })
    } else {
        FoodService.startFood(id).then((res) => {
            FoodGroup.getByParentIdFoodForEnable(parentIds.value[parentIds.value.length - 1]).then((res) => {
                foods.value = res;
            })
        }).catch((e) => {
            message.error("Taom allaqachon yoqilgan!")
        })
    }
}
const updatePopularMenu = (id, val) => {
    FoodService.updatePopular(id, {
        isEnable: val
    }).then((res) => {
        FoodGroup.getByParentIdFoodForEnable(parentIds.value[parentIds.value.length - 1]).then((res) => {
            foods.value = res;
        })
    })
}

</script>
<template>
    <div>
        <div class="grid-container">
            <n-button type="error" class="back_btn" @click="back">
                <template #icon>
                    <n-icon size="40">
                        <ArrowBackUp />
                    </n-icon>
                </template>
            </n-button>
            <div class="grid-item" v-for="gr in food_groups">
                <div class="green" @click="clickFoodGroup(gr.id)">
                        {{ gr.name }}
                </div>
            </div>
            <div class="grid-item" v-for="fd in foods">
                <div class="food">
                    <n-image width="100" height="90" style="border-radius: 50%;" :src="imgUrl + fd.picture" />
                    <div class="food_name">
                        {{ fd.name }}
                        <div class="food_price">
                            {{
                                new Intl.NumberFormat('ru-RU', {
                                    style: 'decimal',
                                }).format(fd.sell_price)
                            }}
                        </div>
                        <div>
                                <span style="font-size: 12px;">Menuda ko'rsatish</span>
                                <n-switch @update:value="updateDisableMenu(fd.id, $event)" :checked-value="0" :unchecked-value="1" :value="fd.disableMenu" :rail-style="railStyle" style="margin-top: 0px; width: 100%;">
                                    <template #checked>
                                        Yoniq
                                    </template>
                                    <template #unchecked>
                                        O'chiq
                                    </template>
                                </n-switch>
                        </div>
                        <div>
                            <span style="font-size: 12px;">Ommabop taomlar</span>
                            <n-switch @update:value="updatePopularMenu(fd.id, $event)" :checked-value="1" :unchecked-value="0" :value="fd.popularMenu" :rail-style="railStyle" style="margin-top: 0px; width: 100%;">
                                <template #checked>
                                    Yoniq
                                </template>
                                <template #unchecked>
                                    O'chiq
                                </template>
                            </n-switch>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <n-modal
            v-model:show="showStop"
            preset="card"
            style="width: 300px"
        >
            <div class="show_stop">
                <n-button @click="startFood" style="width: 120px" type="success">Yoqish</n-button>
                <n-button @click="stopFood" style="width: 120px" type="error">O'chirish</n-button>
            </div>
        </n-modal>
    </div>
</template>
<style scoped>

.grid-container {
  display: grid;
  grid-template-columns: 16%  16%  16%  16% 16%  16%;
  padding: 10px;
  gap: 10px;
  border: 1px solid #aaa;
  background-color: #eee;
  height: 500px;
}
.green {
  height: 108px;
  background: #fff;
  border: 2px solid #324b97;
  color: #324b97;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
  word-wrap: break-word;
  font-size: 25px;
  font-weight: bold;
  cursor:pointer;
  border-radius: 10px;
  transition: background .3s;
  text-align: center;
  line-height: 28px;
}
.food_name {
    text-align: center;
    width: 100%;
    font-weight: bold;
    margin-top: 10px;
}
.food {
    font-size: 20px;
    font-weight: bold;
    background-color: #fff;
    color: #324b97;
    width: 100%;
    border-radius: 10px;
    padding: 10px;
    border: 2px solid #324b97;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center !important;
    font-weight: bold;
}
.back_btn {
    position: absolute;
    left: 0px;
    top: -40px;
    /* border-radius: 50%; */
    width: 60px;
    /* height: 60px; */
}
.show_stop {
    display: flex;
    justify-content: space-between;
    width: 100%;
}
.food_price {
    margin-top: 10px;
    font-weight: bold;
}
</style>