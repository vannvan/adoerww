import $ from 'jquery'
import { Platform } from '../config/platform.js'
import { CONFIGINFO } from '../config.js'
import { ShopeModal } from '../config/modal.js'
import { Html } from '@/background/server/html.js'
const qweQWE = require('@/background/config/platform')
var dataArr = [] // 存放重复的采集数据
var contentObj = $('#repeatCrawlModalContent .RepeatBox')
var jj = 0
var failsUrls = ''

export const Crawl = {
  config: {
    single: [
      { 'taobao.com': Platform.TaobaoCrawl },
      { '1688.com': Platform.ALiBabaCrawl },
      { 'tmall.com': Platform.TmallCrawl },
      { 'aliexpress.com': Platform.SmtCrawl },
      { ebay: Platform.EbayCrawl },
      { amazon: Platform.AmazonComCrawl },
      { 'jd.com': Platform.JDCrawl },
      { 'alibaba.com': Platform.AlibabaGjCrawl },
      { 'dhgate.com': Platform.DhgateCrawl },
      { 'etsy.com': Platform.EtsyCrawl },
      { lazada: Platform.LazadaCrawl },
      { 'pfhoo.com': Platform.PfhooCrawl },
      { 'www.banggood.com': Platform.BanggoodCrawl },
      { 'chinavasion.com': Platform.Chinavasion },
      { 'gearbest.com': Platform.GearbestCrawl },
      { 'walmart.com': Platform.WalmartCrawl },
      { 'ebay.com': Platform.EbayCrawl },
      { 'ebay.co.uk': Platform.EbayCrawl },
      { 'ebay.ca': Platform.EbayCrawl },
      { 'ebay.de': Platform.EbayCrawl },
      { 'ebay.fr': Platform.EbayCrawl },
      { 'amazon.com': Platform.AmazonCrawl },
      { 'amazon.co.jp': Platform.AmazonCrawl },
      { 'amazon.cn': Platform.AmazonCrawl },
      { 'amazon.co.uk': Platform.AmazonCrawl },
      { 'amazon.ca': Platform.AmazonCrawl },
      { 'amazon.com.mx': Platform.AmazonCrawl },
      { 'amazon.de': Platform.AmazonCrawl },
      { 'amazon.fr': Platform.AmazonCrawl },
      { 'us.banggood.com': Platform.BanggoodCrawl },
      { 'chinabrands.com': Platform.ChinabrandsCrawl },
      { 'chinabrands.cn': Platform.ChinabrandsCrawl },
      { 'wish.com': Platform.WishCrawl },
      { 'joom.com': Platform.JoomCrawl },
      { 'tophatter.com': Platform.TophatterCrawl },
      { 'haiyingshuju.com': Platform.HaiYingShuJuCrawl },
      { 'yixuanpin.cn': Platform.YiXuanPinCrawl },
      { 'shopee.': Platform.ShopeeCrawl },
      // { 'tw.shopeesz.com': ShopeeCrawl },
      { 'xiapibuy.com': Platform.ShopeeCrawl },
      { 'yangkeduo.com': Platform.YangkeduoCrawl },
      // { 'youhui.pinduoduo.com': PinduoduoCrawl },
      { 'youhui.pinduoduo.com': Platform.PinduoduoCrawl2 },
      { 'lightinthebox.com': Platform.LightinCrawl }
    ],
    category: [
      { 'taobao.com': Platform.TaobaoCategoryCrawl },
      { 'tmall.com': Platform.TmallCategoryCrawl },
      { '1688.com': Platform.ALiBaBaCategoryCrawl },
      { 'ebay.com': Platform.EbayCategoryCrawl },
      { 'amazon.com': Platform.AmazonCategoryCrawl },
      { 'aliexpress.com': Platform.SmtCategoryCrawl },
      { 'jd.com': Platform.JDCategoryCrawl },
      { 'shopee.': Platform.ShopeeCategoryCrawl },
      { 'xiapibuy.com': Platform.ShopeeCategoryCrawl },
      { lazada: Platform.LazadaCategoryCrawl }
    ],
    sortlist: [
      { 'taobao.com': Platform.TaobaoSortListCrawl },
      { 'tmall.com': Platform.TmallSortListCrawl },
      { '1688.com': Platform.AliBabaSortListCrawl },
      { 'jd.com': Platform.JDSortListCrawl },
      { 'aliexpress.com': Platform.AliExpressSortListCrawl },
      { 'amazon.co.uk': Platform.AmazonSortListCrawl },
      { 'amazon.com': Platform.AmazonSortListCrawl },
      { 'www.amazon.cn': Platform.AmazonSortListCrawl },
      { 'www.amazon.ca': Platform.AmazonSortListCrawl },
      { 'www.amazon.com.mx': Platform.AmazonSortListCrawl },
      { 'www.amazon.de': Platform.AmazonSortListCrawl },
      { 'www.amazon.fr': Platform.AmazonSortListCrawl },
      { 'www.amazon.co.jp': Platform.AmazonSortListCrawl },
      { 'youhui.pinduoduo.com': Platform.PinduoduoSortListCrawl },
      { 'shopee.': Platform.ShopeeListCrawl },
      { 'xiapibuy.com': Platform.ShopeeListCrawl },
      { 'yangkeduo.com': Platform.YangkeduoListCrawl },
      { lazada: Platform.LazadaListCrawl },
      { 'lightinthebox.com': Platform.LightinListCrawl }
    ]
  },
  checkUrl: function(type, url) {
    var urlArr = url.toLowerCase().split('\n')
    var errorArr = []
    for (var i in urlArr) {
      url = urlArr[i]
      var b = false
      for (var j in Crawl.config[type]) {
        for (var key in Crawl.config[type][j]) {
          if (key.indexOf('&-&') > -1) {
            var num = 0
            var amzKey = key.split('&-&')
            for (var k in amzKey) {
              if (url.indexOf(amzKey[k]) > -1) {
                num++
              }
            }
            if (num == amzKey.length) {
              b = true
              break
            }
          } else {
            if (url.indexOf(key) > -1) {
              b = true
              break
            }
          }
        }
        if (b) break
      }
      !b && errorArr.push('采集地址无效，或不支持该网址采集。')
    }
    return errorArr
  },
  getCrawlObject: function(type, url) {
    for (var j in Crawl.config[type]) {
      for (var key in Crawl.config[type][j]) {
        var chKey = key
        if (chKey.indexOf('&-&') > -1) {
          chKey = key.split('&-&')[0]
        }
        if (url.indexOf(chKey) > -1) {
          return Crawl.config[type][j][key]
        }
      }
    }
    return null
  },
  singleCrawl: function(
    uid,
    urls,
    checkFinish,
    haveNext,
    crawlCategory,
    sync,
    brandData,
    salePriceObj
  ) {
    var urlArr = []
    if (urls) urlArr = urls.split('\n')
    var total = urlArr.length
    var processNum = 0
    var brandUrlNum = 0
    for (var i in urlArr) {
      // 去除链接中的逗号
      if (urlArr[i].indexOf(',') > -1) {
        urlArr[i] = urlArr[i].replace(/,/g, '')
      }
      if (
        urlArr[i] &&
        urlArr[i].indexOf('aliexpress.com/store/product/') !== -1 &&
        urlArr[i].indexOf('.html') !== -1
      ) {
        var itemId = urlArr[i].substring(
          urlArr[i].indexOf('aliexpress.com/store/product/') + 29,
          urlArr[i].indexOf('.html')
        )
        if (itemId && itemId.indexOf('/') !== -1) {
          var itemIdArray = itemId.split('/')
          urlArr[i] = urlArr[i].replace(itemIdArray[0] + '/', '')
          var newItemId = itemIdArray[1]
          if (urlArr[i] && newItemId && newItemId.indexOf('_') !== -1) {
            var idArrays = newItemId.split('_')
            urlArr[i] = urlArr[i].replace(newItemId, idArrays[1]).replace('store/product', 'item')
          }
        }
      }
      var crawlObj = Crawl.getCrawlObject('single', urlArr[i])
      // 定时采集
      crawlObj &&
        crawlObj.crawl(urlArr[i], function(data) {
          data.repeatCheck = 1 // 必须查重
          processNum++
          // 截取亚马逊商品的链接 去除qid字符串
          var amazonUrl = data.url
          if (amazonUrl.indexOf('www.amazon.com') > -1) {
            if (amazonUrl.indexOf('qid') > -1) {
              var begin = amazonUrl.indexOf('qid')
              var qidStr = amazonUrl.substring(begin, begin + 15)
              data.url = amazonUrl.replace(qidStr, '')
            }
          }
          // 返回后台需要的数据格式
          let baseURL = CONFIGINFO.url.ApiUrl
          data.token = uid
          data.type = 1
          data.baseURL = baseURL
          data.detailUrl = data.url
          // 淘宝折扣价
          if (salePriceObj) {
            data.price = salePriceObj[urlArr[i]]
          }
          var hsaBrand = false
          if (checkFinish && data.productTitle && data.productTitle !== '') {
            if (brandData) {
              brandData.forEach(item => {
                if (data.productTitle.toLowerCase().includes(item.toLowerCase())) hsaBrand = true
              })
              if (hsaBrand) delete data.html
            }
          }
          if (data.html) {
            Html.postCrawlHtml(
              CONFIGINFO.url.postCrawlHtml(),
              data,
              0,
              function(result) {
                var objCrawl = result.repeatCrawlProduct
                var isRepeat = 0
                if (objCrawl) {
                  isRepeat = objCrawl.repeatCrawl
                }

                // 价格为null 显示空串
                if (objCrawl && objCrawl.price == null) {
                  result.repeatCrawlProduct.price = ''
                }
                if (!crawlCategory) {
                  // 单品采集
                  if (isRepeat == 1) {
                    // 重复，生成td，并记录重复的data
                    dataArr.push(data)

                    var html = ''
                    html +=
                      '<tr><td style="width:50px;"><input name="sourceUrlRepeat" type="checkbox" value="' +
                      result.repeatCrawlProduct.sourceUrl +
                      '"/></td>'
                    html += '<td style="width:80px;">'
                    html += '<div class="imgDivOut">'
                    html += '<div class="imgDivIn">'
                    html +=
                      '<img src="' +
                      result.repeatCrawlProduct.imgUrl.split('|')[0] +
                      '" class="imgCss" width="71px" height="71px"/></div></div></td>'
                    html +=
                      '<td style="text-align:left;"><a href="' +
                      result.repeatCrawlProduct.sourceUrl +
                      '" target="_blank">' +
                      result.repeatCrawlProduct.name +
                      '</a></td>'
                    html +=
                      '<td style="width:80px;">' + result.repeatCrawlProduct.price + '</td></tr>'

                    contentObj.append(html)
                    $('#repeatCrawlModal')
                      .find('input[name = "sourceUrlRepeat"]')
                      .prop('checked', false)
                    if (checkFinish && total === processNum) {
                      // 表示采集完成,显示重复采集记录模态层
                      ShopeModal.hide('#crawlingModal')
                      ShopeModal.show('#repeatCrawlModal')
                      // $("#loading").modal("hide");
                    }
                  }
                  // 记录采集结果 (最后一条+没有下一页才显示)
                  if (checkFinish) {
                    // 非过滤不需要记录结果
                    Crawl.recordCrawlResult(
                      result,
                      data.url,
                      checkFinish && total === processNum,
                      isRepeat,
                      crawlCategory
                    )
                    if (dataArr.length == 0 && checkFinish && total === processNum) {
                      Crawl.displayCrawlResult(checkFinish && total === processNum)
                    } else if (dataArr.length > 0 && checkFinish && total === processNum) {
                      ShopeModal.hide('#crawlingModal')
                      ShopeModal.show('#repeatCrawlModal')
                    }
                  }
                } else {
                  // 分类采集

                  // 判断是否重复
                  if (isRepeat == 1) {
                    dataArr.push(data)
                    var html = ''
                    html +=
                      '<tr class="content"><td class="has-ipt"><input name="sourceUrlRepeat" type="checkbox" value="' +
                      objCrawl.sourceUrl +
                      '">'
                    html += '</td><td class="img-box"><div class="img-out">'
                    html +=
                      '<img class="imgCss" src="' +
                      objCrawl.imgUrl.split('|')[0] +
                      '" width="50px" height="50px"/></div></td>'
                    html +=
                      '<td><a href="' +
                      objCrawl.sourceUrl +
                      '" target="_blank">' +
                      objCrawl.name +
                      '</a></td><td class="num f-right">' +
                      objCrawl.price +
                      '</td></tr>'
                    $('#repeatCrawlModal')
                      .find('#repeatValue')
                      .append(html)
                    $('#repeatCrawlModal')
                      .find('input[name = "sourceUrlRepeat"]')
                      .prop('checked', false)
                    if (checkFinish && total === processNum) {
                      // 表示采集完成,显示重复采集记录模态层
                      ShopeModal.show('#repeatCrawlModal')
                    }
                  }
                  Crawl.recordCrawlResult(
                    result,
                    data.url,
                    checkFinish && total === processNum,
                    isRepeat,
                    crawlCategory
                  )
                }
              },
              sync
            )
          } else {
            // debugger
            if (!crawlCategory && checkFinish) {
              // 非过滤不需要记录结果
              data.code = -1
              if (!data.msg) {
                data.msg = '采集错误，请联系管理员'
              }
              /* if (hsaBrand) {
                                data.msg = '采集标题含有品牌词'
                            } else {
                                data.msg = '采集内容为空！'
                            }*/
              Crawl.recordCrawlResult(
                data,
                data.url,
                checkFinish && total === processNum,
                crawlCategory
              )
              if (dataArr.length == 0 && checkFinish && total === processNum) {
                Crawl.displayCrawlResult(checkFinish && total === processNum)
              } else if (dataArr.length > 0 && checkFinish && total === processNum) {
                $('#repeatCrawlModal')
                  .find('input[name = "sourceUrlRepeat"]')
                  .prop('checked', false)
                ShopeModal.hide('#crawlingModal')
                ShopeModal.show('#repeatCrawlModal')
              }
            }
          }
        })
    }
  },
  // 拼多多采集
  PinduoduoBatchCrawl: function(uid, url, crawlObj, brandData) {
    crawlObj &&
      crawlObj.crawl(
        url,
        function(res) {
          res.list.forEach((item, index) => {
            // 返回后台需要的数据格式
            let data = {}
            data.token = uid
            data.type = 1
            data.baseURL = CONFIGINFO.url.ApiUrl
            data.detailUrl = item.url
            data.url = item.url
            data.html = JSON.stringify(item)
            data.productTitle = item.productTitle
            var hsaBrand = false
            if (data.productTitle && data.productTitle !== '') {
              if (brandData) {
                brandData.forEach(itemI => {
                  if (data.productTitle.toLowerCase().includes(itemI.toLowerCase())) hsaBrand = true
                })
                if (hsaBrand) delete data.html
              }
            }
            if (data.html) {
              Html.postCrawlHtml(CONFIGINFO.url.postCrawlHtml(), data, 0, function(result) {}, true)
            }
          })
        },
        brandData
      )
  },
  // shopee采集
  shopeeBatchCrawl: function(uid, url, crawlObj, brandData) {
    crawlObj &&
      crawlObj.crawl(
        url,
        function(res) {
          let brandList = []
          if (res.item !== '') {
            res.item.forEach(item => {
              let name = item.name.split(' ').join('-')
              let urlDetail = `${res.domain}${name}.-i.${item.shopid}.${item.itemid}`
              let hasBrand = false
              brandData.forEach(brand => {
                if (name.toLowerCase().includes(brand.toLowerCase())) {
                  hasBrand = true
                }
              })
              if (hasBrand) {
                brandList.push(urlDetail)
              } else {
                // 返回后台需要的数据格式
                let data = {}
                data.token = uid
                data.type = 1
                data.baseURL = CONFIGINFO.url.ApiUrl
                data.detailUrl = urlDetail
                data.url = urlDetail
                data.html = JSON.stringify(item)
                data.productTitle = name
                Html.postCrawlHtml(
                  CONFIGINFO.url.postCrawlHtml(),
                  data,
                  0,
                  function(result) {},
                  true
                )
              }
            })
          }
        },
        brandData
      )
  },
  showCrawlingResult: function() {
    $('#crawlingDesc').text('正在采集......')
    ShopeModal.show('#crawlingModal')
  },
  displayCrawlResult: function(isFinish) {
    isFinish && $('#crawlDesc').text('采 集 完 成！')
    ShopeModal.hide('#crawlingModal')
    ShopeModal.show('#crawlResultModal')
  },

  recordCrawlResult: function(data, url, c, repeat, crawlCategory) {
    if (!crawlCategory) {
      // 不是分类采集
      $('#crawlingDesc').html('正在采集：' + url)
      if (repeat != 1) {
        var successNum = parseInt($('#successNum').text())

        var failNum = parseInt($('#failNum').text())
        if (data.code == 0) {
          $('#successNum').text(successNum + 1)
        } else {
          $('#failNum').text(failNum + 1)
          if (data.msg) {
            $('#failDetailDiv').show()
            $('#failDetail').append(
              '<div>' + '原因：' + data.msg + '</div>' + '<div>  采集地址: ' + url + '</div>'
            )
          }
        }
      }
    }
  }
}
