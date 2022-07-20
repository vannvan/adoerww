import axios from 'axios'
import API_CONFIG from './api.conf'
import ERROR_CONF from './error.conf'

const service = axios.create({
  baseURL: API_CONFIG[process.env.NODE_ENV], // api的base_url
  timeout: 60000 // 设置请求超时时间30s
})

const failed = (error) => {
  console.log(error)
}

service.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(({ data, config }) => {
  if (['put', 'post', 'delete', 'patch'].includes(config.method) && data.meta) {
    window._VV.errorAlert(data.meta.message)
  }
  console.log(data, 'ahhahaa')

  return data || null
}, failed)
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    service
      .get(url, {
        params: params
      })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    service
      .post(url, params)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
