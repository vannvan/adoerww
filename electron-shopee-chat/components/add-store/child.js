// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { ipcRenderer } = require('electron')
const API = require('../../utils/api.conf')
const log = require('electron-log')

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
  $('#close').click(function (param) {
    console.log('关闭子窗口')
    ipcNotice({
      type: 'CLOSE_CHILD_WINDOW',
    })
  })
  $('#handleAuth').click(function () {
    handleAddStore()
  })
})

// 向主线程发送消息
function ipcNotice({ type, params }) {
  ipcRenderer.send('inject-message', { type: type, params: params })
}

async function handleAddStore(params) {
  API.handleLoginShopee({
    domain: 'https://seller.shopee.com.my/',
    psw: 'Fm123456',
    shopId: '',
    userName: 'aimiao.my',
    vcode: '',
  })
    .then(res => {
      log.info('handleLoginShopee:', res.data)
    })
    .catch(error => {
      log.error('handleLoginShopee:', error)
    })
}
