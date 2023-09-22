import axios from 'axios'

const END_POINT = '/order'

class OrderService {
  getAll() {
    return axios.get(END_POINT + '/').then((res) => {
      return res.data
    })
  }
  getAllCompletes() {
    return axios.get(END_POINT + '/completes').then((res) => {
      return res.data
    })
  }
  getComplete(id) {
    return axios.get(END_POINT + `/complete/${id}`).then((res) => {
      return res.data
    })
  }
  firstOrder (data) {
    return axios.post(END_POINT + '/first-order-step', data).then((res) => {
      return res.data
    });
  }
  create(data) {
    return axios.post(END_POINT + '/', data).then((res) => {
      return res.data
    })
  }
  update(id, data) {
    return axios
      .patch(END_POINT + `/id/${id}`, data)
      .then((res) => {
        return res.data
      })
  }
  getOne(id) {
    return axios.get(END_POINT + `/id/${id}`).then((res) => {
      return res.data
    })
  }
  delete(id) {
    return axios.delete(END_POINT + `/id/${id}`).then((res) => {
      return res.data
    })
  }
  addOrderFoods(data) {
    return axios.post(END_POINT + `/add-foods-to-order`, data).then((res) => {
      return res.data
    })
  }
  getChiefOrderList() {
    return axios.get(END_POINT+`/restr-food-list`).then((res) => {
      return res.data
    })
  }
  getOrderFoodById (id) {
    return axios.get(END_POINT+`/orderfoods/order_id/${id}`).then((res) => {
      return res.data
    })
  }
  sendToKitchen (data) {
    return axios.post(END_POINT + `/send-foods-to-kitchen`, data).then((res) => {
      return res.data
    })
  }
  setProccessing(id) {
    return axios.get(END_POINT + `/set-proccessing-for-food/id/${id}`).then((res) => {
      return res.data
    })
  }
  setComplete(id) {
    return axios.get(END_POINT + `/set-completed-for-food/id/${id}`).then((res) => {
      return res.data
    })
  }
  payment(id, data) {
    return axios.post(END_POINT + `/payment/${id}`, data).then((res) => {
      return res.data
    })
  }
}
export default new OrderService()
