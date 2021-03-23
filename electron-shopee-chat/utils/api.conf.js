const { default: axios } = require('axios')
const storage = require('electron-localstorage')
storage.setStoragePath('./storage.json')

const malacca_token = storage.getItem('erpAuth')
  ? storage.getItem('erpAuth').access_token
  : null

const BASE_URL = 'https://test-erp.emalacca.com/api'
module.exports = API = {
  handleLoginShopee: function (params) {
    axios.defaults.headers['Authorization'] = 'Bearer ' + malacca_token
    return new Promise((resolve, reject) => {
      axios
        .post(BASE_URL + '/product/crawl/talk/login', params)
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
}
