console.log('this is inject.js')
const axios = require('axios')
// alert(JSON.stringify(document))
const { ipcRenderer } = require('electron')

var globalTimer = null //
var currentTransNodeIndex = null //当前翻译节点索引

function getCookie(cname) {
  var name = cname + '='
  var decodedCookie = decodeURIComponent(document.cookie)
  var ca = decodedCookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}
function clearAllCookie() {
  var date = new Date()
  date.setTime(date.getTime() - 10000)
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
  console.log('需要删除的cookie名字：' + keys)
  if (keys) {
    for (var i = keys.length; i--; ) document.cookie = keys[i] + '=0; max-age=0'
  }
}

const shopeeHosts = {
  my: 'seller.shopee.com.my',
  br: 'seller.shopee.com.br',
  id: 'seller.shopee.co.id',
  th: 'seller.shopee.co.th',
  sg: 'seller.shopee.sg',
  ph: 'seller.shopee.ph',
  vn: 'seller.shopee.vn',
  tw: 'seller.shopee.tw',
}
const siteOption = [
  { name: '马来aimiao.my', key: 'my', storeId: 341561079 },
  { name: '马来mailing.my', key: 'my', storeId: 338011596 },
  { name: '菲律宾', key: 'ph' },
  { name: '泰国', key: 'th' },
  { name: '新加坡', key: 'sg' },
  { name: '台湾', key: 'tw' },
  { name: '巴西', key: 'br' },
  { name: '印度尼西亚', key: 'id' },
]

const account = {
  341561079: {
    name: 'aimiao.my',
    password: 'Fm123456',
  },
  338011596: {
    name: 'mailing.my',
    password: 'maiwang123456',
  },
}

window.inputValue = function (dom, st) {
  var evt = new InputEvent('input', {
    inputType: 'insertText',
    data: st,
    dataTransfer: null,
    isComposing: false,
  })
  dom.value = st
  dom.dispatchEvent(evt)
}

let headerFixed = document.createElement('div')
headerFixed.className = 'emalacca-client-header-fixed'

siteOption.map((el) => {
  headerFixed.innerHTML += `<div class="nav-item" data-key="${el.key}" data-store="${el.storeId}">${el.name}</div>`
})

document.body.prepend(headerFixed)

document
  .querySelector('.emalacca-client-header-fixed')
  .addEventListener('click', (e) => {
    let key = e.target.getAttribute('data-key')
    let storeId = e.target.getAttribute('data-store')
    logout()
    ipcNotice({
      type: 'LOAD_PAGE',
      params: { host: shopeeHosts[key], storeId: storeId },
    })
  })

setTimeout(() => {
  ipcNotice({
    type: 'GET_COOKIES',
    params: { storeId: getCookie('SPC_U') },
  })
}, 1000)

// console.log(document.cookie)

//如果在登录页面，把自动点击取消按钮
if (/account\/signin/.test(location.href)) {
  console.log('在登录页面')
  document.querySelector(
    'body'
  ).innerHTML += `<div class="emalacca-client-mask">
    <div class="shoppe-loading-wrap">
        <div class="inside"></div>
        <div class="back"></div>
    </div> 
  </div>`
  document.querySelector('body').style.overflow = 'hidden'
  globalTimer = setInterval(() => {
    autoLogin()
  }, 200)
}

