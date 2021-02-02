import $ from 'jquery'
import { ShopeModal } from '../config/modal.js'
import { isEmpty } from '@/lib/utils'

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request && request.sign === 'signShope') {
    if (request.action === 'checkLoginStatus') {
      backEvent.checkLoginStatus(sendResponse)
      return true
    } else if (request.action === 'getHtml') {
      backEvent.getHtml(request.data, sendResponse)
      return true
    } else if (request.action === 'getCrawlHtml') {
      backEvent.getCrawlHtml(request.data, sendResponse)
      return true
    } else if (request.action === 'postCrawlHtml') {
      backEvent.postCrawlHtml(request.data, sendResponse)
      return true
    } else if (request.action === 'getData') {
      backEvent.getData(request.data, sendResponse)
      return true
    } else if (request.action === 'check1688') {
      backEvent.check1688Verify(request.data, sendResponse)
      return true
    }
  }
})

export const backEvent = {
  //获取用户登录状态
  checkLoginStatus: function(call) {
    var statusData = {
      status: false
    }
    let userInfo = localStorage.getItem('pt-plug-access-user')
    if (!isEmpty(userInfo) && userInfo !== 'undefined' && JSON.parse(userInfo) !== null) {
      let obj = JSON.parse(userInfo)
      // account = obj.user
      // uid = obj.token
      statusData.data = obj
      statusData.status = true
      statusData.brandData = []
      //call(statusData)
      localStorage.setItem('brandData', '[]')
      statusData.brandData = localStorage.getItem('brandData')
      return call(statusData)

      /*$.ajax({
        url: CONFIGINFO.url.BrandAPI(),
        type: 'POST',
        headers: {
          Authorization: 'Bearer ' + obj.token,
        },
        timeout: 30000,
        success: function (res) {
          localStorage.setItem('brandData', JSON.stringify(res.data))
          statusData.brandData = localStorage.getItem('brandData')
          return call(statusData)
        },
        complete: function (XMLHttpRequest, status) {
          if (status == 'timeout') {
            tt < 3
              ? init(t, tt + 1)
              : $.fn.message({ type: 'error', msg: '请求超时，请稍后重试！' })
          } else if (status == 'error') {
            $.fn.message({ type: 'error', msg: '请求出错，请联系管理员！' })
          }
        },
      })*/
    } else {
      console.log(22222222223)
      statusData.status = false
      $('#topLoginDiv').hide()
      $('#topNoLoginDiv').show()
      ShopeModal.show('#loginModal')
      return call(statusData)
    }
  },
  //获取采集页面
  getHtml: function(data, call) {
    var url = data.url,
      try_times = data.try_times,
      callback = data.callback,
      sync = data.sync == 'false' ? false : true

    $.ajax({
      url: url,
      type: 'GET',
      async: sync,
      timeout: 60000,
      data: {},
      success: function(data) {
        typeof data == 'object' && (data = JSON.stringify(data))
        call({ html: data })
      },
      complete: function(XMLHttpRequest, status) {
        /*let { code } = XMLHttpRequest.responseJSON
        if (/300/.test(code)) {
          call({ code: -1, msg: '授权过期，请重新登录' })
          return
        }*/
        if (status == 'timeout') {
          try_times >= 3
            ? call({ html: '' })
            : setTimeout(function() {
                var dataNew = {
                  url: url,
                  try_times: try_times + 1,
                  callback: callback
                }
                backEvent.getHtml(dataNew, call)
              }, 5000)
        } else if (status == 'parsererror') {
          var data = XMLHttpRequest.responseText
          call({ html: data })
        } else if (status == 'error') {
          call({ html: '' })
        }
      }
    })
  },
  //去后台采集
  getCrawlHtml: function(data, call) {
    var url = data.url,
      params = data.params,
      async = data.sync == false ? false : true
    $.ajax({
      url: url,
      type: 'GET',
      timeout: 16000,
      async: async,
      headers: {
        Authorization: 'Bearer ' + params.token
      },
      data: {
        detailUrl: params.detailUrl,
        type: 1,
        token: params.token,
        baseURL: params.baseURL
      },
      dataType: 'json',
      success: function(data) {
        call({
          code: -1,
          msg: `授权过期，请重新<a href="${chrome.extension.getURL(
            'presentation/presentation.html'
          )}">登录</a>`
        })
        // data.msg = '采集成功！'
        // call(data)
      },
      error: function() {
        //增加访问出错信息返回
        // call({ code: 0, msg: '请求出错请联系管理员' })
      },
      complete: function(XMLHttpRequest, status) {
        let code = ''
        if (!isEmpty(XMLHttpRequest)) {
          code = XMLHttpRequest.responseJSON.code
        }
        if (/300/.test(code)) {
          call({
            code: -1,
            msg: `授权过期，请重新<a href="${chrome.extension.getURL(
              'presentation/presentation.html'
            )}">登录</a>`
          })
          return
        }
        if (status == 'error') {
          call({ code: -1, msg: '请求出错' })
        } else if (status == 'parsererror') {
          call({ code: -1, msg: '请先登录采集助手账号' })
        } else if (status == 'timeout') {
          call({ code: 0, msg: '请求超时' })
        }
      }
    })
  },
  //去后台采集
  postCrawlHtml: function(data, call) {
    var url = data.url,
      params = data.params,
      async = data.sync == false ? false : true
    $.ajax({
      url: url,
      type: 'POST',
      timeout: 60000,
      async: async,
      data: JSON.stringify(params),
      contentType: 'application/json',
      dataType: 'json',
      headers: {
        Authorization: 'Bearer ' + params.token
      },
      success: function(data) {
        data.msg = '采集成功！'
        call(data)
      },
      error: function() {
        //增加访问出错信息返回
        // call({ code: 0, msg: '请求出错请联系管理员' })
      },
      complete: function(XMLHttpRequest, status) {
        let code = ''
        if (!isEmpty(XMLHttpRequest)) {
          code = XMLHttpRequest.responseJSON.code
        }
        if (/300/.test(code)) {
          call({
            code: -1,
            msg: `授权过期，请重新<a href="${chrome.extension.getURL(
              'presentation/presentation.html'
            )}">登录</a>`
          })
          return
        }
        if (status == 'error') {
          call({ code: -1, msg: '请求出错' })
        } else if (status == 'parsererror') {
          call({ code: -1, msg: '请先登录采集助手账号' })
        } else if (status == 'timeout') {
          call({ code: 0, msg: '请求超时' })
        }
      }
    })
  },
  //获取数据
  getData: function(data, call) {
    var url = data.url,
      try_times = data.try_times,
      callback = data.callback

    $.ajax({
      url: url,
      type: 'GET',
      timeout: 60000,
      data: {},
      async: false,
      success: function(data) {
        typeof data == 'object' && (data = JSON.stringify(data))
        call({ html: data })
      },
      complete: function(XMLHttpRequest, status) {
        let code = ''
        if (!isEmpty(XMLHttpRequest)) {
          code = XMLHttpRequest.responseJSON.code
        }
        if (/300/.test(code)) {
          call({
            code: -1,
            msg: `授权过期，请重新<a href="${chrome.extension.getURL(
              'presentation/presentation.html'
            )}">登录</a>`
          })
          return
        }
        if (status == 'timeout') {
          try_times >= 3
            ? call({ html: '' })
            : setTimeout(function() {
                var dataNew = {
                  url: url,
                  try_times: try_times + 1,
                  callback: callback
                }
                backEvent.getData(dataNew, call)
              }, 5000)
        } else if (status == 'parsererror') {
          var data = XMLHttpRequest.responseText
          call({ html: data })
        } else if (status == 'error') {
          call({ html: '' })
        }
      }
    })
  },
  check1688Verify: function(data, call) {
    var url = data.url,
      params = data.params,
      async = data.sync == false ? false : true
    $.ajax({
      url: url,
      type: 'POST',
      timeout: 60000,

      async: async,
      data: params,
      dataType: 'json',
      success: function(data) {
        if (data.code == 0) {
          if (data.data == 0) {
            call({ code: 0, msg: '认证成功' })
          } else if (data.data == 1) {
            call({ code: 1, msg: '注意: 1688未授权或授权到期' })
          }
        }
      },
      error: function() {
        //增加访问出错信息返回
        // call({ code: 0, msg: '请求出错请联系管理员' })
      },
      complete: function(XMLHttpRequest, status) {
        if (status == 'error') {
          call({ code: -1, msg: '请求出错' })
        } else if (status == 'timeout') {
          call({ code: 0, msg: '请求超时' })
        }
      }
    })
  }
}

var tabId = null
// chrome.browserAction.onClicked.addListener(function () {
//   var index = chrome.extension.getURL('presentation/presentation.html')
//   tabId
//     ? chrome.tabs.update(tabId, { selected: true })
//     : chrome.tabs.create({ url: index }, function (tab) {
//         tabId = tab.id
//       })
// })
chrome.tabs.onRemoved.addListener(function(tid) {
  tid === tabId && (tabId = null)
})

chrome.contextMenus.create({
  type: 'normal',
  title: '采集此产品',
  contexts: ['all'],
  id: 'menuCrawl',
  onclick: menuCrawl
})

function menuCrawl(info, tab) {
  var url
  if (info.linkUrl == undefined) {
    url = info.pageUrl
  } else {
    url = info.linkUrl
  }
  chrome.tabs.sendMessage(tab.id, { url: url }, function(response) {
    // console.log('response::' + response)
  })
}
