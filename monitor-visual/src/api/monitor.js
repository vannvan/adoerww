import { get, post } from './http'

export default {
  getMonitorPage: (p) => get('/monitor/page', p), // 获取分页列表

  handleLogin: (p) => post('/auth/login', p), //登录

  getMonitorList: (p) => get('/monitor/list', p), // 获取列表

  getMemberPage: (p) => get('/member/page', p), //成员列表

  handleAddProject: (p) => post('/project/add', p) //新增项目
}