// 如果在聊天页面
if (/webchat\/conversations/.test(location.href)) {
  setTimeout(() => {
    document.querySelector(
      'textarea'
    ).parentNode.innerHTML += `<div class="emalacca-client-chat-wrap">
    <div class="emalacca-client-msg-wrap" contenteditable="true"></div>
    <div class="emalacca-client-translate-msg-bottom">
        <span class="emalacca-client-translate-tip">按 Shift + Enter 换行</span><i class="_3kEAcT1Mk5 _22jqVmopYC emalacca-client-clone-shopee-button" style="float: none; vertical-align: middle; cursor: pointer;"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="chat-icon"><path d="M4 14.497v3.724L18.409 12 4 5.779v3.718l10 2.5-10 2.5zM2.698 3.038l18.63 8.044a1 1 0 010 1.836l-18.63 8.044a.5.5 0 01-.698-.46V3.498a.5.5 0 01.698-.459z"></path></svg></i>
        <button class="emalacca-client-translate-button" style="margin-left: 12px;">翻译并发送</button>
      </div>
    </div>`
    document
      .querySelector('.emalacca-client-translate-button')
      .addEventListener('click', function () {
        let data = {
          request_id: '9599694b-ccd1-46c8-b82c-441997b3c412',
          to_id: 338011596,
          type: 'text',
          content: { text: '你好' },
          chat_send_option: {
            force_send_cancel_order_warning: false,
            comply_cancel_order_warning: false,
          },
        }
        let url =
          'https://seller.shopee.com.my/webchat/api/v1.2/messages?_uid=0-341561079&csrf_token=S2ZxB3s6Eeu87fBj%2Bd9zsQ%3D%3D'
        axios({
          method: 'post',
          url: url,
          data: data,
        }).then((res) => {
          console.log(res)
        })
      })
  }, 1000)
}

function autoLogin() {
  if (document.querySelector('.shopee-modal__footer-buttons')) {
    document.querySelector('.shopee-modal__footer-buttons').children[0].click()
  }

  let cookiesStoreId = getCookie('shopee-store-id')
  if (document.querySelector('form')) {
    window.inputValue(
      document.querySelectorAll('input')[0],
      account[cookiesStoreId].name
    )
    window.inputValue(
      document.querySelectorAll('input')[1],
      account[cookiesStoreId].password
    )

    document.querySelectorAll('.shopee-button--primary')[0].click()
    clearInterval(globalTimer)
  }
}

// 向主线程发送消息
function ipcNotice({ type, params }) {
  //   return new Promise((resolve,reject) => {
  ipcRenderer.send('inject-message', { type: type, params: params })
  //   })
}

window.onmousewheel = function (e) {
  //   e = e || window.event
  let messageEl = [...document.querySelectorAll('pre')]
  messageEl.map((el, index) => {
    if (!el.getAttribute('flag')) {
      el.innerHTML += `<p><button>翻译</button></p>`
      el.setAttribute('flag', true)
      el.setAttribute('data-node-id', index + 1)
    }
    el.addEventListener('click', function (e) {
      if (e.target.nodeName == 'BUTTON') {
        let text = e.target.parentNode.parentNode.innerText.replace('翻译', '')
        console.log('文本', text)
        currentTransNodeIndex = el.getAttribute('data-node-id')
        ipcNotice({
          type: 'TRANSLATION',
          params: {
            sourceText: text,
          },
        })
      }
    })
  })
}

// 接收主进程的消息
ipcRenderer.on('mainWindow-message', (e, args) => {
  let { type, params } = args
  console.log(type, params)
  switch (type) {
    case 'SET_PAGE_COOKIES':
      document.cookie = 'shopee-store-id=' + params.storeId
      document.cookie = `SPC_SC_UD=${params.storeId};domain=shopee.com.my;expires=2021-03-08T10:58:22.158Z`
      logout()
      ipcNotice({
        type: 'SET_COOKIES',
        params: { key: getCookie('SPC_U'), cookies: document.cookie },
      })
      break
    case 'TRANSLATION_RESULT':
      let messageEl = [...document.querySelectorAll('pre')]
      messageEl.map((el) => {
        console.log(JSON.stringify(params.targetText))
        if (
          currentTransNodeIndex == el.getAttribute('data-node-id') &&
          !el.getAttribute('trans')
        ) {
          el.setAttribute('trans', true)
          el.innerHTML = `${params.targetText.map((el) => el[0]).join('')}`
        }
      })
    default:
      break
  }
})

function logout() {
  axios
    .get('https://seller.shopee.com.my/api/v1/logout/')
    .then((res) => {
      console.log(res, '退出成功')
    })
    .catch((err) => {
      console.log(err)
    })
}
