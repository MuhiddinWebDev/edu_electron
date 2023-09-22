import axios from 'axios'

const END_POINT = '/food-group'

class FoodgroupService {
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
  getByParentId(id) {
    return axios.get(END_POINT + `/groups/group_id/${id}`).then((res) => res.data)
  }
  getByParentIdFoodForEnable(id) {
    return axios.get(END_POINT + `/foods-enable/group_id/${id}`).then((res) => res.data)
  }
  getByParentIdFood(id) {
    return axios.get(END_POINT + `/foods/group_id/${id}`).then((res) => res.data)
  }
  getByBranchId (id) {
    return axios.get(END_POINT + `/groups/branch_id/${id}`).then((res) => res.data)
  }
}
export default new FoodgroupService()
