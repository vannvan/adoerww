console.log('erp inject')
const { ipcRenderer } = require('electron')

var globalTimer = null

async function loopGetStorageTask() {
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

setInterval(() => {
  loopGetStorageTask()
}, 1000)

// 向主线程发送消息
async function ipcNotice({ type, params }) {
  ipcRenderer.send('inject-message', { type: type, params: params })
}
