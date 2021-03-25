const { app } = require('electron')
const storage = require('electron-localstorage')
const API = require('./api.conf')
const Lib = require('./lib')
const Store = require('electron-store')

let store = new Store({})

const log = require('electron-log')
const path = require('path')

storage.setStoragePath(path.join(app.getAppPath(), 'storage.json')) // stoage存储路径

module.exports = server = {
  //获取已授权店铺
  getAuthedAtore: function () {
    log.info('======================getAuthedAtore start======================')
    return new Promise(resolve => {
      API.handleGetChatClientStore().then(storeList => {
        if (storeList && storeList.length > 0) {
          let firstStore = storeList[0] //默认第一个店铺
          let { countryCode, shopId } = firstStore
          store.set('currentSite', countryCode)
          store.set('currentStore', shopId)
          store.set('storeMenuList', Lib.groupStore(storeList))
          log.info(storeList)
          log.info(
            '======================getAuthedAtore end======================'
          )
          resolve(0)
        } else {
          //没有店铺
          resolve(-1)
        }
      })
    })
  },

  //获取店铺授权信息列表
  getStoreAuthInfo: function () {
    log.info(
      '======================getStoreAuthInfo start======================'
    )
    return new Promise(resolve => {
      API.handleGetStoresAuthInfo().then(authInfo => {
        if (Object.keys(authInfo).length > 0) {
          authInfo.expires_time = Date.parse(new Date()) / 1000 + 3600 * 5 * 24 //授权过期的具体时间 5 天
          storage.setItem('authedStore', authInfo)
          resolve(0)
        } else {
          resolve(-1)
        }
        log.info(authInfo)
        log.info(
          '======================getStoreAuthInfo end======================'
        )
      })
    })
  },

  // 解绑店铺
  handleRemoveBindStore: function (storeId) {
    return new Promise((resolve, reject) => {
      API.handleRemoveStore(storeId)
        .then(res => {
          if (res.dada) {
            resolve(0)
          } else {
            reject(-1)
          }
        })
        .catch(error => {
          reject(-1)
          log.error('handleRemoveBindStore error:', Lib.getError(error))
        })
    })
  },
}
