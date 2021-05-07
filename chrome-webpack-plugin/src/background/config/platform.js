/**
 * 获取淘宝、天猫、京东多平台URL
 */
import $ from 'jquery'
import { Html } from '@/background/server/html.js'
import { MESSAGE } from '@/lib/conf'
import { getRule } from '@/lib/rules'
import { sendMessageToServer } from '@/lib/chrome-client'
const superagent = require('superagent')

export const FillUrl = function(url, httpFlag) {
  if (url) {
    if (url.indexOf('http') == -1 && url.indexOf('HTTP') == -1) {
      if (httpFlag) {
        url = 'https:' + url
      } else {
        url = 'http:' + url
      }
    } else if (url.indexOf('http') > 0 || url.indexOf('HTTP') > 0) {
      var sp = url.indexOf('HTTP') > 0 ? 'HTTP' : 'http'
      var urlArray = url.split(sp)
      url = 'http' + urlArray[1]
    }
  }
  return url
}

// 获取userAgent
export const getUserAgent = function() {
  let name = navigator.appName ? navigator.appName : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  let version = navigator.appVersion
    ? navigator.appVersion
    : 'AppleWebKit/537.36 (KHTML, like Gecko)'
  let code = navigator.appCodeName ? navigator.appCodeName : 'Chrome/80.0.3987.132'
  let agent = navigator.userAgent ? navigator.userAgent : 'Safari/537.36'
  return `${name} ${version} ${code} ${agent}`
}

// 解析url参数
export const queryUrlPar = function(url = '') {
  url = url || window.location.href
  var reg = /([^?=&]+)=([^?=&]+)/g
  var obj = {}
  url.replace(reg, function() {
    obj[arguments[1]] = arguments[2]
  })
  return obj
}

// 判断当前网页是否是详情页&&采集当前商品
export const isDetail = function(url) {
  let linkRule = getRule(location.href)
  let siteConfig = JSON.parse(linkRule)
  let pageType = new Function('url', siteConfig.detect)(location.href) //当前页面类型
  return pageType === 'detail' && url === location.href
}

