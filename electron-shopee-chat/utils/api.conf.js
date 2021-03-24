const { default: axios } = require('axios')
const storage = require('electron-localstorage')
storage.setStoragePath('./storage.json')

const malacca_token = storage.getItem('erpAuth')
  ? storage.getItem('erpAuth').access_token
  : null

const BASE_URL = 'https://pre-erp.emalacca.com/api'
module.exports = API = {
  // shoppe登录
  handleLoginShopee: function (params) {
    axios.defaults.headers['Authorization'] = 'Bearer ' + malacca_token
    return new Promise((resolve, reject) => {
      axios
        .post(BASE_URL + '/product/crawl/talk/login', params)
        .then(res => {
          resolve(res.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 下载模板
  downloadExecle: function () {
    axios.defaults.headers['Authorization'] = 'Bearer ' + malacca_token
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        url: BASE_URL + '/product/crawl/talk/file/get-store-import-template',
        responseType: 'blob',
      })
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 获取店铺
  getErpStoreList: function () {
    axios.defaults.headers['Authorization'] = 'Bearer ' + malacca_token
    return new Promise((resolve, reject) => {
      axios
        .post(BASE_URL + '/product/crawl/talk/erp/store-list')
        .then(res => {
          resolve(res.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  handleRemoveStore: function (storeId) {
    axios.defaults.headers['Authorization'] = 'Bearer ' + malacca_token
    let data = {
      shopId: storeId,
    }
    return new Promise((resolve, reject) => {
      axios
        .post(BASE_URL + '/product/crawl/talk/del-store', data)
        .then(res => {
          resolve(res.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
}
