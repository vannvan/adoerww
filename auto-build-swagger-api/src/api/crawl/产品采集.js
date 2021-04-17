import { post } from '@/utils/request'

// 采集测试
export function link(data, cb, errHandle) {
  return post('/product/crawl/test/link', data, cb, errHandle)
}

// 上传网路图片
export function uploadLink(data, cb, errHandle) {
  return post('/product/crawl/test/upload-link', data, cb, errHandle)
}

// 上传网路图片2
export function upload2(data, cb, errHandle) {
  return post('/product/crawl/test/upload2', data, cb, errHandle)
}
