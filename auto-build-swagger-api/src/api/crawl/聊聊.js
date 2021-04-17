import { post } from '@/utils/request'

// 添加店铺
export function addStore(data, cb, errHandle) {
  return post('/product/crawl/talk/add-store', data, cb, errHandle)
}

// 解绑店铺
export function delStore(data, cb, errHandle) {
  return post('/product/crawl/talk/del-store', data, cb, errHandle)
}

// shopee登录
export function login(data, cb, errHandle) {
  return post('/product/crawl/talk/login', data, cb, errHandle)
}

// 店铺列表
export function storeList(data, cb, errHandle) {
  return post('/product/crawl/talk/store-list', data, cb, errHandle)
}

// 修改店铺别名
export function updateStoreAlias(data, cb, errHandle) {
  return post('/product/crawl/talk/update-store-alias', data, cb, errHandle)
}

// 修改店铺备注
export function updateStoreRemark(data, cb, errHandle) {
  return post('/product/crawl/talk/update-store-remark', data, cb, errHandle)
}
