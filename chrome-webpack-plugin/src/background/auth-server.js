//授权相关
// -1 接口错误 -2 数据错误
// import $ from 'jquery'
import { WEBSITES } from '@/lib/conf'
import { getStorage, handleJudgeLink } from '@/lib/utils'
import { isMatches } from '@/lib/content-scripts-config'
import { Request } from './shopee-server'
import { getCookies, sendMessageToContentScript } from '@/lib/chrome'
// 修改async await
const regeneratorRuntime = require('@/assets/js/runtime.js')

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  let { action, options, type } = request
  console.log(request, 'request')
  // 加载脚本css或js，manifest.json => content_scripts
  // isMatches判断url是否允许加载脚本
  if (type === 'EXECUTE_SCRIPT' && isMatches(sender.url)) {
    Promise.all(options.map(item => {
      executeScript(item, sender.tab?.id)
    }))
    return true
  }
  // 同步erp
  if (action == 'auth' && type == 'SYNC_ERP_AUTH_INFO') {
    Auth.syncErpToken(options, type, sendResponse)
    return true
  }

  // 同步虾皮用户信息
  if (action == 'auth' && type == 'SYNC_SHOPEE_BASE_INFO') {
    Auth.syncShoppeBaseInfo(options, type, sendResponse)
    return true
  }

  // 同步虾皮token
  if (action == 'auth' && type == 'SET_SHOPPE_CRSF_TOKEN') {
    Auth.setCookies(options, type, sendResponse)
    return true
  }

  // 获取采集站点的cookies
  if (action == 'auth' && type == 'GET_COLLECT_SITE_LOGIN_STATUS') {
    setTimeout(() => {
      Auth.getCollectSitesAuthInfo(options, type, sendResponse)
    }, 2000)
    return true
  }
  // 拦截采集站点登录行为
  if (action == 'auth' && type == 'INIT_COLLECT_SITE_LOGIN_ACTION') {
    Auth.handleInterceptCollectSiteLoginAction(options, type, sendResponse)
    return true
  }
})

