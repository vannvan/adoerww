import { Platform } from '../config/platform.js'

export const Crawl = {
  config: {
    single: [
      { 'taobao.com': Platform.TaobaoCrawl },
      { '1688.com': Platform.ALiBabaCrawl },
      { 'tmall.com': Platform.TmallCrawl },
      { 'aliexpress.com': Platform.SmtCrawl },
      { 'lazada': Platform.LazadaCrawl },
      { 'shopee.': Platform.ShopeeCrawl },
      { 'xiapibuy.com': Platform.ShopeeCrawl },
      { 'mobile.yangkeduo.com': Platform.YangkeduoCrawl },
      { 'pifa.pinduoduo.com': Platform.PifaPinduoduoCrawl }
    ],
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
  }
}
