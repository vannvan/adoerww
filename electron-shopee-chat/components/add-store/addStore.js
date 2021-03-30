const $ = require('jquery')
require('bootstrap')
require('bootstrap/js/dist/util')
require('bootstrap/js/dist/alert')
require('../../utils/api.conf')
require('../../utils/message')
const { ipcRenderer } = require('electron')
const { dialog } = require('electron').remote
require('../../utils/lib')
const log = require('electron-log')
const fs = require('fs')
const siteArr = ['MY', 'PH', 'VN', 'ID', 'SG', 'BR', 'TW', 'TH']

const checkboxTemplate = (id, items) => {
  return $(`
    <div class="custom-control custom-checkbox">
      <input type="checkbox" class="custom-control-input" id="${id}" data-code="${items.countryCode}" value="${items.shopId}">
      <label class="custom-control-label" for="${id}">${items.storeName}</label>
    </div>
  `)
}
// 切换tabs
$('.em-tabs-items').click(function (event) {
  let index = $(this).attr('data-index')
  $('.em-tabs-items.is-em-active').removeClass('is-em-active')
  $(this).addClass('is-em-active')
  $('.em-tabs-content.is-em-content').removeClass('is-em-content')
  $('.em-tabs-content:eq(' + index + ')').addClass('is-em-content')
  $('.em-tabs-footer.is-em-footer').removeClass('is-em-footer')
  $('.em-tabs-footer:eq(' + index + ')').addClass('is-em-footer')
  if (index === '2') {
    $('#erpStoreList').html('')
    // 获取erp店铺列表
    API.getErpStoreList().then(res => {
      let data = res.data || []
      if (Array.isArray(data) && data.length !== 0) {
        data.forEach((item, index) => {
          let domId = 'erpShop_' + index
          $('#erpStoreList').append(checkboxTemplate(domId, item))
        })
      }
    })
  }
})
// input type密码显示隐藏
$('.em-iconfont-password').click(function (event) {
  if ($(this).hasClass('em-icon-jiesuo')) {
    $(this).addClass('em-icon-mima')
    $('#validationPassword').attr('type', 'password')
    $('.em-iconfont-password.em-icon-jiesuo').removeClass('em-icon-jiesuo')
  } else {
    $(this).addClass('em-icon-jiesuo')
    $('#validationPassword').attr('type', 'text')
    $('.em-iconfont-password.em-icon-mima').removeClass('em-icon-mima')
  }
})

// 向主线程发送消息
function ipcNotice({ type, params }) {
  ipcRenderer.send('inject-message', { type: type, params: params })
}

$('.btn-close').click(function () {
  ipcNotice({
    type: 'CLOSE_CHILD_WINDOW',
  })
})

