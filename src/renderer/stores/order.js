import { defineStore } from 'pinia'
import roomService from '../services/room.service';
import tableService from '../services/table.service';
import { ref } from 'vue'
export const orderStore = defineStore('order', () => {
    const order = ref([]);
    const addOrder = async (room_id, table_id) => {
        let data = {};
        let room = await roomService.getOne(room_id);
        let table = await tableService.getOne(table_id);
        data["id"] = new Date().getTime();
        data["datetime"] = new Date().getTime();
        data["pay_sum"] = 0;
        data["room"] = room.name;
        data["table"] = table.name;
        data["common_service"] = 0;
        data["common_sum"] = 0
        data["all_sum"] = 0
        data["bonus"] = 0
        data["cash_sum"] = 0
        data["plastic_sum"] = 0
        data["comment"] = ""
        data["status"] = "active"
        data["waiter_id"] = 1;
        data["room_id"] = room_id;
        data["table_id"] = table_id;
        data["branch_id"] = 0;
        data["client_id"] = 0;
        data["credit_sum"] = 0;
        data['order_food'] = []
        order.value.push(data);
        return data.id;
    }
    const getOneOrder = (id) => {
        const ord = order.value.find((val) => val.id == id);
        if(ord != undefined) return ord.order_food
        return []
    }
    const addProduct = (id, product) => {
        const ord = order.value.find((val) => val.id == id);
        if(ord != undefined) {
            const index = ord.order_food.findIndex((val) => val.food_id == product.food_id);
            if(index == -1) {
                ord.order_food.push(product);
            } else {
                ord.order_food[index].amount += product.amount;
                ord.order_food[index].sum = ord.order_food[index].amount * ord.order_food[index].sell_price;
            }
        }
    }
    const deleteOrder = (id) => {
        const index = order.value.findIndex((val) => val.id == id);
        order.value.splice(index, 1);
    }
    return { order, addOrder, deleteOrder, getOneOrder, addProduct }
});