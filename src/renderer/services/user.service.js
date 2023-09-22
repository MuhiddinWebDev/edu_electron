import axios from 'axios'

const END_POINT = '/user'

class UserService {
  getAll() {
    return axios.get(END_POINT + '/').then((res) => {
      return res.data
    })
  }
}
export default new UserService()