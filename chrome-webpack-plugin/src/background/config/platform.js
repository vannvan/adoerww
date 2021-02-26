/**
 * 获取淘宝、天猫、京东多平台URL
 */
import $ from 'jquery'
import { Html } from '@/background/server/html.js'
const superagent = require('superagent');

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
  let version = navigator.appVersion ? navigator.appVersion : 'AppleWebKit/537.36 (KHTML, like Gecko)'
  let code = navigator.appCodeName ? navigator.appCodeName : 'Chrome/80.0.3987.132'
  let agent = navigator.userAgent ? navigator.userAgent : 'Safari/537.36'
  return `${name} ${version} ${code} ${agent}`
}

// 解析url参数
export const queryUrlPar = function(url = '') { 
  url = url || window.location.href; 
  var reg = /([^?=&]+)=([^?=&]+)/g;     
  var obj = {};     
  url.replace(reg, function() {
      obj[arguments[1]] = arguments[2];     
  });     
  return obj; 
}

export const Platform = {
  PfhooCrawl: {
    crawl: function (url, callback, sync) {
      var data = {}
      data.url = url
      data.html = '<div></div>'
      callback(data)
    },
  },
  ALiBabaCrawl: {
    getDetailUrl: function (html) {
      var div = $('<div></div>')
      div.html(html)

      var url = ''
      div.find('link').each(function () {
        let rel = $(this).attr('rel')
        if (rel === 'canonical') {
          url = $(this).attr('href')
        }
      })
      return url
    },
    crawl: function (url, callback, sync) {
      var orgUrl = url      
      if (url.indexOf('dj.1688.com/ci_king')>-1) {
        superagent.get(url).end(function (err, res) {
          if (res.status == 200) {
            orgUrl = res.xhr.responseURL
            Html.getHtml(
              orgUrl,
              0,
              function (data) {
                data.url = orgUrl
                if (data.html) {
                  var detailUrl = Platform.ALiBabaCrawl.getDetailUrl(data.html)
                  // 取详细信息
                  Html.getHtml(
                    detailUrl,
                    0,
                    function (desc) {
                      data.desc = desc.html
                      data.productTitle = ''
                      var div = $('<div></div>')
                      div.html(data.html)
                      // 标题备份
                      var productTitleBack = $(div).find('title')[0].innerText
                      var productTitle = ''
                      try {
                        productTitle = $(div).find(
                          '#mod-detail-title .d-title'
                        )[0].innerText
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
          function (data) {
            data.url = orgUrl
            // url取最后一次重定向url请求（广告）
            if (orgUrl !== data.responseURL) {
              data.url = data.responseURL
            }
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
    },
  },
  AlibabaGjCrawl: {
    crawl: function (url, callback, sync) {
      Html.getHtml(
        url,
        0,
        function (data) {
          data.url = url
          if (data.html) {
            data.desc = ''
          } else {
            data.html = ''
          }
          callback(data)
        },
        sync
      )
    },
  },
  DhgateCrawl: {
    crawl: function (url, callback, sync) {
      Html.getHtml(
        url,
        0,
        function (data) {
          data.url = url
          if (data.html) {
            data.desc = ''
          } else {
            data.html = ''
          }
          callback(data)
        },
        sync
      )
    },
  },
  EtsyCrawl: {
    crawl: function (url, callback, sync) {
      Html.getHtml(
        url,
        0,
        function (data) {
          data.url = url
          if (data.html) {
            data.desc = ''
          } else {
            data.html = ''
          }
          callback(data)
        },
        sync
      )
    },
  },
  TaobaoCrawl: {
    reConfig: [
      new RegExp("location.protocol==='http:' \\? '(.*)' : '"),
      new RegExp('location\\.protocol \\? "(.*)" :"'),
      new RegExp('"apiItemDesc":"(.*)", {4}"valItemIdStr'),
    ],
    getDescUrl: function (html) {
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
    crawl: function (url, callback, sync) {
      var orgUrl = url
       
      Html.getHtml(
        orgUrl,
        0,
        function (data) {
          data.url = orgUrl
          // url取最后一次重定向url请求（广告）
          // 例：在天猫首页中的天猫超市，商品链接是淘宝，重定向2次后是天猫;
          if (orgUrl !== data.responseURL) {
            data.url = data.responseURL
          }
          data.reqCookie = document.cookie
          data.pageDocHtml = "<html>"+document.body.innerHTML+"</html>";
          // 在当前页采集
          try {
            if (document.getElementById('J_PromoPriceNum') !== null) {
              let salePrice = document.getElementById('J_PromoPriceNum')
                .innerHTML
              if (!!salePrice) {
                data.price = salePrice
              }
            } else if (
              document.getElementsByClassName('tb-rmb-num').length > 0
            ) {
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
              function (desc) {
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
      
    },
  },
  //
  TmallCrawl: {
    reConfig: [new RegExp('httpsDescUrl":"(.*)","fetchDcUrl')],
    getDescUrl: function (html) {
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
    crawl: function (url, callback, sync) {
      Html.getHtml(
        url,
        0,
        function (data) {
          data.url = url
          // url取最后一次重定向url请求（广告）
          if (url !== data.responseURL) {
            data.url = data.responseURL
          }
          if (data.html) {
            var descUrl = Platform.TmallCrawl.getDescUrl(data.html)

            // 取描述信息
            Html.getHtml(
              descUrl,
              0,
              function (desc) {
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
                  productTitle = $(div).find('#detail .tb-detail-hd h1')[0]
                    .innerText
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
    },
  },
  // 速卖通
  SmtCrawl: {
    reConfig: [new RegExp('descUrl="(.*)";')],
    getDescUrl: function (html) {
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
    getNewDescUrl: function (html) {
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
    crawl: function (url, callback, sync) {
      // 处理速卖通新版产品链接，将新版产品链接转换成旧版
      var type = true
      if (
        url.indexOf('aliexpress.com/item/') != -1 &&
        url.indexOf('.html') != -1
      ) {
        var itemId = url.substring(
          url.indexOf('aliexpress.com/item/') + 20,
          url.indexOf('.html')
        )
        if (itemId.indexOf('/') == -1) {
          type = false
        }
      }
      Html.getHtml(
        url,
        0,
        function (data) {
          data.url = url
          if (data.html) {
            var descUrl = ''
            if (type) {
              descUrl = Platform.SmtCrawl.getDescUrl(data.html)
            } else {
              descUrl = Platform.SmtCrawl.getNewDescUrl(data.html)
            }

            // 取描述信息
            Html.getHtml(
              descUrl,
              0,
              function (desc) {
                data.desc = desc.html
                data.productTitle = ''
                var div = $('<div></div>')
                div.html(data.html)
                // 获取标题
                var productTitle = ''
                var result = ''
                for (var i = 0; i < div.find('script').length; i++) {
                  if (
                    div
                      .find('script')
                      [i].innerHTML.indexOf('window.runParams') !== -1
                  ) {
                    try {
                      result = eval(
                        div
                          .find('script')
                          [i].innerHTML.split('window.runParams.csrfToken')[0]
                      )
                    } catch (error) {
                      result = ''
                    }
                  }
                }
                var productTitleBack = $(div).find('title')[0].innerText

                try {
                  productTitle = result.data.pageModule.title
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
    },
  },

  //
  EbayCrawl: {
    getDescUrl: function (url) {
      var descUrl = ''
      if (url) {
        // 先解析到产品ID
        var s = ''
        if (url.indexOf('?') != -1) {
          s = url.split('?')[0]
        } else {
          s = url
        }
        var array = s.split('/')
        var productId = array[array.length - 1]
        productId &&
          (descUrl =
            'https://vi.vipr.ebaydesc.com/ws/eBayISAPI.dll?item=' + productId)
      }
      return descUrl
    },
    crawl: function (url, callback, sync) {
      Html.getHtml(
        url,
        0,
        function (data) {
          data.url = url
          if (data.html) {
            var descUrl = Platform.EbayCrawl.getDescUrl(url)

            // 取描述信息
            Html.getHtml(
              descUrl,
              0,
              function (desc) {
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
    },
  },

  // 亚马逊
  AmazonComCrawl: {
    crawl: function (url, callback, sync) {
      Html.getHtml(
        url,
        0,
        function (data) {
          data.url = url
          if (data.html) {
            data.desc = ''
            data.productTitle = ''
            var div = $('<div></div>')
            div.html(data.html)
            var productTitleBack = $(div).find('title')[0].innerText
            var productTitle = ''
            try {
              productTitle = $(div).find('#productTitle')[0].innerText
            } catch (error) {
              productTitle = ''
            }
            if (!!productTitle) {
              data.productTitle = productTitle.replace(/\n/g, '').trim()
            } else {
              data.productTitle = productTitleBack
            }
            callback(data)
          } else {
            data.html = ''
            callback(data)
          }
        },
        sync
      )
    },
  },

  JDCrawl: {
    reConfig: [new RegExp("desc: '(.*)',")],
    getDescUrl: function (html) {
      var descUrl = ''
      for (var i in Platform.JDCrawl.reConfig) {
        var urlArr = Platform.JDCrawl.reConfig[i].exec(html)
        if (urlArr) {
          descUrl = urlArr[1]
          break
        }
      }
      return FillUrl(descUrl)
    },
    getPriceUrl: function (url) {
      var priceUrl = ''
      if (url) {
        var productId = ''
        var urlArr = url.split('/')
        if (urlArr.length > 0) {
          productId = urlArr[urlArr.length - 1].split('.')[0].trim()
          priceUrl = 'http://p.3.cn/prices/mgets?type=1&skuIds=J_' + productId
        }
      }
      return priceUrl
    },
    crawl: function (url, callback, sync) {
      var html = document.body.outerHTML
      Html.getHtml(
        url,
        0,
        function (data) {
          data.url = url
          if (data.html) {
            var descUrl = Platform.JDCrawl.getDescUrl(data.html)

            // 取描述信息
            if (descUrl) {
              Html.getHtml(
                descUrl,
                0,
                function (desc) {
                  data.desc = desc.html
                  // 取价格信息
                  var priceUrl = Platform.JDCrawl.getPriceUrl(url)
                  Html.getHtml(
                    priceUrl,
                    0,
                    function (price) {
                      if (price.html) {
                        var priceArr = JSON.parse(price.html)
                        priceArr.length > 0 &&
                          priceArr[0]['p'] &&
                          (data.price = priceArr[0]['p'])
                      }
                      // 获取标题
                      data.productTitle = ''
                      var div = $('<div></div>')
                      div.html(data.html)
                      var productTitleBack = $(div).find('title')[0].innerText
                      var productTitle = ''
                      try {
                        productTitle = $(div).find('.sku-name')[0].innerText
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
                    sync,
                    html
                  )
                },
                sync
              )
            } else {
              data.desc = ''
              callback(data)
            }
          } else {
            data.html = ''
            callback(data)
          }
        },
        sync
      )
    },
  },

  // lazada单品采集
  LazadaCrawl: {
    crawl: function (url, callback, sync) {
        //var currentHtml = "<html>"+document.body.innerHTML + "</html>";
        // var currentHtml = document.body.innerHTML;
        //console.log(currentHtml);
      Html.getHtml(
        url,
        0,
        function (data) {
          data.url = url
          data.html = null
          data.productTitle = ''
          data.desc = ''
          callback(data)
        },
        sync
      )
    },
  },

  TaobaoCategoryCrawl: {
    getHost: function (url) {
      var host = ''
      var arr = url.split('taobao.com')
      if (arr.length > 0) {
        host = arr[0] + 'taobao.com'
      }
      return host
    },
    getListUrl: function (url, html) {
      var div = $('<div></div>')
      div.html(html)
      var listUrl = div.find('#J_ShopAsynSearchURL').val()
      var host = Platform.TaobaoCategoryCrawl.getHost(url)
      listUrl = host + listUrl
      div.remove()

      return listUrl
    },
    crawl: function (url, callback, brandData) {
      var brandData = brandData
      Html.getHtml(url, 0, function (data) {
        if (data.html) {
          data.list = []
          data.brandList = []
          data.salePriceObj = {}
          data.next = ''
          var div = $('<div></div>')
          var re = new RegExp('\\\\', 'g')
          data.html = data.html.replace(re, '')
          div.html(data.html)
          var secondValue = div.find('#J_ShopAsynSearchURL').attr('value')

          // 存在表示需要二次请求
          if (secondValue) {
            var listUrl = Platform.TaobaoCategoryCrawl.getListUrl(
              url,
              data.html,
              brandData
            )

            Platform.TaobaoCategoryCrawl.crawl(listUrl, callback, brandData)
          } else {
            div.find('dd.detail a.J_TGoldData').each(function () {
              // 获取title
              var title = $(this).text()
              var hasBrand = false
              brandData.forEach((item) => {
                if (title.toLowerCase().includes(item.toLowerCase())) {
                  hasBrand = true
                }
              })
              let detailUrl = FillUrl($(this).attr('href'), true)
              if (!hasBrand) {
                data.list.push(FillUrl($(this).attr('href'), true))
              } else {
                data.brandList.push(FillUrl($(this).attr('href'), true))
              }
              try {
                if ($(this).parent().find('.c-price')) {
                  data.salePriceObj[detailUrl] = $(this)
                    .parent()
                    .find('.c-price')
                    .text()
                } else if ($(this).parent().find('.s-price')) {
                  data.salePriceObj[detailUrl] = $(this)
                    .parent()
                    .find('.s-price')
                    .text()
                }
              } catch (e) {
                console.log(e)
              }
            })
            // 当前页
            if (div.find('.pagination span.page-info')) {
              var pageInfo = div.find('.pagination span.page-info')[0].innerText
              data.currentPage = pageInfo.split('/')[0]
              data.lastPage = pageInfo.split('/')[1]
            }
            // 取下一页
            var nextUrl = div.find('div.pagination a.next').attr('href')

            nextUrl && (data.next = FillUrl(nextUrl, true))
            div.remove()
            callback(data)
          }
        } else {
          data.html = ''
          callback(data)
        }
      })
    },
  },

  TmallCategoryCrawl: {
    getHost: function (url) {
      var host = ''
      var arr = url.split('tmall.com')
      if (arr.length > 0) {
        host = arr[0] + 'tmall.com'
      }
      return host
    },
    getListUrl: function (url, html) {
      var div = $('<div></div>')
      div.html(html)
      var listUrl = div.find('#J_ShopAsynSearchURL').val()
      var host = Platform.TmallCategoryCrawl.getHost(url)
      listUrl = host + listUrl
      div.remove()
      return listUrl
    },
    crawl: function (url, callback, brandData) {
      Html.getHtml(url, 0, function (data) {
        if (data.html) {
          data.list = []
          data.brandList = []
          data.salePriceObj = {}
          data.next = ''
          var div = $('<div></div>')
          var re = new RegExp('\\\\', 'g')
          data.html = data.html.replace(re, '')
          div.html(data.html)
          var secondValue = div.find('#J_ShopAsynSearchURL').attr('value')
          // 存在二次采集
          if (secondValue) {
            var listUrl = Platform.TmallCategoryCrawl.getListUrl(url, data.html, brandData)
            Platform.TmallCategoryCrawl.crawl(listUrl, callback, brandData)
          } else {
            // 天猫中商品列表链接的两种情况
            var a = div.find('div.item4line1 dl.item dt.photo a')
            if (a && a.length == 0) {
              a = div.find('div.item5line1 dl.item dt.photo a')
            }
            if (a && a.length == 0) {
              a = div.find('div.item3line1 dl.item dt.photo a')
            }

            a.each(function () {
              // 通过判断class名称过滤掉推荐的商品
              var c =
                $(this).parent().parent().parent().prev().attr('class') ==
                'comboHd'
              if (c) {
                return false
              }
              var href = $(this).attr('href')
              var title = $(this).find('img')[0].alt
              var hasBrand = false
              brandData.forEach((item) => {
                if (title.toLowerCase().includes(item.toLowerCase())) {
                  hasBrand = true
                }
              })
              if (!hasBrand) {
                data.list.push(FillUrl($(this).attr('href'), true))
              } else {
                data.brandList.push(FillUrl($(this).attr('href'), true))
              }
              let detailUrl = FillUrl($(this).attr('href'), true)
              try {
                if ($(this).parent().parent().find('.c-price')) {
                  data.salePriceObj[detailUrl] = $(this)
                    .parent()
                    .parent()
                    .find('.c-price')
                    .text()
                } else if ($(this).parent().find('.s-price')) {
                  data.salePriceObj[detailUrl] = $(this)
                    .parent()
                    .parent()
                    .find('.s-price')
                    .text()
                }
              } catch (e) {
                console.log(e)
              }
            })
            // 当前页和所有页
            try {
              var pageInfo = div.find('p.ui-page-s b.ui-page-s-len')[0].innerText
              data.currentPage = pageInfo.split('/')[0]
              data.lastPage = pageInfo.split('/')[1]
              // 取下一页
              var nextUrl = div
                .find('div.shop-filter div.pagination a:last')
                .attr('href')
              if (!nextUrl) {
                nextUrl = div.find('p.ui-page-s')[0].children[2].href
              }
              nextUrl && (data.next = FillUrl(nextUrl, true))
            } catch (e) {
              data.next = ''
              data.currentPage = ''
              data.lastPage = ''
            }
            div.remove()
            callback(data)
          }
        } else {
          data.html = ''
          callback(data)
        }
      })
    },
  },
  // 京东分类采集
  JDCategoryCrawl: {
    handleDate: function (
      data,
      div,
      div2,
      callback,
      appid,
      pageInstanceid,
      prototypeid,
      templateid,
      brandData
    ) {
      if ($(div2).find('.jSearchListArea .jSubObject .jItem').length > 0) {
        $(div2)
          .find('.jSearchListArea .jSubObject .jItem .jGoodsInfo .jDesc a')
          .each(function () {
            var title = $(this).text()
            var hasBrand = false
            brandData.forEach((item) => {
              if (title.toLowerCase().includes(item.toLowerCase())) {
                hasBrand = true
              }
            })
            if (!hasBrand) {
              data.list.push(FillUrl($(this).attr('href')))
            } else {
              data.brandList.push(FillUrl($(this).attr('href')))
            }
          })
      } else if ($(div2).find('.JColorSearchList #J_GoodsList').length > 0) {
        $(div2)
          .find('.JColorSearchList #J_GoodsList ul li .jGoodsInfo .jDesc a')
          .each(function () {
            var title = $(this).text()
            var hasBrand2 = false
            brandData.forEach((item) => {
              if (title.toLowerCase().includes(item.toLowerCase())) {
                hasBrand2 = true
              }
            })
            if (!hasBrand2) {
              data.list.push(FillUrl($(this).attr('href')))
            } else {
              data.brandList.push(FillUrl($(this).attr('href')))
            }
          })
      } else if ($(div2).find('.mc .j-module ul').length > 0) {
        var resultA = ''
        if (
          $(div2).find('.mc .j-module ul li .jItem .jGoodsInfo .jDesc a').length >
          0
        ) {
          resultA = $(div2).find(
            '.mc .j-module ul li .jItem .jGoodsInfo .jDesc a'
          )
        } else if (
          $(div2).find('.mc .j-module ul li .jItem .jGoodsInfo .user_tj_title a')
        ) {
          resultA = $(div2).find(
            '.mc .j-module ul li .jItem .jGoodsInfo .user_tj_title a'
          )
        }
        resultA.each(function () {
          var title = $(this).text()
          var hasBrand3 = false
          brandData.forEach((item) => {
            if (title.toLowerCase().includes(item.toLowerCase())) {
              hasBrand3 = true
            }
          })
          if (!hasBrand3) {
            data.list.push(FillUrl($(this).attr('href')))
          } else {
            data.brandList.push(FillUrl($(this).attr('href')))
          }
        })
      } else if ($(div2).find('.mc ul').length > 0) {
        var resultA = ''
        if ($(div2).find('.mc ul li .jItem .jGoodsInfo .jDesc a').length > 0) {
          resultA = $(div2).find('.mc ul li .jItem .jGoodsInfo .jDesc a')
        } else if (
          $(div2).find('.mc ul li .jItem .jGoodsInfo .user_tj_title a')
        ) {
          resultA = $(div2).find('.mc ul li .jItem .jGoodsInfo .user_tj_title a')
        }
        resultA.each(function () {
          var title = $(this).text()
          var hasBrand4 = false
          brandData.forEach((item) => {
            if (title.toLowerCase().includes(item.toLowerCase())) {
              hasBrand4 = true
            }
          })
          if (!hasBrand4) {
            data.list.push(FillUrl($(this).attr('href')))
          } else {
            data.brandList.push(FillUrl($(this).attr('href')))
          }
        })
      }
      // 取下一页
      if ($(div2).find('.jPage a').length > 1) {
        var lastPage = ''
        var currentPage = ''
        $(div2)
          .find('.jPage a')
          .each(function (item) {
            if (
              $(div2).find('.jPage a')[item].className == 'current' ||
              $(div2).find('.jPage a')[item].className == 'jPageCurrent'
            ) {
              currentPage = $(div2).find('.jPage a')[item].outerText
              if ($(div2).find('.jPage a')[item + 1]) {
                data.next = FillUrl($(div2).find('.jPage a')[item + 1].href)
              }
            }
            if ($(div2).find('.jPage a')[item].innerHTML == '下一页') {
              if (!$(div2).find('.jPage a')[item].href.includes('javascript:;')) {
                data.next = FillUrl($(div2).find('.jPage a')[item].href)
              }
              lastPage = $(div2).find('.jPage a')[item - 1].innerHTML
            }
          })
        if (currentPage) data.currentPage = currentPage
        if (lastPage) data.lastPage = lastPage
      } else if ($(div2).find('.jPage a').length == 1) {
        data.currentPage = 1
        data.lastPage = 1
      } else {
        data.next = ''
      }
      div2.remove()
      div.remove()
      if (data.next == 'http:javascript:;') {
        data.next = ''
      }
      callback(data)
    },
    crawl: function (url, callback, brandData) {
      Html.getHtml(url, 0, function (data) {
        if (data.html) {
          data.list = []
          data.next = ''
          data.currentPage = ''
          data.lastPage = ''
          data.brandList = []
          var div = $('<div></div>')
          div.html(data.html)
          // 取脚本中没有的字段
          let pageInstanceId = $(div).find('#pageInstance_id').attr('value')
          let venderId = $(div).find('#vender_id').attr('value')
          let appId = $(div).find('#pageInstance_appId').attr('value')

          let shopId = $(div).find('#shop_id').attr('value')
          var moduleInstanceId = ''
          var prototypeId = ''
          var templateId = ''
          var layoutInstanceId = ''
          var origin = ''
          // 获取脚本中的数据
          let keyObj = data.html
            .split('loadingModuleHtml(obj){')[1]
            .split('if (window.location.pathname.')[0]
          if (keyObj.length > 0) {
            eval(keyObj)
          }
          appId = appId == '' ? params.appId : appId
          var appid = appId
          let orderBy = params.orderBy
          let pageNo = params.pageNo
          let direction = params.direction
          shopId = shopId == '' ? params.shopId : shopId
          let categoryId = params.categoryId
          let pageSize = params.pageSize
          venderId = venderId == '' ? params.venderId : venderId
          let maxPrice = params.maxPrice
          let pagePrototypeId = params.pagePrototypeId
          let minPrice = params.minPrice
          // 获取当前时间戳
          let currentTime = new Date().getTime()

          // 二次请求并且解析html
          var objRes = {}

          function jshop_module_render_callback(callObj) {
            objRes = callObj
          }

          // 取最后一个div
          var flag = false
          var resArr = []
          $(div)
            .find('div.m_render_structure')
            .each(function (index) {
              let len = $(div).find('div.m_render_structure').length
              if (len == 2) {
                let divTarget = $(this)
                moduleInstanceId = $(divTarget).attr(
                  'm_render_layout_instance_id'
                )
                prototypeId = $(divTarget).attr('m_render_prototype_id')
                templateId = $(divTarget).attr('m_render_template_id')
                layoutInstanceId = $(divTarget).attr(
                  'm_render_layout_instance_id'
                )
                origin = $(divTarget).attr('m_render_origin')
                $.ajax({
                  url: `https://module-jshop.jd.com/module/getModuleHtml.html?appId=${appId}&orderBy=${orderBy}&pageNo=${pageNo}&direction=${direction}&shopId=${shopId}&categoryId=${categoryId}&pageSize=${pageSize}&venderId=${venderId}&pagePrototypeId=${pagePrototypeId}&pageInstanceId=${pageInstanceId}&moduleInstanceId=${moduleInstanceId}&prototypeId=${prototypeId}&templateId=${templateId}&layoutInstanceId=${layoutInstanceId}&origin=${origin}&callback=jshop_module_render_callback&_=${currentTime}`,
                  type: 'get',
                  timeout: 60000,
                  data: {},
                  dataType: 'text',
                  success: function (res) {
                    resArr.push({
                      res: res,
                      len: res.length,
                    })
                    if (resArr.length == len) {
                      resArr.sort(function (a, b) {
                        return a.len - b.len
                      })
                      // 数据处理
                      eval(resArr[resArr.length - 1].res)
                      var div2 = $('<div></div>')
                      div2.html(data.html)
                      Platform.JDCategoryCrawl.handleDate(
                        data,
                        div,
                        div2,
                        callback,
                        appid,
                        pageInstanceId,
                        prototypeId,
                        templateId,
                        brandData
                      )
                    }
                  },
                  complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                    } else if (status == 'parsererror') {
                    } else if (status == 'error') {
                    }
                  },
                })
              } else {
                if (index == len - 1) {
                  let divTarget = $(div).find('div.m_render_structure')[index]
                  moduleInstanceId = $(divTarget).attr(
                    'm_render_layout_instance_id'
                  )
                  prototypeId = $(divTarget).attr('m_render_prototype_id')
                  templateId = $(divTarget).attr('m_render_template_id')
                  layoutInstanceId = $(divTarget).attr(
                    'm_render_layout_instance_id'
                  )
                  origin = $(divTarget).attr('m_render_origin')
                }
              }
            })
          $.ajax({
            url: `https://module-jshop.jd.com/module/getModuleHtml.html?appId=${appId}&orderBy=${orderBy}&pageNo=${pageNo}&direction=${direction}&shopId=${shopId}&categoryId=${categoryId}&pageSize=${pageSize}&venderId=${venderId}&pagePrototypeId=${pagePrototypeId}&pageInstanceId=${pageInstanceId}&moduleInstanceId=${moduleInstanceId}&prototypeId=${prototypeId}&templateId=${templateId}&layoutInstanceId=${layoutInstanceId}&origin=${origin}&callback=jshop_module_render_callback&_=${currentTime}`,
            type: 'POST',
            timeout: 60000,
            data: {},
            dataType: 'text',
            success: function (res) {
              // return
              eval(res)
              var div2 = $('<div></div>')
              div2.html(objRes.moduleText)
              Platform.JDCategoryCrawl.handleDate(
                data,
                div,
                div2,
                callback,
                appid,
                pageInstanceId,
                prototypeId,
                templateId,
                brandData
              )
            },
            complete: function (XMLHttpRequest, status) {
              if (status == 'timeout') {
              } else if (status == 'parsererror') {
              } else if (status == 'error') {
              }
            },
          })
        } else {
          data.html = ''
          callback(data)
        }
      })
    },
  },
  // 1688分类采集
  ALiBaBaCategoryCrawl: {
    crawl: function (url, callback, brandData) {
      Html.getHtml(url, 0, function (data) {
        if (data.html) {
          data.list = []
          data.brandList = []
          data.next = ''
          var div = $('<div></div>')
          div.html(data.html)
          if (
            !div.find('#wp-all-offer-tab ul.offer-list-row li div').attr('title')
          ) {
            if (
              div.find('#wp-all-offer-tab ul.offer-list-row li div.title-new a')
            ) {
              div
                .find('#wp-all-offer-tab ul.offer-list-row li div.title-new a')
                .each(function () {
                  var title = $(this).attr('title')
                  var hasBrand = false
                  brandData.forEach((item) => {
                    if (title.toLowerCase().includes(item.toLowerCase())) {
                      hasBrand = true
                    }
                  })
                  if (!hasBrand) {
                    data.list.push(FillUrl($(this).attr('href')))
                  } else {
                    data.brandList.push(FillUrl($(this).attr('href')))
                  }
                  // data.list.push(FillUrl($(this).attr("href")));
                })
              if (
                div.find('#wp-all-offer-tab ul.offer-list-row li div.title a')
              ) {
                div
                  .find('#wp-all-offer-tab ul.offer-list-row li div.title a')
                  .each(function () {
                    var title = $(this).attr('title')
                    var hasBrand = false
                    brandData.forEach((item) => {
                      if (title.toLowerCase().includes(item.toLowerCase())) {
                        hasBrand = true
                      }
                    })
                    if (!hasBrand) {
                      data.list.push(FillUrl($(this).attr('href')))
                    } else {
                      data.brandList.push(FillUrl($(this).attr('href')))
                    }
                    // data.list.push(FillUrl($(this).attr("href")));
                  })
              }
            } else {
            }
          } else {
            div
              .find('#wp-all-offer-tab ul.offer-list-row li div.title-new a')
              .each(function () {
                var title = $(this).attr('title')
                var hasBrand = false
                brandData.forEach((item) => {
                  if (title.toLowerCase().includes(item.toLowerCase())) {
                    hasBrand = true
                  }
                })
                if (!hasBrand) {
                  data.list.push(FillUrl($(this).attr('href')))
                } else {
                  data.brandList.push(FillUrl($(this).attr('href')))
                }
                // data.list.push(FillUrl($(this).attr("href")));
              })
          }

          // 当前页 和总页数
          var currentPage = div.find('div.app-paginator a.current').text()
          var lastPage = div.find('div.app-paginator em.page-count').text()
          data.currentPage = currentPage
          data.lastPage = lastPage
          // 取下一页
          var nextUrl = div.find('div.app-paginator a.next').attr('href')

          nextUrl && (data.next = FillUrl(nextUrl))
          div.remove()

          callback(data)
        } else {
          data.html = ''
          callback(data)
        }
      })
    },
  },
  // 速卖通分类采集
  SmtCategoryCrawl: {
    crawl: function (url, callback, brandData, smtCurrentPage) {
      Html.getHtml(url, 0, function (data) {
        if (data.html) {
          data.list = []
          data.brandList = []
          data.next = ''
          var div = $('<div></div>')
          div.html(data.html)
          div
            .find('div.m-o-large-all-detail li.item div.detail h3 a')
            .each(function () {
              var title = $(this).text()
              var hasBrand = false
              brandData.forEach((item) => {
                if (title.toLowerCase().includes(item.toLowerCase())) {
                  hasBrand = true
                }
              })
              if (!hasBrand) {
                data.list.push(FillUrl($(this).attr('href'), true))
              } else {
                data.brandList.push(FillUrl($(this).attr('href'), true))
              }
            })

          // 当前页和所有页
          var currentPage = $(
            'div.ui-pagination-navi span.ui-pagination-active'
          ).text()

          var lastPage = $('div.ui-pagination-navi a').eq(-2).text()
          if (lastPage == '') lastPage = 1
          if (smtCurrentPage == '') {
            data.currentPage = currentPage
          } else {
            data.currentPage = Number(smtCurrentPage) + 1
          }
          data.lastPage = lastPage
          // 取下一页
          var nextUrl = div
            .find('div.ui-pagination-navi a.ui-pagination-next')
            .attr('href')

          nextUrl && (data.next = FillUrl(nextUrl, true))
          div.remove()

          callback(data)
        } else {
          data.html = ''
          callback(data)
        }
      })
    },
  },
  EbayCategoryCrawl: {
    crawl: function (url, callback) {
      Html.getHtml(url, 0, function (data) {
        var plat = 0 // 用于标识ebay平台的不同情况分类采集
        if (url.indexOf('stores') > -1) {
          plat = 1
        }
        if (data.html) {
          data.list = []
          data.next = ''
          var div = $('<div></div>')
          div.html(data.html)
          var nextUrl
          if (plat == 0) {
            $(div)
              .find('#ResultSetItems ul li.sresult h3 a.vip')
              .each(function () {
                data.list.push(FillUrl($(this).attr('href')))
              })
            nextUrl = div.find('td.pagn-next a.next').attr('href')
          }
          if (plat == 1) {
            var selector = new Array(
              '#result-set div.desc a',
              '.pview.rs-pview .ttl.g-std a',
              '#lvc .ttl a',
              '#items .item-image a'
            )
            for (var i = 0; i < selector.length; i++) {
              div.find(selector[i]).each(function () {
                data.list.push(FillUrl($(this).attr('href')))
              })
            }
            nextUrl = div.find('#pager a.nextBtn').attr('href')
            // div.find("div.ttl a").each(function(){
            // data.list.push(FillUrl($(this).attr("href")));
            // });
            // nextUrl = div.find("td.next a.enabled").attr("href");
          }

          // 下一页，若无ebay前缀，添加
          if (nextUrl) {
            if (nextUrl.indexOf('http') == -1 && nextUrl.indexOf('HTTP') == -1) {
              // 无http这种情况可能属于店铺中的产品
              data.next = 'https://stores.ebay.com' + nextUrl
            } else {
              data.next = FillUrl(nextUrl)
            }
          }

          div.remove()
          callback(data)
        } else {
          data.html = ''
          callback(data)
        }
      })
    },
  },
  // 亚马逊分类采集
  AmazonCategoryCrawl: {
    crawl: function (url, callback) {
      Html.getHtml(url, 0, function (data) {
        if (data.html) {
          data.list = []
          data.next = ''
          var div = $('<div></div>')
          div.html(data.html)
          var urlNode = div.find('div.a-spacing-none a.s-access-detail-page')
          if (urlNode && urlNode.length === 0) {
            urlNode = div.find('div.a-spacing-small a.s-access-detail-page')
          }
          if (urlNode && urlNode.length === 0) {
            urlNode = div.find(
              'div.a-spacing-none h5.a-color-base a.a-link-normal'
            )
          }
          if (urlNode && urlNode.length === 0) {
            urlNode = div.find(
              'div.a-spacing-none h2.a-color-base a.a-link-normal'
            )
          }
          urlNode.each(function () {
            var url = $(this).attr('href')
            if (url && url.indexOf('https://www.amazon.com') === -1)
              url = 'https://www.amazon.com' + url
            if (data.list.indexOf(url) === -1) data.list.push(url)
          })
          // 取下一页
          var nextUrl = div.find('span.pagnRA a.pagnNext').attr('href')
          if (typeof nextUrl === 'undefined') {
            nextUrl = div.find('#pagnNextLink').attr('href')
          }
          if (typeof nextUrl === 'undefined') {
            nextUrl = div.find('.a-text-center li.a-last a').attr('href')
          }
          if (typeof nextUrl !== 'undefined') {
            nextUrl = 'https://www.amazon.com' + nextUrl
          }

          nextUrl && (data.next = nextUrl)
          div.remove()
          callback(data)
        } else {
          data.html = ''
          callback(data)
        }
      })
    },
  },

  GearbestCrawl: {
    crawl: function (url, callback, sync) {
      Html.getHtml(
        url,
        0,
        function (data) {
          data.url = url
          callback(data)
        },
        sync
      )
    },
  },
  // WalmartCrawl采集
  WalmartCrawl: {
    crawl: function (url, callback, sync) {
      Html.getHtml(
        url,
        0,
        function (data) {
          data.url = url
          callback(data)
        },
        sync
      )
    },
  },
  // chinavasion采集
  Chinavasion: {
    crawl: function (url, callback, sync) {
      Html.getHtml(
        url,
        0,
        function (data) {
          data.url = url
          callback(data)
        },
        sync
      )
    },
  },
  // banggood采集
  BanggoodCrawl: {
    crawl: function (url, callback, sync) {
      Html.getHtml(
        url,
        0,
        function (data) {
          data.url = url
          callback(data)
        },
        sync
      )
    },
  },
  // 亚马逊采集
  AmazonCrawl: {
    crawl: function (url, callback, sync) {
      Html.getHtml(
        url,
        0,
        function (data) {
          data.url = url
          callback(data)
        },
        sync
      )
    },
  },

  ChinabrandsCrawl: {
    crawl: function (url, callback, sync) {
      Html.getHtml(
        url,
        0,
        function (data) {
          data.url = url
          callback(data)
        },
        sync
      )
    },
  },

  WishCrawl: {
    crawl: function (url, callback, sync) {
      Html.getHtml(
        url,
        0,
        function (data) {
          data.url = url
          callback(data)
        },
        sync
      )
    },
  },
  JoomCrawl: {
    crawl: function (url, callback, sync) {
      Html.getHtml(
        url,
        0,
        function (data) {
          data.url = url
          callback(data)
        },
        sync
      )
    },
  },
  TophatterCrawl: {
    crawl: function (url, callback, sync) {
      Html.getHtml(
        url,
        0,
        function (data) {
          data.url = url
          callback(data)
        },
        sync
      )
    },
  },
  HaiYingShuJuCrawl: {
    crawl: function (url, callback, sync) {
      Html.getHtml(
        url,
        0,
        function (data) {
          data.url = url
          callback(data)
        },
        sync
      )
    },
  },

  YiXuanPinCrawl: {
    crawl: function (url, callback, sync) {
      var yuMing = 'yixuanpin.cn'
      if (url.indexOf('www.') != -1) {
        yuMing = 'www.yixuanpin.cn'
      }
      var httpUrl =
        'https://' +
        yuMing +
        '/api/goods/' +
        url.substring(url.indexOf('goodsId=')).replace('goodsId=', '')
      Html.getHtml(
        httpUrl,
        0,
        function (data) {
          data.url = url
          callback(data)
        },
        sync
      )
    },
  },
  // shopee采集
  ShopeeCrawl: {
    crawl: function (url, callback, sync) {
      let shopid = null
      let itemid = null
      
      if (/-i/.test(url)) {
        let urlInfo = url.split('-i.')[1].trim().split('.')
        shopid = urlInfo[0]
        itemid = urlInfo[1]
      } else {
        let urlArr = url.split('/')
        shopid = urlArr.length > 2 ? urlArr[urlArr.length - 2] : null
        itemid = urlArr.length > 2 ? urlArr[urlArr.length - 1] : null
      }
      if (!shopid) {
        alert('当前页面不可采集')
      }

      let crwalUrl = `https://${document.domain}/api/v2/item/get?itemid=${itemid}&shopid=${shopid}`
      let cookie = document.cookie
      superagent
        .get(crwalUrl)
        .set({
          Accept: 'application/json, charset=utf-8',
          cookie: cookie,
          origin: 'https://youhui.pinduoduo.com',
          referer:
            'https://shopee.com.my/Case-Valker-Eco-Friendly-Bamboo-Charcoal-Comforter-Storage-Bag-Travel-Bag-i.26395043.1600374711',
          'user-agent': getUserAgent(),
        })
        .then((res) => {
          try {
            let data = {}
            let item = res.body.item
            data.productTitle = item.name
            data.url = url
            data.desc = ''
            data.html = JSON.stringify(item)
            callback(data)
          } catch (e) {
            let data = {}
            data.url = url
            data.desc = ''
            data.html = ''
            callback(data)
          }
        })
        .catch((err) => {
          console.log(err)
          let data = {}
          data.url = url
          data.desc = ''
          data.html = ''
          callback(data)
        })
    },
  },
  // 拼多多采集
  YangkeduoCrawl: {
    crawl: function (url, callback, sync) {
      Html.getHtml(
        url,
        1,
        function (data) {
          var div = $('<div></div>')
          div.html(data.html)
          for (var i = 0; i < div.find('script').length; i++) {
            let scriptValue = div.find('script')[i].innerHTML
            if (scriptValue.includes('window.rawData')) {
              try {
                eval(scriptValue)
              } catch (error) {
                result = ''
              }
            }
          }
          try {
            if (window.rawData.store.initDataObj.goods) {
              let goodInfo = window.rawData.store.initDataObj.goods
              data.html = JSON.stringify(goodInfo)
            } else {
              data.html = ''
            }
          } catch (e) {
            data.html = ''
          }

          if (!data.html) {
            data.msg = '请先登录拼多多'
          }

          let productTitle = div.find('.enable-select').text()
          data.productTitle = productTitle
          data.desc = data.html
          data.url = url
          callback(data)
        },
        sync
      )
    },
  },

  PinduoduoCrawl2: {
      crawl: function (url, callback, sync) {
          var orgUrl = url
          console.log("orgUrl:"+orgUrl)
              Html.getHtml(
                  orgUrl,
                  0,
                  function (data) {
                      data.url = orgUrl
                      data.reqCookie = document.cookie
                      data.pageDocHtml = "<html>"+document.body.innerHTML+"</html>";
                      callback(data)
                  },
                  sync
              )

      },
  },

  // 拼多多商城采集
  PinduoduoCrawl: {
    crawl: function (url, callback, sync) {
      // console.log('PinduoduoCrawl')
      let parseUrlObj = queryUrlPar(url)
      let crwalUrl =
        'https://youhui.pinduoduo.com/network/api/goods/queryByGoodsId'
      let cookie = document.cookie
      let data = {
        goodsIds: [parseUrlObj.goodsId],
          goodsSign: parseUrlObj.s,
          pid: null
      }
      superagent
        .post(crwalUrl)
        .send(data)
        .set({
          Accept: 'application/json, text/plain, */*',
          cookie: cookie,
          origin: 'https://youhui.pinduoduo.com',
          referer:
            'https://youhui.pinduoduo.com/goods/goods-detail?goodsId=39084972274',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
        })
        .then((res) => {
          // console.log(res)
          try {
            let productInfo = {}
            let result = res.body.result.goodsDetails[0]
            productInfo.productTitle = result.goodsName
            productInfo.desc = result.goodsDesc
            productInfo.price =
              (result.minGroupPrice / 100).toFixed(2) -
              (result.couponDiscount / 100).toFixed(0)
            productInfo.imgUrls = result.goodsGalleryUrls
            let data = {}
            data.url = url
            data.productTitle = result.goodsName
            data.desc = ''
            data.html = JSON.stringify(productInfo)
            callback(data)
          } catch (e) {
            let data = {}
            data.url = url
            data.desc = ''
            data.html = ''
            callback(data)
          }
        })
        .catch((err) => {
          console.log(err)
          let data = {}
          data.url = url
          data.desc = ''
          data.html = ''
          callback(data)
        })
    },
  },

  /*搜索列表采集 */
  // 淘宝列表采集
  TaobaoSortListCrawl: {
    crawl: (url, callback, brandData) => {
      Html.getHtml(url, 0, (data) => {
        if (data.html) {
          var div = $('<div></div>')
          div.html(data.html)
          data.list = []
          data.brandList = []
          data.salePriceObj = {}
          data.next = ''
          // 获取脚本
          var targrtScript = ''
          for (var i = 0; i < div.find('script').length; i++) {
            if (div.find('script')[i].innerHTML.indexOf('g_page_config') !== -1) {
              targrtScript = eval(
                div.find('script')[i].innerHTML.split('g_srp_loadCss')[0]
              )
            }
          }
          targrtScript.mods.itemlist.data.auctions.forEach((item) => {
            let url = item.comment_url
            let salePrice = item.view_price
            if (url.indexOf('click.simba.taobao.com') !== -1) {
              superagent.get(url).end(function (err, res) {
                if (res.status == 200) {
                  var orgUrl = res.xhr.responseURL
                  var hasBrand = false
                  var title = item.raw_title
                  brandData.forEach((item) => {
                    if (title.toLowerCase().includes(item.toLowerCase())) {
                      hasBrand = true
                    }
                  })
                  let detailUrl = FillUrl(orgUrl, true)
                  if (!hasBrand) {
                    data.list.push(FillUrl(orgUrl, true))
                  } else {
                    data.brandList.push(FillUrl(orgUrl, true))
                  }
                  data.salePriceObj[detailUrl] = salePrice
                  // data.list.push(FillUrl(orgUrl, true))
                }
              })
            } else {
              var hasBrand = false
              var title = item.raw_title
              brandData.forEach((item) => {
                if (title.toLowerCase().includes(item.toLowerCase())) {
                  hasBrand = true
                }
              })
              let detailUrl = FillUrl(item.comment_url, true)
              if (!hasBrand) {
                data.list.push(FillUrl(item.comment_url, true))
              } else {
                data.brandList.push(FillUrl(item.comment_url, true))
              }
              data.salePriceObj[detailUrl] = salePrice
            }
          })

          // 取下一页
          data.currentPage = 1
          data.lastPage = 1
          data.next = ''
          div.remove()
          callback(data)
        } else {
          data.html = ''
          callback(data)
        }
      })
    },
  },
  // 天猫列表采集
  TmallSortListCrawl: {
    crawl: function (url, callback, brandData) {
      Html.getHtml(url, 0, (data) => {
        if (data.html) {
          var div = $('<div></div>')
          div.html(data.html)
          data.list = []
          data.brandList = []
          data.salePriceObj = {}
          data.next = ''
          $(div)
            .find('#J_ItemList .product .productTitle')
            .each(function () {
              var title = $(this).find('a')[0].innerText
              var hasBrand = false
              brandData.forEach((item) => {
                if (title.toLowerCase().includes(item.toLowerCase())) {
                  hasBrand = true
                }
              })
              if (!hasBrand) {
                data.list.push(FillUrl($(this).find('a')[0].href))
              } else {
                data.brandList.push(FillUrl($(this).find('a')[0].href))
              }

              try {
                let detailUrl = FillUrl($(this).find('a')[0].href)
                let salePrice = $(this)
                  .parent()
                  .find('.productPrice')
                  .find('em')
                  .attr('title')
                if (salePrice) {
                  data.salePriceObj[detailUrl] = salePrice
                }
              } catch (e) {
                console.log(e)
              }
            })
          // 取下一页
          data.currentPage = 1
          data.lastPage = 1
          data.next = ''
          div.remove()
          callback(data)
        } else {
          data.html = ''
          callback(data)
        }
      })
    },
  },
  // 1688列表采集
  AliBabaSortListCrawl: {
    getQueryString(name) {
      // 获取url参数
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      var r = window.location.search.substr(1).match(reg)
      if (r != null) {
        return unescape(r[2])
      }
      return null
    },
    crawl: function (url, callback, brandData) {
      Html.getHtml(url, 0, (data) => {
        if (data.html) {
          var div = $('<div></div>')
          div.html(data.html)
          data.list = []
          data.brandList = []
          data.next = ''
          if (url.indexOf('show.1688.com') !== -1) {
            var namespace = 'cateMarketOfferList'
            var widgetId = 'cateMarketOfferList'
            var methodName = 'execute'
            var sceneId = Platform.AliBabaSortListCrawl.getQueryString('sceneId')
            var curPage = 1
            var pageSize = 20
            var sortType = ''
            var descendOrder = ''
            var priceStart = ''
            var priceEnd = ''
            var province = ''
            var city = ''
            var mbox_csrf_token = 'b5eqOMw8BF3cbVWT_' + new Date().getTime()
            var params = {
              sceneId: sceneId,
              curPage: 1,
              pageSize: 20,
              sortType: null,
              descendOrder: null,
              priceStart: null,
              priceEnd: null,
              province: '',
              city: '',
            }
            $.ajax({
              url: 'https://widget.1688.com/front/ajax/getJsonComponent.json',
              type: 'POST',
              timeout: 60000,
              headers: {
                Accept: 'application/json, text/javascript, */*; q=0.01',
                'content-type':
                  'application/x-www-form-urlencoded; charset=UTF-8',
                origin: 'https://widget.1688.com',
                referer:
                  'https://widget.1688.com/front/ajax/bridge.html?target=brg-2584',
                'X-Requested-With': 'XMLHttpRequest',
              },
              // dataType: 'text',
              data: {
                namespace: namespace,
                widgetId: widgetId,
                methodName: methodName,
                params: JSON.stringify(params),
                sceneId: 2164,
                curPage: 1,
                pageSize: 20,
                sortType: '',
                descendOrder: '',
                priceStart: '',
                priceEnd: '',
                province: '',
                city: '',
                __mbox_csrf_token: mbox_csrf_token,
              },
              success: function (res) {},
              complete: function (XMLHttpRequest, status) {
                if (status == 'timeout') {
                  console.log(1)
                } else if (status == 'parsererror') {
                  console.log(2)
                } else if (status == 'error') {
                  console.log(3)
                }
              },
            })
          } else {
            $(div)
              .find('#sm-maindata ul li a.sm-offer-photoLink')
              .each(function () {
                var title = $(this).attr('title')
                var hasBrand = false
                brandData.forEach((item) => {
                  if (title.toLowerCase().includes(item.toLowerCase())) {
                    hasBrand = true
                  }
                })
                if (!hasBrand) {
                  if ($(this).attr('href').indexOf('dj.1688.com') !== -1) {
                    let url = $(this).attr('href')
                    superagent.get(url).end(function (err, res) {
                      if (res.status == 200) {
                        var orgUrl = res.xhr.responseURL
                        data.list.push(FillUrl(orgUrl, true))
                      }
                    })
                  } else {
                    data.list.push(FillUrl($(this).attr('href')))
                  }
                } else {
                  data.brandList.push(FillUrl($(this).attr('href')))
                }
              })
            // 取下一页
          }
          data.next = ''
          div.remove()
          callback(data)
        } else {
          data.html = ''
          callback(data)
        }
      })
    },
  },

  // 京东列表采集
  JDSortListCrawl: {
    crawl: function (url, callback, brandData) {
      Html.getHtml(url, 0, (data) => {
        if (data.html) {
          var div = $('<div></div>')
          div.html(data.html)
          data.list = []
          data.brandList = []
          data.next = ''
          $(div)
            .find('#J_goodsList .p-name a')
            .each(function () {
              var hasBrand = false
              var title = $(this).find('em').text()
              brandData.forEach((item) => {
                if (title.toLowerCase().includes(item.toLowerCase())) {
                  hasBrand = true
                }
              })
              if (!hasBrand) {
                data.list.push(FillUrl($(this).attr('href')))
              } else {
                data.brandList.push(FillUrl($(this).attr('href')))
              }
            })
          // 取下一页
          data.next = ''
          data.currentPage = 1
          data.lastPage = 1
          div.remove()
          callback(data)
        } else {
          data.html = ''
          callback(data)
        }
      })
    },
  },

  // 速卖通列表采集
  AliExpressSortListCrawl: {
    crawl: function (url, callback, brandData) {
      Html.getHtml(url, 0, (data) => {
        if (data.html) {
          var div = $('<div></div>')
          div.html(data.html)
          data.list = []
          data.brandList = []
          data.next = ''
          for (var i = 0; i < div.find('script').length; i++) {
            if (
              div.find('script')[i].innerHTML.indexOf('window.runParams') !== -1
            ) {
              var result = eval(
                div
                  .find('script')
                  [i].innerHTML.split('window.runParams.csrfToken')[0]
              )
            }
          }
          result.items.forEach((item) => {
            var title = item.title
            var hasBrand = false
            brandData.forEach((item) => {
              if (title.toLowerCase().includes(item.toLowerCase())) {
                hasBrand = true
              }
            })
            if (!hasBrand) {
              data.list.push(FillUrl(item.productDetailUrl))
            } else {
              data.brandList.push(FillUrl(item.productDetailUrl))
            }
          })
          // 取下一页
          data.next = ''
          data.currentPage = 1
          data.lastPage = 1
          div.remove()
          callback(data)
        } else {
          data.html = ''
          callback(data)
        }
      })
    },
  },

  // 亚马逊搜索分类采集
  AmazonSortListCrawl: {
    getHost: function (url) {
      var host = ''
      if (url.indexOf('www.amazon.co.uk') !== -1) {
        host = 'https://www.amazon.co.uk'
      } else if (url.indexOf('www.amazon.com.mx') !== -1) {
        host = 'https://www.amazon.com.mx'
      } else if (url.indexOf('www.amazon.com') !== -1) {
        host = 'https://www.amazon.com'
      } else if (url.indexOf('amazon.co.jp') !== -1) {
        host = 'https://www.amazon.co.jp'
      } else if (url.indexOf('www.amazon.cn') !== -1) {
        host = 'https://www.amazon.cn'
      } else if (url.indexOf('www.amazon.ca') !== -1) {
        host = 'https://www.amazon.ca'
      } else if (url.indexOf('www.amazon.de') !== -1) {
        host = 'https://www.amazon.de'
      } else if (url.indexOf('www.amazon.fr') !== -1) {
        host = 'https://www.amazon.fr'
      }
      return host
    },
    crawl: function (url, callback, brandData) {
      Html.getHtml(url, 0, (data) => {
        if (data.html) {
          var div = $('<div></div>')
          div.html(data.html)
          data.list = []
          data.brandList = []
          data.next = ''
          // 英国站
          let str = $(div).find('.s-search-results')
          var urlHost = Platform.AmazonSortListCrawl.getHost(url)
          $(div)
            .find('.s-search-results')
            .children('div')
            .each(function () {
              let url = $(this).find('h2').children('a').attr('href')
              var title = $(this).find('h2').children('a').find('span').text()
              if (url) {
                var completeUrl = ''
                if (url.includes(urlHost)) {
                  completeUrl = $(this).find('h2').children('a').attr('href')
                } else {
                  completeUrl =
                    urlHost + $(this).find('h2').children('a').attr('href')
                }
                var hasBrand = false
                brandData.forEach((item) => {
                  if (title.toLowerCase().includes(item.toLowerCase())) {
                    hasBrand = true
                  }
                })
                if (!hasBrand) {
                  data.list.push(completeUrl)
                } else {
                  data.brandList.push(completeUrl)
                }
              }
            })
          // 取下一页
          data.next = ''
          data.currentPage = 1
          data.lastPage = 1
          div.remove()
          callback(data)
        } else {
          data.html = ''
          callback(data)
        }
      })
    },
  },

  // 拼多多商城列表采集
  PinduoduoSortListCrawl: {
    crawl: function (url, callback, brandData) {
      Html.getHtml(url, 0, (data) => {
        if (data.html) {
          var div = $('<div></div>')
          div.html(data.html)
          data.next = ''
          data.list = []
          data.reqCookie = document.cookie
          data.brandList = []
          // console.log($(div).find('script'))
          try {
            $(div).find('script')[0]
            let targetScript = JSON.parse(
              $(div).find('script')[0].innerHTML.toString()
            )
            // console.log(targetScript)
            data.type = 'hasGetData'
            targetScript.props.pageProps.list.forEach((item) => {
              let result = {}
              result.productTitle = item.goodsName
              result.url =
                'https://youhui.pinduoduo.com/goods/goods-detail?goodsId=' +
                item.goodsId
              result.desc = item.goodsDesc
              result.price = (
                ((item.minGroupPrice / 100).toFixed(2) -
                  (item.couponDiscount / 100).toFixed(2)) /
                10
              ).toFixed(2)
              result.imgUrls = [item.goodsImageUrl]
              var hasBrand = false
              brandData.forEach((item) => {
                if (
                  result.productTitle.toLowerCase().includes(item.toLowerCase())
                ) {
                  hasBrand = true
                }
              })
              if (!hasBrand) {
                data.list.push(result)
              } else {
                data.brandList.push(result.url)
              }
            })
            data.next = ''
            data.currentPage = 1
            data.lastPage = 1
            div.remove()
            callback(data)

            // 一下代码容易被反爬虫
            // $(div).find('.card-wrapper').children('a').each( function () {
            // 	let completeUrl = 'https://youhui.pinduoduo.com' + $(this).attr('href')
            // 	let productTitle = $(this).text()
            //   var hasBrand = false
            //   brandData.forEach(item => {
            //     if (productTitle.toLowerCase().includes(item.toLowerCase())) {
            //       hasBrand = true
            //     }
            //   })
            //   if (!hasBrand) {
            //     data.list.push(completeUrl)
            //   } else {
            //     data.brandList.push(completeUrl)
            // 	}
            // })
          } catch (e) {
            console.log(e)
          }
        } else {
          data.html = ''
          callback(data)
        }
      })
    },
  },

  // 拼多多手机版列表采集
  YangkeduoListCrawl: {
    crawl: function (url, callback, brandData) {
      Html.getHtml(url, 0, (data) => {
        if (data.html) {
          data.list = []
          data.brandList = []
          var div = $('<div></div>')
          div.html(data.html)
          for (var i = 0; i < div.find('script').length; i++) {
            let scriptValue = div.find('script')[i].innerHTML
            if (scriptValue.includes('window.rawData')) {
              try {
                eval(scriptValue)
              } catch (error) {
                console.log(error)
              }
            }
          }
          // console.log(window.rawData)
          try {
            if (window.rawData.store.data.ssrListData.list) {
              let productList = window.rawData.store.data.ssrListData.list
              productList.forEach((item) => {
                let urlDetail = `https://mobile.yangkeduo.com/goods.html?goods_id=${item.goodsID}`
                let hasBrand = false
                brandData.forEach((brand) => {
                  if (
                    item.goodsName.toLowerCase().includes(brand.toLowerCase())
                  ) {
                    hasBrand = true
                  }
                })
                if (!hasBrand) {
                  data.list.push(urlDetail)
                } else {
                  data.brandList.push(urlDetail)
                }
              })
              data.next = ''
              data.currentPage = 1
              data.lastPage = 1
              callback(data)
            } else {
              data.next = ''
              data.currentPage = 1
              data.lastPage = 1
              data.html = ''
              callback(data)
            }
          } catch (e) {
            data.html = ''
            data.next = ''
            data.currentPage = 1
            data.lastPage = 1
            callback(data)
          }
        } else {
          data.html = ''
          data.next = ''
          data.currentPage = 1
          data.lastPage = 1
          callback(data)
        }
      })
    },
  },

  // shopee列表采集
  ShopeeListCrawl: {
    crawl: function (url, callback, brandData) {
      // 搜索查询
      let crwalUrl
      if (url.indexOf('search?keyword') > -1) {
        let parseUrlObj = queryUrlPar(url)
        crwalUrl = `https://${document.domain}/api/v2/search_items/?by=relevancy&keyword=${parseUrlObj.keyword}&limit=50&newest=0&order=desc&page_type=search&version=2`
      } else if (url.indexOf('-cat.') > -1) {
        let categoryId = url.split('-cat.')[1]
        crwalUrl = `https://${document.domain}/api/v2/search_items/?by=relevancy&limit=50&match_id=${categoryId}&newest=0&order=desc&page_type=search&version=2`
      }
      let cookie = document.cookie
      superagent
        .get(crwalUrl)
        .set({
          Accept: 'application/json, charset=utf-8',
          cookie: cookie,
          origin: 'https://youhui.pinduoduo.com',
          referer:
            'https://shopee.com.my/Case-Valker-Eco-Friendly-Bamboo-Charcoal-Comforter-Storage-Bag-Travel-Bag-i.26395043.1600374711',
          'user-agent': getUserAgent(),
        })
        .then((res) => {
          let data = {}
          try {
            data.list = []
            data.brandList = []
            res.body.items.forEach((item) => {
              let name = item.name.split(' ').join('-')
              let urlDetail = `https://${document.domain}/${name}.-i.${item.shopid}.${item.itemid}`
              let hasBrand = false
              brandData.forEach((brand) => {
                if (name.toLowerCase().includes(brand.toLowerCase())) {
                  hasBrand = true
                }
              })
              if (!hasBrand) {
                data.list.push(urlDetail)
              } else {
                data.brandList.push(urlDetail)
              }
            })
            data.next = ''
            data.currentPage = 1
            data.lastPage = 1
            callback(data)
          } catch (e) {
            console.log(e)
            data.html = ''
            callback(data)
          }
        })
        .catch((err) => {
          console.log(err)
          let data = {}
          data.html = ''
          callback(data)
        })
    },
  },

  // shopee店铺采集
  ShopeeCategoryCrawl: {
    crawl: function (url, callback, brandData) {
      let shopId = url.split('/shop/')[1].split('/')[0]
      let crwalUrl
      let parseUrlObj = queryUrlPar(url)
      let str = []
      Object.keys(parseUrlObj).forEach((item) => {
        let value = parseUrlObj[item]
        if (item == 'page') {
          str.push('newest=' + value * 30)
        } else if (item == 'order') {
          str.push('order=' + value)
        } else if (item == 'sortBy') {
          str.push('by=' + value)
        } else if (item == 'originalCategoryId') {
          str.push('original_categoryid=' + value)
        }
      })
      if (!Object.keys(parseUrlObj).includes('order')) {
        str.push('order=desc')
      }
      let strValue = str.join('&')
      if (Object.keys(parseUrlObj).length <= 0) {
        crwalUrl = `https://${document.domain}/api/v2/search_items/?by=pop&limit=30&match_id=${shopId}&newest=0&order=desc&page_type=shop&version=2`
      } else {
        crwalUrl = `https://${document.domain}/api/v2/search_items/?limit=30&match_id=${shopId}&${strValue}&page_type=shop&version=2`
      }
      let cookie = document.cookie
      superagent
        .get(crwalUrl)
        .set({
          Accept: 'application/json, charset=utf-8',
          cookie: cookie,
          origin: 'https://youhui.pinduoduo.com',
          referer:
            'https://shopee.com.my/Case-Valker-Eco-Friendly-Bamboo-Charcoal-Comforter-Storage-Bag-Travel-Bag-i.26395043.1600374711',
          'user-agent': getUserAgent(),
        })
        .then((res) => {
          let data = {}
          try {
            data.list = []
            data.brandList = []
            res.body.items.forEach((item) => {
              let name = item.name.split(' ').join('-')
              let urlDetail = `https://${document.domain}/${name}.-i.${item.shopid}.${item.itemid}`
              let hasBrand = false
              brandData.forEach((brand) => {
                if (name.toLowerCase().includes(brand.toLowerCase())) {
                  hasBrand = true
                }
              })
              if (!hasBrand) {
                data.list.push(urlDetail)
              } else {
                data.brandList.push(urlDetail)
              }
            })
            data.next = ''
            data.currentPage = 1
            data.lastPage = 1
            callback(data)
          } catch (e) {
            data.html = ''
            callback(data)
          }
        })
        .catch((err) => {
          let data = {}
          data.html = ''
          callback(data)
        })
    },
  },

  // lazada列表采集
  LazadaListCrawl: {
    crawl: function (url, callback, brandData) {
      Html.getHtml(url, 0, (data) => {
        if (data.html) {
          let div = $('<div></div>')
          div.html(data.html)
          data.list = []
          data.brandList = []
          for (var i = 0; i < div.find('script').length; i++) {
            let scriptValue = div.find('script')[i].innerHTML
            if (scriptValue.includes('window.pageData=')) {
              try {
                // eval(scriptValue)
              } catch (error) {
                console.log(error)
              }
            }
          }
          try {
            if (window.pageData) {
              let listItems = window.pageData.mods.listItems
              let pageSize, currentPage
              pageSize = window.pageData.mainInfo.pageSize
              currentPage = window.pageData.mainInfo.page
              listItems.forEach((item) => {
                let urlDetail = 'https:' + item.productUrl
                let hasBrand = false
                brandData.forEach((brand) => {
                  if (item.name.toLowerCase().includes(brand.toLowerCase())) {
                    hasBrand = true
                  }
                })
                if (!hasBrand) {
                  data.list.push(urlDetail)
                } else {
                  data.brandList.push(urlDetail)
                }
              })
              data.next = ''
              data.currentPage = 1
              data.lastPage = 1
              callback(data)
            } else {
              data.html = ''
              data.next = ''
              data.currentPage = 1
              data.lastPage = 1
              callback(data)
            }
          } catch (err) {
            data.html = ''
            data.next = ''
            data.currentPage = 1
            data.lastPage = 1
            callback(data)
          }
        } else {
          data.html = ''
          data.next = ''
          data.currentPage = 1
          data.lastPage = 1
          callback(data)
        }
      })
    },
  },
  // lazada店铺采集
  LazadaCategoryCrawl: {
    crawl: function (url, callback, brandData) {
      Html.getHtml(url, 0, (data) => {
        if (data.html) {
          let div = $('<div></div>')
          div.html(data.html)
          data.list = []
          data.brandList = []
          for (var i = 0; i < div.find('script').length; i++) {
            let scriptValue = div.find('script')[i].innerHTML
            if (scriptValue.includes('window.pageData=')) {
              try {
                eval(scriptValue)
              } catch (error) {
                console.log(error)
              }
            }
          }
          try {
            if (window.pageData) {
              let listItems = window.pageData.mods.listItems
              let pageSize, currentPage
              pageSize = window.pageData.mainInfo.pageSize
              currentPage = window.pageData.mainInfo.page
              listItems.forEach((item) => {
                let urlDetail = 'https:' + item.productUrl
                let hasBrand = false
                brandData.forEach((brand) => {
                  if (item.name.toLowerCase().includes(brand.toLowerCase())) {
                    hasBrand = true
                  }
                })
                if (!hasBrand) {
                  data.list.push(urlDetail)
                } else {
                  data.brandList.push(urlDetail)
                }
              })

              // 页数全部采集
              // let params = queryUrlPar(url)
              // try {
              //     if(currentPage <  pageSize) {
              //         params.page = Number(currentPage) + 1
              //         let str = []
              //         Object.keys(params).forEach(item => {
              //             let value = params[item]
              //             str.push(`${item}=${value}`)
              //         })
              //         data.next = url.split('?')[0] + '?' + str.join('&')
              //         data.currentPage = currentPage
              //         data.lastPage = pageSize
              //     } else {
              //         data.next = ''
              //         data.currentPage = 1
              //         data.lastPage = 1
              //     }
              // } catch(err) {
              //     console.log(err)
              //     data.next = ''
              //     data.currentPage = 1
              //     data.lastPage = 1
              // }
              data.next = ''
              data.currentPage = 1
              data.lastPage = 1
              callback(data)
            } else {
              data.html = ''
              data.next = ''
              data.currentPage = 1
              data.lastPage = 1
              callback(data)
            }
          } catch (err) {
            data.html = ''
            data.next = ''
            data.currentPage = 1
            data.lastPage = 1
            callback(data)
          }
        } else {
          data.html = ''
          data.next = ''
          data.currentPage = 1
          data.lastPage = 1
          callback(data)
        }
      })
    },
  },

  // 兰亭集势单品采集
  LightinCrawl: {
    crawl: function (url, callback, sync) {
      Html.getHtml(url, 0, (data) => {
        data.url = url
        if (data.html) {
          data.desc = ''
          var div = $('<div></div>')
          div.html(data.html)
          let info = div.find('#_prodInfoConfig_').attr('data-config')
          data.desc = info
          let productTitle = ''
          try {
            productTitle = div.find('.prod-info-title')[0].innerText.split('#')[0]
          } catch (e) {
            productTitle = $(div).find('title').text()
          }
          data.productTitle = productTitle
          callback(data)
        }
      })
    },
  },

  // 兰亭集势列表采集
  LightinListCrawl: {
    crawl: function (url, callback, brandData) {
      Html.getHtml(url, 0, (data) => {
        if (data.html) {
          let div = $('<div></div>')
          div.html(data.html)
          data.list = []
          data.brandList = []
          let element = $(
            document.getElementsByClassName('pagelet product-list')[0]
          ).children('.item-new')
          let promotionElement = $(
            document.getElementsByClassName('index_productContent_5MBtU')[0]
          ).children('a')
          if (element.length > 0) {
            for (let i = 0; i < element.length; i++) {
              let href = $(element[i]).find('.prod-name .ctr-track').attr('href')
              let title = $(element[i])
                .find('.prod-name .ctr-track')
                .attr('title')
              var hasBrand = false
              brandData.forEach((item) => {
                if (title.toLowerCase().includes(item.toLowerCase())) {
                  hasBrand = true
                }
              })
              if (!hasBrand) {
                data.list.push(href)
              } else {
                data.brandList.push(href)
              }
            }
          } else if (promotionElement.length > 0) {
            for (let i = 0; i < promotionElement.length; i++) {
              let href = $(promotionElement[i]).attr('href')
              let title = $(promotionElement[i])
                .find('.index_description_2q9fg p')
                .text()
              var hasBrand = false
              brandData.forEach((item) => {
                if (title.toLowerCase().includes(item.toLowerCase())) {
                  hasBrand = true
                }
              })
              if (!hasBrand) {
                data.list.push(href)
              } else {
                data.brandList.push(href)
              }
            }
          }
          data.next = ''
          data.currentPage = 1
          data.lastPage = 1
          callback(data)
        } else {
          data.next = ''
          data.currentPage = 1
          data.lastPage = 1
          callback(data)
        }
      })
    },
  }
}
