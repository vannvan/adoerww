// const { app } = require('electron')
const storage = require('electron-localstorage')
const API = require('./api.conf')
const Lib = require('./lib')
const Store = require('electron-store')

let store = new Store({})

const log = require('electron-log')
// const path = require('path')
storage.setStoragePath('./storage.json') // stoage存储路径

module.exports = server = {
  //获取已授权店铺
  getAuthedAtore: function () {
    log.info('======================getAuthedAtore start======================')
    return new Promise(async resolve => {
      let storeList = await API.handleGetChatClientStore()
      if (storeList && storeList.length > 0) {
        //可能会有垃圾数据，需要确保shopId和countryCode都存在的店铺
        let fisrtIndex = storeList.findIndex(el => el.shopId && el.countryCode)
        //如果连这个都没有就说明没有店铺
        if (!fisrtIndex) {
          store.set('storeMenuList', null)
          resolve(-1)
        }
        log.info('fisrt store', storeList[fisrtIndex])
        let { countryCode, shopId } = storeList[fisrtIndex] //默认第一个店铺
        store.set('currentSite', countryCode)
        store.set('currentStore', shopId)
        store.set('storeMenuList', Lib.groupStore(storeList))
        resolve(storeList)
      } else {
        log.error('store is empty')
        resolve(-1)
      }
      log.info(storeList)
      log.info('======================getAuthedAtore end======================')
    })
  },

  //获取店铺授权信息列表
  getStoreAuthInfo: function () {
    log.info(
      '======================getStoreAuthInfo start======================'
    )
    return new Promise(async resolve => {
      let authInfo = await API.handleGetStoresAuthInfo()
      if (Object.keys(authInfo).length > 0) {
        let time = Date.parse(new Date()) / 1000 + 3600 * 5 * 24 //授权过期的具体时间 5 天
        storage.setItem('authedStore', authInfo)
        storage.setItem('authedStoreExpires', time)
        resolve(authInfo)
      } else {
        log.error('store authInfo is empty')
        resolve(-1)
      }
      log.info(authInfo)
      log.info(
        '======================getStoreAuthInfo end======================'
      )
    })
  },

  // 解绑店铺
  handleRemoveBindStore: function (storeId) {
    log.info(
      '======================handleRemoveBindStore start======================'
    )
    return new Promise((resolve, reject) => {
      API.handleRemoveStore(storeId)
        .then(res => {
          resolve(res.data)
          log.info(res.data)
          log.info(
            '======================handleRemoveBindStore end======================'
          )
        })
        .catch(error => {
          log.error('handleRemoveBindStore error:', Lib.getError(error))
          reject(-1)
        })
    })
  },
}
