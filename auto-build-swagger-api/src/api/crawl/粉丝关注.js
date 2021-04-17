import { post } from '@/utils/request'

// 获取粉丝列表
export function get(data, cb, errHandle) {
  return post('/product/crawl/shopee-fans/get', data, cb, errHandle)
}