export const Platform = {
  // 淘宝
  TaobaoCrawl: {
    reConfig: [
      new RegExp("location.protocol==='http:' \\? '(.*)' : '"),
      new RegExp('location\\.protocol \\? "(.*)" :"'),
      new RegExp('"apiItemDesc":"(.*)", {4}"valItemIdStr')
    ],
    getDescUrl: function(html) {
      var descUrl = ''
      for (var i in Platform.TaobaoCrawl.reConfig) {
        var urlArr = Platform.TaobaoCrawl.reConfig[i].exec(html)
        if (urlArr) {
          descUrl = urlArr[1]
          break
        }
      }
      return FillUrl(descUrl, true)
    },
    crawl: function(url, callback, sync) {
      var orgUrl = url

      Html.getHtml(
        orgUrl,
        0,
        function(data) {
          data.url = orgUrl
          // url取最后一次重定向url请求（广告）
          // 例：在天猫首页中的天猫超市，商品链接是淘宝，重定向2次后是天猫;
          if (orgUrl !== data.responseURL) {
            data.url = data.responseURL
          }
          //   data.reqCookie = document.cookie
          data.pageDocHtml = '<html>' + document.body.innerHTML + '</html>'
          // 在当前页采集
          try {
            if (document.getElementById('J_PromoPriceNum') !== null) {
              let salePrice = document.getElementById('J_PromoPriceNum').innerHTML
              if (!!salePrice) {
                data.price = salePrice
              }
            } else if (document.getElementsByClassName('tb-rmb-num').length > 0) {
              let salePrice = document
                .getElementsByClassName('tb-rmb-num')[0]
                .innerHTML.split('-')[0]
              if (!!salePrice) {
                data.price = salePrice
              }
            }
          } catch (e) {
            data.price = ''
          }

          if (data.html) {
            var descUrl = Platform.TaobaoCrawl.getDescUrl(data.html)
            // 取描述信息
            Html.getHtml(
              descUrl,
              0,
              function(desc) {
                data.productTitle = ''
                var div = $('<div></div>')
                div.html(data.html)
                var productTitleBack = $(div).find('title')[0].innerText
                var productTitle = ''
                try {
                  productTitle = $(div).find('.tb-main-title')[0].innerText
                } catch (error) {
                  productTitle = ''
                }
                if (!!productTitle) {
                  data.productTitle = productTitle
                } else {
                  data.productTitle = productTitleBack
                }
                data.desc = desc.html
                callback(data)
              },
              sync
            )
          } else {
            data.html = ''
            callback(data)
          }
        },
        sync
      )
    }
  },
  // 天猫
  TmallCrawl: {
    reConfig: [new RegExp('httpsDescUrl":"(.*)","fetchDcUrl')],
    getDescUrl: function(html) {
      var descUrl = ''
      for (var i in Platform.TmallCrawl.reConfig) {
        var urlArr = Platform.TmallCrawl.reConfig[i].exec(html)
        if (urlArr) {
          descUrl = urlArr[1]
          break
        }
      }
      return FillUrl(descUrl, true)
    },
    crawl: function(url, callback, sync) {
      Html.getHtml(
        url,
        0,
        function(data) {
          data.url = url
          //   data.reqCookie = document.cookie

          // url取最后一次重定向url请求（广告）
          // if (url !== data.responseURL) {
          //   data.url = data.responseURL
          // }
          if (data.html) {
            var descUrl = Platform.TmallCrawl.getDescUrl(data.html)

            // 取描述信息
            Html.getHtml(
              descUrl,
              0,
              function(desc) {
                // 在当前页采集
                try {
                  let item = document.getElementsByClassName('tm-price')
                  if (item.length > 1) {
                    let salePrice = item[1].innerHTML.split('-')[0]
                    if (!!salePrice) {
                      data.price = salePrice
                    }
                  }
                } catch (e) {
                  data.price = ''
                }
                // 获取标题
                data.productTitle = ''
                var div = $('<div></div>')
                div.html(data.html)
                var productTitleBack = $(div).find('title')[0].innerText
                var productTitle = ''
                try {
                  productTitle = $(div).find('#detail .tb-detail-hd h1')[0].innerText
                } catch (err) {
                  productTitle = ''
                }
                if (!!productTitle) {
                  data.productTitle = productTitle
                } else {
                  data.productTitle = productTitleBack
                }
                data.desc = desc.html
                callback(data)
              },
              sync
            )
          } else {
            data.html = ''
            callback(data)
          }
        },
        sync
      )
    }
  },
  // 1688
  ALiBabaCrawl: {
    getDetailUrl: function(html) {
      var div = $('<div></div>')
      div.html(html)

      var url = ''
      div.find('link').each(function() {
        let rel = $(this).attr('rel')
        if (rel === 'canonical') {
          url = $(this).attr('href')
        }
      })
      return url
    },
    crawl: function(url, callback, sync) {
      var orgUrl = url
      if (url.indexOf('dj.1688.com/ci_king') > -1) {
        superagent.get(url).end(function(err, res) {
          if (res.status == 200) {
            orgUrl = res.xhr.responseURL
            Html.getHtml(
              orgUrl,
              0,
              function(data) {
                data.url = orgUrl
                if (data.html) {
                  var detailUrl = Platform.ALiBabaCrawl.getDetailUrl(data.html)
                  // 取详细信息
                  Html.getHtml(
                    detailUrl,
                    0,
                    function(desc) {
                      data.desc = desc.html
                      data.productTitle = ''
                      var div = $('<div></div>')
                      div.html(data.html)
                      // 标题备份
                      var productTitleBack = $(div).find('title')[0].innerText
                      var productTitle = ''
                      try {
                        productTitle = $(div).find('#mod-detail-title .d-title')[0].innerText
                      } catch (error) {
                        productTitle = ''
                      }
                      if (!!productTitle) {
                        data.productTitle = productTitle
                      } else {
                        data.productTitle = productTitleBack
                      }

                      callback(data)
                    },
                    sync
                  )
                } else {
                  data.html = ''
                  callback(data)
                }
              },
              sync
            )
          }
        })
      } else {
        Html.getHtml(
          orgUrl,
          0,
          function(data) {
            data.url = orgUrl
            // data.reqCookie = document.cookie
            // url取最后一次重定向url请求（广告）
            // if (orgUrl !== data.responseURL) {
            //   data.url = data.responseURL
            // }
            if (data.html) {
              // data.desc = desc.html
              callback(data)
            } else {
              data.html = ''
              callback(data)
            }
          },
          sync
        )
      }
    }
  },
  // 速卖通
  SmtCrawl: {
    reConfig: [new RegExp('descUrl="(.*)";')],
    getDescUrl: function(html) {
      var descUrl = ''
      for (var i in Platform.SmtCrawl.reConfig) {
        var urlArr = Platform.SmtCrawl.reConfig[i].exec(html)
        if (urlArr) {
          descUrl = urlArr[1]
          break
        }
      }
      return FillUrl(descUrl, true)
    },
    getNewDescUrl: function(html) {
      var descUrl = ''

      var start = html.indexOf('"descriptionUrl":"')
      if (start > -1) {
        html = html.substring(start + 18, html.length)
        start = html.indexOf('",')
        if (start > -1) {
          descUrl = html.substring(0, start)
        }
      }
      return FillUrl(descUrl, true)
    },
    crawl: function(url, callback, sync) {
      // 详情采集(需要传html)
      let data = {
        url: url
      }
      callback(data)
    }
  },

  // lazada单品采集
  LazadaCrawl: {
    crawl: function(url, callback, sync) {
      // 详情采集需要传html
      let data = {
        // html: isDetail() ? document.body.innerHTML : null,
        url: url
      }
      callback(data)
    }
  },

  // shopee采集
  ShopeeCrawl: {
    crawl: function(url, callback) {
      // 详情采集需要传html
      let data = {
        // html: isDetail() ? document.body.innerHTML : null,
        url: url
      }
      callback(data)
    }
  },
  // 拼多多采集
  YangkeduoCrawl: {
    crawl: function(url, callback) {
      // 详情采集()
      let rawData = document.documentElement.outerHTML.match(/window.rawData\=.*/g, '')[0]
      if (rawData.indexOf('原商品已售罄，为你推荐相似商品') !== -1) {
        // 清空缓存
        localStorage.clear()
        // sendMessageToServer('clearUrlCookie', {
        //   url: '.yangkeduo.com'
        // })
        sendMessageToServer(
          'clearUrlCookie',
          {
            url: 'https://mobile.yangkeduo.com',
            domain: '.yangkeduo.com'
          },
          data => {
            $.fn.message({ type: 'error', msg: MESSAGE.error.pleaseAgainLoginPinDuoDuo })
          }
        )
        return
      }
      let data = {
        html: document.documentElement.outerHTML,
        url: url
      }
      callback(data)
    }
  },

  // 拼多多批发采集
  PifaPinduoduoCrawl: {
    crawl: function(url, callback) {
      // 详情采集
      let data = {
        html: isDetail(url) ? document.documentElement.outerHTML : null,
        url: url
      }
      callback(data)
    }
  },
  // 敦煌采集
  DhgateCrawl: {
    crawl: function(url, callback) {
      // 详情采集(需要传html)
      let data = {
        html: isDetail(url) ? document.documentElement.outerHTML : null,
        url: url
      }
      callback(data)
    }
  }
}