// 添加店铺--授权
$('#handleAuth').click(function () {
  $('.shoppe-loading-wrap').css({
    display: 'block'
  })
  handleAddStore()
})
// 添加店铺--重新发送验证码
$('#sendAuthCode').click(() => {
  $('.shoppe-loading-wrap').css({
    display: 'block'
  })
  handleAddStore()
})
// 批量导入--下载模板
$('.downloadExecle').click(function () {
  downloadExecle()
})
// 批量导入--导入文件
$('#handleImportFile').click(() => {
  $('.shoppe-loading-wrap').css({
    display: 'block'
  })
  handleImportFile()
})
// 云端导入--查看详情
$('#erpEmalaccaStore').click(function () {
  shell.openExternal('https://test-erp.emalacca.com/store/page')
})
// 云端导入--导入店铺
$('#handleImportShops').click(() => {
  $('.shoppe-loading-wrap').css({
    display: 'block'
  })
  handleImportErp()
})

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
            log.info(addResult.data)
            $('.shoppe-loading-wrap').css({ display: 'none' })
            if (addResult.code == 0) {
              ipcNotice({
                type: 'SUCCESS_ADD_STORE',
              })
              $.fn.message({
                type: 'success',
                msg: '操作成功',
              })
              let successToast = document.querySelector('.success-toast')
              successToast.style.display = 'block'
            }
            log.info(
              '======================handleAddStore end======================'
            )
          })
          .catch(error => {
            $('.shoppe-loading-wrap').css({ display: 'none' })
            if (Lib.getError(error).message) {
              ipcNotice({
                type: 'ERROR_DIALOG',
                params: Lib.getError(error).message,
              })
            }
            log.error('handleAddStore error:', Lib.getError(error))
            $.fn.message({
              type: 'error',
              msg: '操作失败, 请稍后重试！',
            })
          })
      } else if (data.rspStatusCode === 470) {
        $('.shoppe-loading-wrap').css({ display: 'none' })
        // 验证码
        let authCode = document.querySelector('.auth-code')
        authCode.style.display = 'flex'
        $.fn.message({
          type: 'warning',
          msg: '请输入验证码',
        })
        if (!timeInterval) {
          handleAuthCode()
        }
      } else if (data.rspStatusCode === 482) {
        $('.shoppe-loading-wrap').css({ display: 'none' })
        // 验证码
        $.fn.message({
          type: 'warning',
          msg: '验证码错误, 请重新输入',
        })
      } else if (data.rspStatusCode === 491) {
        $('.shoppe-loading-wrap').css({ display: 'none' })
        // 账号或密码
        $.fn.message({
          type: 'warning',
          msg: '账号或密码错误, 请重新输入',
        })
      } else if (data.rspMsg && data.rspStatusCode !== 200) {
        $('.shoppe-loading-wrap').css({ display: 'none' })
        // 账号或密码
        $.fn.message({
          type: 'warning',
          msg: data.rspMsg,
        })
      } else {
        $('.shoppe-loading-wrap').css({ display: 'none' })
      }
    })
    .catch(error => {
      $('.shoppe-loading-wrap').css({ display: 'none' })
      log.error('handleLoginShopee error:', Lib.getError(error))
      $.fn.message({
        type: 'error',
        msg: '操作失败, 请稍后重试！',
      })
    })
}

async function downloadExecle() {
  API.downloadExecle()
    .then(res => {
      downloadUrl(res.data, '模板')
    })
    .catch(error => {
      log.error('downloadExecle:', error)
      $.fn.message({
        type: 'error',
        msg: '操作失败, 请稍后重试！',
      })
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
          $('.shoppe-loading-wrap').css({ display: 'none' })
          if (res.data) {
            $.fn.message({
              type: 'success',
              msg: '操作成功',
            })
          }
        })
        .catch(error => {
          log.error('downloadExecle:', error)
          $('.shoppe-loading-wrap').css({ display: 'none' })
          $.fn.message({
            type: 'error',
            msg: '操作失败, 请稍后重试！',
          })
        })
      }
    })
    .catch(err => {
      $('.shoppe-loading-wrap').css({ display: 'none' })
      log.error(err)
      $.fn.message({
        type: 'error',
        msg: '操作失败, 请稍后重试！',
      })
    })
}

function handleImportErp() {
  let tempArray = new Array()
  $('.custom-control-input:checkbox:checked').each(function (i) {
    tempArray.push({ shopId: $(this).val() })
  })
  API.importErpStore({ stores: tempArray })
    .then(res => {
      $('.shoppe-loading-wrap').css({ display: 'none' })
      if (res.data) {
        $.fn.message({
          type: 'success',
          msg: '操作成功',
        })
      }
    })
    .catch(err => {
      $('.shoppe-loading-wrap').css({ display: 'none' })
      log.error(err)
      $.fn.message({
        type: 'error',
        msg: '操作失败, 请稍后重试！',
      })
    })
}
let athCodeTime = 59
let timeInterval = null
function handleAuthCode() {
  timeInterval = setInterval(function () {
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
  timeInterval = setInterval(function () {
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
