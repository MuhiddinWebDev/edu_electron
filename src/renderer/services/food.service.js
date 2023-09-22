import axios from 'axios'

const END_POINT = '/food'

class FoodService {
  getAll() {
    return axios.get(END_POINT + '/').then((res) => {
      return res.data
    })
  }
  create(data) {
    return axios
      .post(END_POINT + '/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        return res.data
      })
  }
  update(id, data) {
    return axios
      .patch(END_POINT + `/id/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
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
  search(data) {
    return axios.post(END_POINT + `/search`, data).then((res) => {
      return res.data
    })
  }
  stopFood(id) {
    return axios.get(END_POINT + `/stopfood/id/${id}`).then((res) => {
      return res.data;
    })
  }
  startFood(id) {
    return axios.get(END_POINT + `/startfood/id/${id}`).then((res) => {
      return res.data;
    })
  }
  updatePopular(id, data) {
    return axios.post(END_POINT + `/set-popular/${id}`, data).then((res) => {
      return res.data;
    })
  }
  getPopulars () {
    return axios.get(END_POINT + `/populars`).then((res) => {
      return res.data;
    })
  }
}
export default new FoodService()
