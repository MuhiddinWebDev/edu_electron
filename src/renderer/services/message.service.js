import axios from "axios";
const END_POINT = "/send-message";

class Service {
  getAll(data) {
    return axios.post(END_POINT + "/all", data).then((res) => {
      return res;
    });
  }
}
export default new Service();
