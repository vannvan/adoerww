/**
 * 获取图片
 * @returns
 */

export const getBackground = (source: 1 | 2, type: string): Promise<string> => {
  return new Promise((resolve) => {
    if (source === 1) {
      fetch(`https://api.btstu.cn/sjbz/api.php?lx=${type}&format=json`).then(async (res) => {
        if (res) {
          const { imgurl } = await res.json()
          resolve(imgurl)
        } else {
          resolve('')
        }
      })
    }
    if (source === 2) {
      fetch('https://api.vvhan.com/api/bing?type=json&rand=sj').then(async (res) => {
        if (res) {
          const { data } = await res.json()
          // console.log('url', data)
          resolve(data.url)
        } else {
          resolve('')
        }
      })
    }
  })
}

/**
 * 今天的话
 * @returns
 */
export const getTodayTextString = (): Promise<string> => {
  return new Promise((resolve) => {
    fetch('https://api.vvhan.com/api/en?type=sj').then(async (res) => {
      const { data } = await res.json()
      if (data) {
        resolve(data.zh)
      } else {
        resolve('')
      }
    })
  })
}

/**
 * 获取农历
 * @returns
 */
export const getLunarInfo = (date: string): Promise<string> => {
  if (!date) Promise.resolve('')
  return new Promise((resolve) => {
    fetch(`http://lunarapi.top/lunar/getbydate?date=${date}`).then(async (res) => {
      const { data } = await res.json()
      console.log('data', data)
      if (data) {
        resolve(`${data.lmonth}${data.lday}`)
      } else {
        resolve('')
      }
    })
  })
}
