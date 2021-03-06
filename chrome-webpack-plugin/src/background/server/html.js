import { sendMessageToServer } from '@/lib/chrome-client'

export const Html = {
  //根据传入的url获取到页面信息
  getHtml: function (url, try_times, callback, sync, outHtml) {
    var data = {
      url: url,
      try_times: try_times,
      callback: callback,
      sync: sync == 'false' ? false : true,
      outHtml: outHtml,
      html: outHtml,
    }
    var getHtmlEnd = function (data) {
      callback(data)
    }
    sendMessageToServer('getHtml', data, getHtmlEnd)
  },
  getData: function (url, try_times, callback) {
    var data = {
      url: url,
      try_times: try_times,
      callback: callback,
    }
    var getDataEnd = function (data) {
      callback(data)
    }
    sendMessageToServer('getData', data, getDataEnd)
  },
  getCrawlHtml: function (url, params, try_times, callback, sync) {
    var data = {
      url: url,
      params: params,
      try_times: try_times,
      callback: callback,
      sync: sync === false ? false : true,
    }
    var getCrawlHtmlEnd = function (data) {
      callback(data)
    }
    sendMessageToServer('getCrawlHtml', data, getCrawlHtmlEnd)
  },
  postCrawlHtml: function (url, params, try_times, callback, sync) {
    var data = {
      url: url,
      params: params,
      try_times: try_times,
      callback: callback,
      sync: sync === false ? false : true,
    }
    var postCrawlHtmlEnd = function (data) {
      callback(data)
    }
    sendMessageToServer('postCrawlHtml', data, postCrawlHtmlEnd)
  },
  // 验证1688是否认证成功
  check1688Verify: function (url, params, try_times, callback, sync) {
    var data = {
      url: url,
      params: params,
      try_times: try_times,
      callback: callback,
      sync: sync === false ? false : true,
    }
    var check1688End = function (data) {
      callback(data)
    }
    sendMessageToServer('check1688', data, check1688End)
  },
}
