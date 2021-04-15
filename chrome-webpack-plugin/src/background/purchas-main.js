import purchas1688AddAddress from './purchas-1688'
import purchasePddAddAddress from './purchas-pdd'
import { setStorageSync, getStorageSync, getTabId2, getCookies, getAllTabs } from '@/lib/chrome'
var contentNotify = {} //content-script 消息通知
import { CONFIGINFO } from '@/background/config.js'

class Purchas {
  constructor() {
    this.t1688 = null
    this.pdd = null
    this.userInfo = JSON.parse(localStorage.getItem('pt-plug-access-user'))
    this.purchaseOrderInfo = {}
  }
  init() {
    let _this = this
    chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
      let { action, options, type } = request
      console.log(type, options, action)
      contentNotify = {
        type: type,
        sendResponse: sendResponse
      }
      _this.pdd = new purchasePddAddAddress({
        contentNotify: contentNotify
      })
      _this.t1688 = new purchas1688AddAddress({
        contentNotify: contentNotify
      })
      if (action == 'purchas' && type == 'INIT_ORDER_INFO') {
        let { purchasLink, orderInfo } = options
        chrome.tabs.create({ url: purchasLink, selected: true }, async function(nextTab) {
          orderInfo.tabId = nextTab.id
          setStorageSync({ orderInfo: orderInfo }) //存储orderInfo
          _this.purchaseOrderInfo = orderInfo

          if (/1688/.test(purchasLink)) {
            _this.t1688.initListener()
          }
          if (/yangkeduo/.test(purchasLink)) {
            _this.pdd.initListener()
          }
        })
        return true
      }

      if (action == 'purchas' && type == 'CHECK_CURRENT_TAB_ORDER') {
        let { currentSite } = options
        try {
          let tabOrderInfo = await getStorageSync('orderInfo')
          let {
            orderInfo: { tabId }
          } = tabOrderInfo
          getTabId2(async currentTabId => {
            if (tabId == currentTabId) {
              if (currentSite == '1688') {
                const t1688LoginStatus = await _this.t1688.validateAddress(tabOrderInfo.orderInfo)
                !t1688LoginStatus &&
                  sendResponse({ code: -1, result: null, message: '请登录1688后刷新此页面' })
              }
              if (currentSite == 'yangkeduo') {
                const pddLoginStatus = await _this.pdd.validateAddress(tabOrderInfo.orderInfo)
                !pddLoginStatus &&
                  sendResponse({ code: -1, result: null, message: '请登录拼多多后刷新此页面' })
              }
              sendResponse({ code: 0, result: tabOrderInfo, message: null })
            }
          })
        } catch (error) {
          // sendResponse({ code: -2, result: tabOrderInfo, message: '当前标签页不匹配' })
          console.error(error)
        }
      }

      if (action == 'purchas' && type == 'SUBMIT_PURCHAS_ORDER_NUMBER') {
        try {
          console.log('订单号:', options)
          getCookies(options.siteOrigin, async cookies => {
            let cookieStr = cookies.reduce((prev, curr) => {
              return `${curr.name}=${curr.value}; ` + prev
            }, '')
            console.log(`${options.siteOrigin}cookies:`, cookieStr)
            let tabOrderInfo = await getStorageSync('orderInfo')
            let { orderInfo } = tabOrderInfo
            let updateParams = {
              ordersn: orderInfo.ordersn,
              purchaseOrderno: options.purchaseOrderno,
              status: 2,
              reqCookie: cookieStr
            }
            let orderStatus = _this.updatePurchasStatus(updateParams)
            if (orderStatus) {
              sendResponse({
                code: 0,
                result: null,
                message: '关联马六甲订单成功，请继续完成付款'
              })
              _this.refreshERPsystem()
            } else {
              sendResponse({
                code: -1,
                result: null,
                message: '关联马六甲订单失败，请关闭页面重新下单'
              })
            }
          })
        } catch (error) {
          sendResponse({
            code: -1,
            result: null,
            message: '关联马六甲订单失败，请关闭页面重新下单'
          })
          console.error(error)
        }
      }

      if (action == 'purchas' && type == 'GET_PURCHAS_SITE_LOGIN_STATUS') {
        const t1688LoginStatus = await _this.t1688.checkLogin()
        const pddLoginStatus = await _this.pdd.checkLogin()
        sendResponse({
          code: 0,
          result: { pddLoginStatus: pddLoginStatus, t1688LoginStatus: t1688LoginStatus },
          message: null
        })
        console.log('pdd登录状态', pddLoginStatus, '1688登录状态', t1688LoginStatus)
      }
    })
  }

  updatePurchasStatus(data) {
    let _this = this
    return new Promise(resolve => {
      $.ajax({
        url: CONFIGINFO.url.updatePurchasStatus(),
        type: 'post',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        headers: {
          Authorization: 'Bearer ' + _this.userInfo.token
        },
        success: res => {
          console.log('updatePurchasStatus', res.data)
          if (res.data) {
            resolve(true)
          } else {
            resolve(false)
          }
        },
        error: error => {
          console.error(error)
          resolve(false)
        }
      })
    })
  }

  //刷新erp
  refreshERPsystem() {
    getAllTabs(urls => {
      urls.map(el => {
        if (el.url.match(/192|emalacca/)) {
          chrome.tabs.sendMessage(el.id, { type: 'UPDATE_PAGE' }, function(response) {
            console.log('UPDATE_PAGE', response)
          })
        }
      })
    })
  }
}

const purchas = new Purchas()
purchas.init()
