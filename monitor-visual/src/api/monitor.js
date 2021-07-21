import { get, post } from './http'

export default {
  getMonitorPage: (p) => get('/monitor/page', p), // 获取分页列表

  handleLogin: (p) => post('/auth/login', p) //登录
}
