const LIMIT_TIME = 1000 * 60 * 60 * 2

/**
 * 是否已过期
 * @param key
 * @returns
 */

type TStoreKey = 'background' | 'lunar' | 'todayText' | 'theme' | 'webList'

export const storeIsExpire = (key: TStoreKey, limit?: string) => {
  if (!key) return true
  if (localStorage.getItem(key)) {
    const { time } = JSON.parse(localStorage.getItem(key) as any)
    if (new Date().getTime() - time > (limit || LIMIT_TIME)) {
      return true
    } else {
      return false
    }
  } else {
    return true
  }
}

/**
 * 数据存储到本地
 * @param key
 * @param data
 */
export const storeToLocal = (key: TStoreKey, data: any) => {
  if (!key || !data) return
  const { time, ...rest } = data
  if (!rest) return
  localStorage.setItem(
    key,
    JSON.stringify({
      ...data,
      time: new Date().getTime(),
    })
  )
}

/**
 * 获取本地存储
 * @param key
 * @returns
 */
export const getStoreData = (key: TStoreKey) => {
  if (localStorage.getItem(key)) {
    const data = JSON.parse(localStorage.getItem(key) as any)
    return data
  } else {
    return {}
  }
}

export const randomColor = () =>
  '#' +
  Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padEnd(6, '0')

/**
 * 补充空节点
 * @param row
 * @param len
 * @returns
 */
export const supplEmptyNodes = (row: number, len: number) => {
  const add = Array.from({ length: row - (len % row) }, (v, k) => {
    return {
      name: '',
      link: '',
    }
  })
  return add
}
