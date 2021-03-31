const { default: axios } = require('axios')
const storage = require('electron-localstorage')
storage.setStoragePath('./storage.json')
const log = require('electron-log')

function getToken() {
  return storage.getItem('erpAuth')
    ? storage.getItem('erpAuth').access_token
    : null
}
axios.defaults.timeout = 10000 //设置超时时间,单位毫秒

module.exports = API = {
  BASE_URL: 'https://pre-erp.emalacca.com/api',
  //   BASE_URL: 'http://192.168.50.87:8999',
  // shoppe登录
  handleLoginShopee: function (params) {
    axios.defaults.headers['Authorization'] = 'Bearer ' + getToken()
    return new Promise((resolve, reject) => {
      axios
        .post(this.BASE_URL + '/product/crawl/talk/login', params)
        .then(res => {
          resolve(res.data)
        })
        .catch(error => {
          log.error('handleLoginShopee', Lib.getError(error))
          reject(error)
        })
    })
  },

  //新增店铺
  handleAddStore: function (params) {
    axios.defaults.headers['Authorization'] = 'Bearer ' + getToken()
    return new Promise((resolve, reject) => {
      axios
        .post(this.BASE_URL + '/product/crawl/talk/add-store', params)
        .then(res => {
          resolve(res.data)
        })
        .catch(error => {
          log.error('handleAddStore', Lib.getError(error))
          reject(error)
        })
    })
  },

  // 下载模板
  downloadExecle: function () {
    axios.defaults.headers['Authorization'] = 'Bearer ' + getToken()
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        url:
          this.BASE_URL + '/product/crawl/talk/file/get-store-import-template',
        responseType: 'blob',
      })
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          log.error('downloadExecle', Lib.getError(error))
          reject(error)
        })
    })
  },
  // 获取erp店铺
  getErpStoreList: function () {
    axios.defaults.headers['Authorization'] = 'Bearer ' + getToken()
    return new Promise((resolve, reject) => {
      axios
        .post(this.BASE_URL + '/product/crawl/talk/erp/store-list')
        .then(res => {
          resolve(res.data)
        })
        .catch(error => {
          log.error('getErpStoreList', Lib.getError(error))
          reject(error)
        })
    })
  },

  // 导入文件店铺
  importStoreFile: function (params) {
    axios.defaults.headers['Authorization'] = 'Bearer ' + getToken()
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        data: params,
        url: this.BASE_URL + '/product/crawl/talk/file/import-store',
      })
        .then(res => {
          resolve(res.data)
        })
        .catch(error => {
          log.error('importStoreFile', Lib.getError(error))
          reject(error)
        })
    })
  },

  //import Erp店铺
  importErpStore: function (params) {
    axios.defaults.headers['Authorization'] = 'Bearer ' + getToken()
    return new Promise((resolve, reject) => {
      axios
        .post(this.BASE_URL + '/product/crawl/talk/erp/import-store', params)
        .then(res => {
          resolve(res.data)
        })
        .catch(error => {
          log.error('importErpStore', Lib.getError(error))
          reject(error)
        })
    })
  },

  //解绑店铺
  handleRemoveStore: function (storeId) {
    axios.defaults.headers['Authorization'] = 'Bearer ' + getToken()
    let data = {
      shopId: storeId,
    }
    return new Promise((resolve, reject) => {
      axios
        .post(this.BASE_URL + '/product/crawl/talk/del-store', data)
        .then(res => {
          resolve(res.data)
        })
        .catch(error => {
          log.error('handleRemoveStore', Lib.getError(error))
          reject(error)
        })
    })
  },

  //获取聊聊店铺列表
  handleGetChatClientStore: function () {
    axios.defaults.headers['Authorization'] = 'Bearer ' + getToken()
    return new Promise((resolve, reject) => {
      axios
        .post(this.BASE_URL + '/product/crawl/talk/store-list')
        .then(res => {
          resolve(res.data.data)
        })
        .catch(error => {
          log.error('handleGetChatClientStore', Lib.getError(error))
          reject(error)
        })
    })
  },

  //获取聊聊店铺授权列表，token，cookies
  handleGetStoresAuthInfo: function () {
    axios.defaults.headers['Authorization'] = 'Bearer ' + getToken()
    return new Promise((resolve, reject) => {
      axios
        .post(this.BASE_URL + '/product/crawl/talk/store/all/get-token')
        .then(res => {
          resolve(res.data.data)
        })
        .catch(error => {
          log.error('handleGetStoresAuthInfo', Lib.getError(error))
          reject(error)
        })
    })
  },

  //修改店铺别名
  handleModifyAliasName: function (params) {
    axios.defaults.headers['Authorization'] = 'Bearer ' + getToken()
    let data = {
      shopId: params.storeId,
      storeAlias: params.aliasName,
    }
    return new Promise((resolve, reject) => {
      axios
        .post(this.BASE_URL + '/product/crawl/talk/update-store-alias', data)
        .then(res => {
          resolve(res.data.data)
        })
        .catch(error => {
          log.error('handleModifyAliasName', Lib.getError(error))
          reject(error)
        })
    })
  },
}
