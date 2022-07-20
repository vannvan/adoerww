import { post } from '@/utils/request'

// 批量更改当前用户采集模板名
export function batchUpdateCrawlTemplateName(data, cb, errHandle) {
  return post('/product/crawl/member/batch-update-crawl-template-name', data, cb, errHandle)
}

// 删除当前用户采集模板
export function deleCrawlTemplate(data, cb, errHandle) {
  return post('/product/crawl/member/dele-crawl-template', data, cb, errHandle)
}

// 获取当前用户采集配置
export function getCrawlConfig(data, cb, errHandle) {
  return post('/product/crawl/member/get-crawl-config', data, cb, errHandle)
}

// 模板id获取当前采集模板
export function getCrawlTemplate(data, cb, errHandle) {
  return post('/product/crawl/member/get-crawl-template', data, cb, errHandle)
}

// 获取当前用户采集模板列表
export function listCrawlTemplate(data, cb, errHandle) {
  return post('/product/crawl/member/list-crawl-template', data, cb, errHandle)
}

// 获取需更新版本信息(返回空则为不用更新)
export function queryUpdatePlug(data, cb, errHandle) {
  return post('/product/crawl/member/query-update-plug', data, cb, errHandle)
}

// 更改当前用户采集配置
export function updateCrawlConfig(data, cb, errHandle) {
  return post('/product/crawl/member/update-crawl-config', data, cb, errHandle)
}

// 更改当前用户采集模板
export function updateCrawlTemplate(data, cb, errHandle) {
  return post('/product/crawl/member/update-crawl-template', data, cb, errHandle)
}

// 更改当前用户采集模板名
export function updateCrawlTemplateName(data, cb, errHandle) {
  return post('/product/crawl/member/update-crawl-template-name', data, cb, errHandle)
}
