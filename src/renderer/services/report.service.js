import axios from 'axios'

const END_POINT = '/akt-sverka'

class ReportService {
  restrCaisher(data) {
    return axios.post(END_POINT + '/restr-caisher', data).then((res) => {
      return res;
    })
  }
  refundFood(data) {
    return axios.post(END_POINT + '/refund-food', data).then((res) => {
      return res;
    })
  }
  supplierReports(data) {
    return axios.post(END_POINT + '/supplier', data).then((res) => {
      return res;
    })
  }
  waiterReports(data) {
    return axios.post(END_POINT + '/waiter', data).then((res) => {
      return res;
    })
  }
  chefReports (data) {
    return axios.post(END_POINT + '/chef-report', data).then((res) => {
      return res;
    })
  }
  caisherReports (data) {
    return axios.post(END_POINT + '/caisher-report', data).then((res) => {
      return res;
    })
  }
  profitReports(data) {
    return axios.post(END_POINT + '/profit-food', data).then((res) => {
      return res;
    })
  }
  productAktSverka(data) {
    return axios.post(END_POINT + '/product-act', data).then((res) => {
      return res;
    })
  }

  soldFoodSverka(data) {
    return axios.post(END_POINT + '/sold-food', data).then((res) => {
      return res;
    })
  }

  workerAct(data) {
    return axios.post(END_POINT + '/worker-act', data).then((res) => {
      return res;
    })
  }
  
}
export default new ReportService()
