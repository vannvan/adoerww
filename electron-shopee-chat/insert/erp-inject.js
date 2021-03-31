console.log('erp inject')
const { ipcRenderer } = require('electron')

var globalTimer = null
window._VV.$router.beforeEach(function (to, from, next) {
  if (to.name != 'overview') {
    next()
  }
})

async function loopGetStorageTask() {
  document.querySelector('.ant-dropdown-link')
    ? document.querySelector('.ant-dropdown-link').remove()
    : null
  try {
    let erpStorage = localStorage.getItem('erp')
    let authInfo = {}
    if (erpStorage) {
      authInfo = JSON.parse(erpStorage).auth
      if (authInfo.access_token) {
        let { menuList, ...rest } = authInfo
        ipcNotice({
          type: 'SET_ERP_AUTH',
          params: rest,
        })
        window._VV.successAlert('登录成功,正在获取店铺数据，请稍后...')
        clearInterval(globalTimer)
      }
    }
  } catch (error) {
    ipcNotice({
      type: 'SET_ERP_AUTH',
      params: false,
    })
  }
}

globalTimer = setInterval(() => {
  loopGetStorageTask()
}, 500)

// 向主线程发送消息
async function ipcNotice({ type, params }) {
  ipcRenderer.send('inject-message', { type: type, params: params })
}
