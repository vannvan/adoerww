// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { ipcRenderer, shell, ipcMain } = require('electron')
const { dialog } = require('electron').remote
const Lib = require('../../utils/lib')

const API = require('../../utils/api.conf')
const log = require('electron-log')
const fs = require('fs')

const siteArr = ['MY', 'PH', 'VN', 'ID', 'SG', 'BR', 'TW', 'TH']

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }

  $('#close').click(function (param) {
    ipcNotice({
      type: 'CLOSE_CHILD_WINDOW',
    })
  })
  // 添加店铺--授权
  $('#handleAuth').click(function () {
    handleAddStore()
  })
  // 添加店铺--重新发送验证码
  $('#sendAuthCode').click(() => {
    handleAddStore()
  })
  // 批量导入--下载模板
  $('.downloadExecle').click(function () {
    downloadExecle()
  })
  // 批量导入--导入文件
  $('#handleImportFile').click(() => {
    handleImportFile()
  })
  // 云端导入--查看详情
  $('#erpEmalaccaStore').click(function () {
    shell.openExternal('https://test-erp.emalacca.com/store/page')
  })
  // 云端导入--导入店铺
  $('#handleImportShops').click(() => {
    handleImportErp()
  })
})

// 向主线程发送消息
function ipcNotice({ type, params }) {
  ipcRenderer.send('inject-message', { type: type, params: params })
}

function handleAddStore() {
  let shopeeDomain = document.getElementById('shopeeDomain')
  let accountNumber = document.getElementById('accountNumber').value.trim()
  let password = document.getElementById('validationPassword').value.trim()
  let errorAlert = document.getElementById('errorAlert')
  let errorText = document.getElementById('errorText')
  errorAlert.className = 'alert alert-dismissible fade show'
  let authCodeFeedback = document.getElementById('authCodeFeedback')
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
    vcode: authCodeFeedback.value || '',
  }
  log.info('======================handleAddStore start======================')
  API.handleLoginShopee(params)
    .then(res => {
      let data = res.data
      if (data.rspStatusCode === 200) {
        let countryCode = params.domain
          .match(/seller\.(\S*)\.shopee/)[1]
          .toUpperCase()
        let addData = {
          countryCode: siteArr.includes(countryCode) ? countryCode : 'TW',
          storeLoginPsw: password,
          storeLoginAccount: accountNumber,
        }
        API.handleAddStore(addData)
          .then(addResult => {
            console.log(addResult.data)
            if (addResult.code == 0) {
              ipcNotice({
                type: 'SUCCESS_ADD_STORE',
              })
              let successToast = document.querySelector('.success-toast')
              successToast.style.display = 'block'
            }
            log.info(
              '======================handleAddStore end======================'
            )
          })
          .catch(error => {
            if (Lib.getError(error).message) {
              ipcNotice({
                type: 'ERROR_DIALOG',
                params: Lib.getError(error).message,
              })
            }
            log.error('handleAddStore error:', Lib.getError(error))
          })
      } else if (data.rspStatusCode === 470) {
        // 验证码
        let authCode = document.querySelector('.auth-code')
        authCode.style.display = 'flex'
        handleAuthCode()
      }
    })
    .catch(error => {
      log.error('handleLoginShopee error:', Lib.getError(error))
    })
}

async function downloadExecle() {
  API.downloadExecle()
    .then(res => {
      downloadUrl(res.data, '模板')
    })
    .catch(error => {
      log.error('downloadExecle:', error)
    })
}

const downloadUrl = function (res, name) {
  const blob = new Blob([res], { type: 'application/vnd.ms-excel' }) // 构造一个blob对象来处理数据
  const fileName = name + '.xlsx' // 导出文件名
  const elink = document.createElement('a') // 创建a标签
  elink.download = fileName // a标签添加属性
  elink.style.display = 'none'
  elink.href = URL.createObjectURL(blob)
  document.body.appendChild(elink)
  elink.click() // 执行下载
  URL.revokeObjectURL(elink.href) // 释放URL 对象
  document.body.removeChild(elink) // 释放标签
}

function handleImportFile() {
  dialog
    .showOpenDialog({
      title: '请选择导入的文件',
      buttonLabel: '导入文件',
      properties: ['openFile'],
      securityScopedBookmarks: true,
      filters: [{ name: 'excel', extensions: ['xls', 'xlsx'] }],
    })
    .then(result => {
      // 点击导入文件
      if (!result.canceled) {
        let firstFile = result.filePaths[0]
        let fileStream = fs.readFileSync(firstFile)
        let file = new File([fileStream], firstFile)
        let formData = new FormData()
        formData.append('file', file)
        API.importStoreFile(formData).then(res => {
          if (res.data) {
            let successToast = document.querySelector('.success-toast')
            successToast.style.display = 'block'
            setTimeout(function () {
              successToast.style.display = 'none'
            }, 2000)
          }
        })
      }
    })
    .catch(err => {
      log.error(err)
    })
}

function handleImportErp() {
  let tempArray = new Array()
  $('.custom-control-input:checkbox:checked').each(function (i) {
    tempArray.push({ shopId: $(this).val() })
  })
  API.importErpStore({ stores: tempArray }).then(res => {
    if (res.data) {
      let successToast = document.querySelector('.success-toast')
      successToast.style.display = 'block'
      setTimeout(function () {
        successToast.style.display = 'none'
      }, 2000)
    }
  })
}
let athCodeTime = 59
let timeInterval = null
function handleAuthCode() {
  timeInterval = setInterval(function () {
    console.log(athCodeTime, 'time')
    if (athCodeTime == 0) {
      $('#sendAuthCode').html('重新发送')
      $('#sendAuthCode').removeAttr('disabled')
      athCodeTime = 59
      clearInterval(timeInterval)
    } else {
      $('#sendAuthCode').attr('disabled', 'true')
      $('#sendAuthCode').html('重新发送(' + athCodeTime + ')')
      athCodeTime--
    }
  }, 1000)
}