export const Auth = {
  requestFlag: false,
  //同步虾皮登录token
  setCookies: function (params, type, call) {
    console.log(params, type)
    // 如果没有退出
    if (params.csrfToken && localStorage.setItem('csrfToken', params.csrfToken)) {
      call({ type: type, result: '设置成功' })
    }
  },

  //同步erptoken
  syncErpToken: function (params, type, call) {
    console.log(params, type)
    return new Promise((resolve, reject) => {
      let { authInfo } = params || {}
      if (authInfo.access_token) {
        let userInfo = {
          token: authInfo.access_token,
          userInfo: authInfo.userInfo.userInfo,
          system: params.origin
        }
        localStorage.setItem('pt-plug-access-user', JSON.stringify(userInfo))
        call({ type: type, result: localStorage.getItem('pt-plug-access-user') })
      } else {
        // 表示erp是没有登录
        localStorage.setItem('pt-plug-access-user', null)
        reject(-1)
      }
    }).catch(error => {
      console.log(error)
    })
  },

  // 配置虾皮平台信息
  syncShoppeBaseInfo: function (params, type, call) {
    console.log(params, type)
    let _this = this
    if (_this.requestFlag) {
      return false
    }
    const countryList = WEBSITES.map(el => el.key)
    // 如果当前是站点时cn站点并且userInfo的country和当前匹配，就直接用存下的
    let userInfo = getStorage('userInfo', null)
    let storageCountry = userInfo ? userInfo.countryCode : null
    let shopeeLoginStatus = localStorage.getItem('shopeeLoginStatus')
    if (shopeeLoginStatus == -1) {
      localStorage.setItem('userInfo', null)
      call({ type: type, code: -1, message: '刚退出或用户信息为空' })
      return false
    }
    try {
      if (
        (new RegExp(storageCountry).test(params.domain) && shopeeLoginStatus != -1) ||
        /xiapi\.xiapibuy|xiapi\.shopee/.test(params.domain)
      ) {
        console.log('同步国内站点')
        call({
          type: type,
          code: 0,
          result: {
            storeId: userInfo.shopid,
            username: userInfo.username,
            country: countryList.find(item => params.domain.match(new RegExp(item))) || 'tw',
            // 这里需要把 cs_token 送给前台 作为前台cookies中的 SPC_EC 同步用户状态
            cs_token: userInfo.cs_token
          }
        })
        // //就不用走后面登录了
        // return false
      }
    } catch (error) {
      console.log(error)
    }

    let currentCountryCode = countryList.find(item => params.domain.match(new RegExp(item)))
    _this.requestFlag = true
    Request.handleLoginShopee(params, type)
      .then(res => {
        if (res) {
          res.countryCode = currentCountryCode
          localStorage.setItem('userInfo', JSON.stringify(res))
        }
      })
      .catch(() => {
        call({ type: type, code: -1, message: '登录失败' })
      })
      .finally(() => {
        _this.requestFlag = false
        call({
          type: type,
          code: 0,
          result: {
            storeId: userInfo ? userInfo.shopid : null,
            username: userInfo ? userInfo.username : null,
            country: countryList.find(item => params.domain.match(new RegExp(item))) || 'tw',
            // 这里需要把 cs_token 送给前台 作为前台cookies中的 SPC_EC 同步用户状态
            cs_token: userInfo ? userInfo.cs_token : null
          }
        })
      })
  },

  // 1688登录状态检查
  check1688Auth: function () {
    return new Promise(resolve => {
      let addressUrl = 'https://wuliu.1688.com/foundation/receive_address_manager.htm'
      $.ajax({
        type: 'get',
        url: addressUrl,
        success: res => {
          let matchCsrf = /data-csrftoken="(.*?)"/.exec(res)
          if (matchCsrf) {
            getCookies({ domain: '.1688.com' }, async cookies => {
              console.log('1688 cookies:', cookies)
              let cookieStr = cookies.reduce((prev, curr) => {
                return `${curr.name}=${curr.value}; ` + prev
              }, '')
              resolve({ cookieStr: cookieStr, cookieArr: cookies })
            })
          } else {
            resolve(false)
          }
        }
      })
    })
  },

  // pdd登录状态检查
  checkPddAuth: function () {
    return new Promise(resolve => {
      getCookies({ domain: '.yangkeduo.com' }, async cookies => {
        try {
          let pddUserId = cookies.find(el => el.name == 'pdd_user_id').value
          let pddAccesstoken = cookies.find(el => el.name == 'PDDAccessToken').value
          if (pddUserId && pddAccesstoken) {
            let cookieStr = cookies.reduce((prev, curr) => {
              return `${curr.name}=${curr.value}; ` + prev
            }, '')
            resolve(cookieStr)
          } else {
            resolve(false)
          }
        } catch (error) {
          resolve(false)
        }
      })
    })
  },

  // 淘宝登录状态检查
  checkTaobaoAuth: function () {
    return new Promise(resolve => {
      getCookies({ domain: '.taobao.com' }, async cookies => {
        try {
          console.log('taobao cookies:', cookies)
          let lgc = cookies.find(el => el.name == 'lgc')
          let cookieStr = cookies.reduce((prev, curr) => {
            return `${curr.name}=${curr.value}; ` + prev
          }, '')
          //   let isOverdue = Date.parse(new Date()) / 1000 < lgc.expirationDate // 是否已过期
          if (lgc) {
            resolve({ cookieStr: cookieStr, cookieArr: cookies })
          } else {
            resolve(false)
          }
        } catch (error) {
          resolve(false)
        }
      })
    })
  },

  // 天猫登录状态检查
  checkTmallAuth: function () {
    return new Promise(resolve => {
      getCookies({ domain: '.tmall.com' }, async cookies => {
        try {
          console.log('tmall cookies:', cookies)
          let lgc = cookies.find(el => el.name == 'lgc')
          let cookieStr = cookies.reduce((prev, curr) => {
            return `${curr.name}=${curr.value}; ` + prev
          }, '')
          if (lgc) {
            resolve({ cookieStr: cookieStr, cookieArr: cookies })
          } else {
            resolve(false)
          }
        } catch (error) {
          resolve(false)
        }
      })
    })
  },

  // 获取采集站点的cookies
  getCollectSitesAuthInfo: async function (params, type, call) {
    console.log(params, type)
    const t1688LoginStatus = await Auth.check1688Auth()
    const pddLoginStatus = await Auth.checkPddAuth()
    const taobaoLoginStatus = await Auth.checkTaobaoAuth()
    const tmallLoginStatus = await Auth.checkTmallAuth()
    // 把阿里系的 x5sec 单独处理
    let taobaox5sec = taobaoLoginStatus
      ? taobaoLoginStatus.cookieArr.filter(item => item.name == 'x5sec')
      : []
    let tmallx5sec = tmallLoginStatus
      ? tmallLoginStatus.cookieArr.filter(item => item.name == 'x5sec')
      : []
    let t1688x5sec = t1688LoginStatus
      ? t1688LoginStatus.cookieArr.filter(item => item.name == 'x5sec')
      : []
    let alibabaValidCookies = [].concat(taobaox5sec, tmallx5sec, t1688x5sec)
    let taobaoNormalCookies = taobaoLoginStatus
      ? taobaoLoginStatus.cookieArr
        .filter(item => item.name != 'x5sec')
        .reduce((prev, curr) => {
          return `${curr.name}=${curr.value}; ` + prev
        }, '')
      : false
    let tmallNormalCookies = tmallLoginStatus
      ? tmallLoginStatus.cookieArr
        .filter(item => item.name != 'x5sec')
        .reduce((prev, curr) => {
          return `${curr.name}=${curr.value}; ` + prev
        }, '')
      : false
    let t1688NormalCookies = t1688LoginStatus
      ? t1688LoginStatus.cookieArr
        .filter(item => item.name != 'x5sec')
        .reduce((prev, curr) => {
          return `${curr.name}=${curr.value}; ` + prev
        }, '')
      : false
    call({
      code: 0,
      result: {
        pddLoginStatus: pddLoginStatus,
        t1688LoginStatus: t1688NormalCookies, //这里先去掉，用的时候单独加
        taobaoLoginStatus: taobaoNormalCookies,
        tmallLoginStatus: tmallNormalCookies,
        alibabaValidCookies: JSON.stringify(alibabaValidCookies)
      },
      message: null
    })
  },

  // 对采集站点操作行为进行拦截
  handleInterceptCollectSiteLoginAction: async function (params, type, call) {
    console.log(params, type)
    chrome.webRequest.onCompleted.addListener(
      function (details) {
        //对采集站点登录行为进行拦截
        if (/login\.do/.test(details.url) && details.statusCode == 200) {
          console.log('登录成功')
          let siteMatch = handleJudgeLink(details.url)
          call({
            code: 0,
            result: siteMatch,
            message: `监听到${siteMatch.siteName}登录成功`
          })
        }
        if (/_____tmd_____/.test(details.url) && details.statusCode == 200) {
          console.log('阿里巴巴出现了验证码')
          sendMessageToContentScript({ type: 'UPDATE_SITE_COOKIES' }, function (response) {
            console.log(response, 'UPDATE_SITE_COOKIES')
          })
        }
        if (/sib\.htm/.test(details) && details.statusCode == 200) {
          console.log('详情页数据请求')
          sendMessageToContentScript({ type: 'UPDATE_SITE_COOKIES' }, function (response) {
            console.log(response, 'UPDATE_SITE_COOKIES')
          })
        }
      },
      {
        urls: [
          '*://*.taobao.com/*',
          '*://*.tmall.com/*',
          '*://*.1688.com/*',
          '*://*.yangkeduo.com/*'
        ]
      }
    )
  }
}

// 读取url的数据,加载脚本js或css到页面, manifest.json => content_scripts
function executeScript(item, tabId = null) { 
  let xhr = new XMLHttpRequest()
  let url = item.url + '?time=' + new Date().getTime()
  xhr.open('GET', url)
  xhr.responseType = 'blob'
  xhr.onload = function () {
    const reader = new FileReader()
    reader.onload = () => {
      // 加载脚本js或css到页面
      let insertExecuteType = item.type === 'js' ? chrome.tabs.executeScript : chrome.tabs.insertCSS
      insertExecuteType(
        tabId,
        {
          code: reader.result,
          runAt: 'document_end'
        }
      )
    }
    reader.readAsText(this.response)
  }
  xhr.send();
}