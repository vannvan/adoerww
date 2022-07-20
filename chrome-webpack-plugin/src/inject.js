import { isMatches } from '@/lib/content-scripts-config'
// 支持采集的平台
if (isMatches(location.href)) {
  require('@/inject/content')
  require('@/inject/main')
  require('@/inject/erp')
  require('@/inject/erp-goods-collection')
  require('@/background/config/message')
  require('@/inject/bind-order')
}


// 加载远程脚本代码方式
// let urlArr = [{url: 'https://sw-erp.oss-accelerate.aliyuncs.com/crawl-plugin/inject.js',type: 'js'},{url: 'https://sw-erp.oss-accelerate.aliyuncs.com/crawl-plugin/inject.css', type: 'css'}];
// chrome.runtime.sendMessage({ type: 'EXECUTE_SCRIPT', options: urlArr })