// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { ipcRenderer, shell } = require('electron')
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
  // 获取erp店铺列表
  API.getErpStoreList().then(res => {
    console.log(res, 'res')
  })

  $('#close').click(function (param) {
    ipcNotice({
      type: 'CLOSE_CHILD_WINDOW',
    })
  })
  $('#handleAuth').click(function () {
    handleAddStore()
  })
  $('.downloadExecle').click(function () {
    // downloadExecle()
  })
  $('#erpEmalaccaStore').click(function () {
    shell.openExternal('https://test-erp.emalacca.com/store/page')
  })

  $('#handleImportFile').click(() => {
    // ipcNotice({
    //   type: 'HANDLE_IMPORT_FILE',
    // })
    /* FormData 是表单数据类 */
  })
})

// 向主线程发送消息
function ipcNotice({ type, params }) {
  ipcRenderer.send('inject-message', { type: type, params: params })
}

async function handleAddStore() {
  let shopeeDomain = document.getElementById('shopeeDomain')
  let accountNumber = document.getElementById('accountNumber').value.trim()
  let password = document.getElementById('validationPassword').value.trim()
  let errorAlert = document.getElementById('errorAlert')
  let errorText = document.getElementById('errorText')
  errorAlert.className = 'alert alert-dismissible fade show'
  // let authCodeFeedback = document.getElementById("authaCodeFeedback")
  if (accountNumber === '' || password === '') {
    errorAlert.style.display = 'block'
    errorAlert.className += ' alert-danger'
    errorText.textContent = '账号或者密码不能为空'
    return
  } else {
    errorAlert.style.display = 'none'
    errorText.textContent = ''
  }
  let params = {
    domain: shopeeDomain.options[shopeeDomain.selectedIndex].value,
    psw: password,
    shopId: '',
    userName: accountNumber,
    // vcode: authCodeFeedback.value,
  }
  API.handleLoginShopee(params)
    .then(res => {
      let data = res.data
      if (data.rspStatusCode === 200) {
        let successToast = document.querySelector('.success-toast')
        successToast.style.display = 'block'
        ipcNotice({
          type: 'SUCCESS_ADD_STORE',
        })
      }
    })
    .catch(error => {
      log.error('handleLoginShopee error:', error)
    })
}

// async function downloadExecle() {
//   API.downloadExecle()
//     .then(res => {
//       downloadUrl(res.data, '模板')
//     })
//     .catch(error => {
//       log.error('downloadExecle:', error)
//     })
// }

// const downloadUrl = function (res, name) {
//   const blob = new Blob([res], { type: 'application/vnd.ms-excel' }) // 构造一个blob对象来处理数据
//   const fileName = name + '.xlsx' // 导出文件名
//   const elink = document.createElement('a') // 创建a标签
//   elink.download = fileName // a标签添加属性
//   elink.style.display = 'none'
//   elink.href = URL.createObjectURL(blob)
//   document.body.appendChild(elink)
//   elink.click() // 执行下载
//   URL.revokeObjectURL(elink.href) // 释放URL 对象
//   document.body.removeChild(elink) // 释放标签
// }
