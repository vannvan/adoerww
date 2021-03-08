//授权相关
// -1 接口错误 -2 数据错误
// import $ from 'jquery'
import { WEBSITES } from '@/lib/conf'
import { getStorage } from '@/lib/utils'
import { Request } from './shopee-server'

// import { backEvent } from './server/server'

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  let { action, options, type } = request
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
})

export const Auth = {
  //同步虾皮登录token
  setCookies: function(params, type, call) {
    console.log(params, type)
    if (params.csrfToken && localStorage.setItem('csrfToken', params.csrfToken)) {
      call({ type: type, result: '设置成功' })
    }
  },

  //同步erptoken
  syncErpToken: function(params, type, call) {
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
  syncShoppeBaseInfo: function(params, type, call) {
    console.log(params, type)
    const countryList = WEBSITES.map(el => el.key)
    // 如果当前是站点时cn站点并且userInfo的country和当前匹配，就直接用存下的
    let userInfo = getStorage('userInfo', {})
    let currentCountryCode = countryList.find(item => params.domain.match(new RegExp(item)))
    // if (userInfo.countryCode == currentCountryCode ) {
    //   call({
    //     type: type,
    //     code: 0
    //   })
    //   return false
    // }
    Request.handleLoginShopee(params, type)
      .then(res => {
        if (res) {
          res.countryCode = currentCountryCode
          localStorage.setItem('userInfo', JSON.stringify(res))
        }
      })
      .catch(() => {
        call({ type: type, code: -1 })
      })
      .finally(() => {
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
      })
  }
}
