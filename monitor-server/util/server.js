/*
 * @Description:
 * @Date: 2021-07-21 14:26:01
 * @Author: vannvan
 * @Email: adoerww@gmail.com
 * @LastEditTime: 2021-08-30 18:28:56
 * --------
 * Copyright (c) github.com/vannvan
 */
const { post, get } = require('./axios')
const axios = require('axios')

// 登录erp后台拿token
function handlerLoginERPMG({ account, password }) {
  return new Promise((resolve, reject) => {
    let params = { account: account, password: password, type: 2 }
    post('api/mg/mg-account/login', params)
      .then((res) => {
        resolve(res.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 获取erp菜单列表
function getErpAllMenuList(token) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
  return new Promise((resolve, reject) => {
    get('api/member/menu/all/list')
      .then((res) => {
        resolve(res.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

module.exports = {
  handlerLoginERPMG,
  getErpAllMenuList,
}
