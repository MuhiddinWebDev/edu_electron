import axios from 'axios'

const END_POINT = '/pay_waiter'

class PayWaiterService {
  getAll() {
    return axios.get(END_POINT + '/').then((res) => {
      return res.data
    })
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
}
export default new PayWaiterService()
