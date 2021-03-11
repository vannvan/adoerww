const axios = require('axios')
const { ipcRenderer } = require('electron')
const localforage = require('localforage')
const Cookies = require('js-cookie')
const $ = require('jquery')

const Site = {
  shopeeSeller: {
    my: { host: 'seller.shopee.com.my', lang: 'en' },
    br: { host: 'seller.shopee.com.br', lang: 'br' },
    id: { host: 'seller.shopee.co.id', lang: 'id' },
    th: { host: 'seller.shopee.co.th', lang: 'th' },
    sg: { host: 'seller.shopee.sg', lang: 'sg' },
    ph: { host: 'seller.shopee.ph', lang: 'ph' },
    vn: { host: 'seller.shopee.vn', lang: 'vn' },
    tw: { host: 'seller.shopee.tw', lang: 'tw' },
  },
  siteOption: [
    {
      name: '马来西亚',
      key: 'my',
      storeList: [
        { name: 'aimiao', storeId: '341561079' },
        { name: 'mailing', storeId: '338011596' },
      ],
    },
    { name: '菲律宾', key: 'ph', key: 'ph' },
    { name: '泰国', key: 'th' },
    { name: '新加坡', key: 'sg' },
    { name: '台湾', key: 'tw' },
    { name: '巴西', key: 'br' },
    { name: '印度尼西亚', key: 'id' },
    { name: '越南', key: 'vn' },
  ],
}
var globalTimer = null //
var currentTransNodeIndex = null //当前翻译节点索引

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
headerFixed.className = 'emalacca-client-menu-fixed'

let addStoreNode = `
    <div class="emalacca-client-menu-top">
        <span class="menu-top-button">添加店铺</span>
    </div>
`
headerFixed.innerHTML += addStoreNode

Site.siteOption.map((el) => {
  let storeListEl = ''
  if (el.storeList && el.storeList.length > 0) {
    el.storeList.map((subEl) => {
      storeListEl += `<li class="store-item">${subEl.name}</li>`
    })
  }
  headerFixed.innerHTML += `<div class="nav-item" data-key="${el.key}">
    <label class="site-name" for="site-${el.key}">${el.name}</label>
    <input type="checkbox" id="site-${el.key}" />
    <div class="store-list-wrap">
    ${storeListEl}
    </div>
  </div>`
  $('.site-name').click(function () {
    //获取当前菜单旁边input的check状态
    $(this).next("input[type='checkbox']").is(':checked')
  })
})

document.body.prepend(headerFixed)

// document
//   .querySelector('.emalacca-client-menu-fixed')
//   .addEventListener('click', (e) => {
//     let key = e.target.getAttribute('data-key')
//     let storeId = e.target.getAttribute('data-store')
//     console.log(storeId)
//     Cookies.set('SPC_U', storeId)
//     Cookies.set('SPC_CDS', storeId)
//     // Cookies.set('SPC_EC', '')
//     ipcNotice({
//       type: 'CHANGE_STORE',
//       params: { host: Site.shopeeSeller[key].host, storeId: storeId, key: key },
//     })
//   })

if (/webchat\/conversations/.test(location.pathname)) {
  setTimeout(() => {
    // 高亮当前店铺

    let userInfo = sessionStorage.getItem('userInfo')
      ? JSON.parse(sessionStorage.getItem('userInfo'))
      : null
    if (userInfo) {
      ;[...document.querySelector('.emalacca-client-menu-fixed').children].map(
        (el) => {
          if (el.dataset.store == userInfo.storeId) {
            el.style.background = '#ffc069'
          }
        }
      )
    }
  }, 200)
}

// console.log(document.cookie)

//如果在登录页面，把自动点击取消按钮
if (/account\/signin/.test(location.href)) {
  //   console.log('在登录页面')
  //   document.querySelector('body').style.overflow = 'hidden'
  //   let userInfo = sessionStorage.getItem('userInfo')
  //     ? JSON.parse(sessionStorage.getItem('userInfo'))
  //     : null
  //   if (userInfo) {
  //     document.querySelector(
  //       'body'
  //     ).innerHTML += `<div class="emalacca-client-mask">
  //           <div class="shoppe-loading-wrap">
  //               <div class="inside"></div>
  //               <div class="back"></div>
  //           </div>
  //         </div>`
  //     globalTimer = setInterval(() => {
  //       //   autoLogin()
  //     }, 200)
  //   }
}

function autoLogin() {
  let userInfo = sessionStorage.getItem('userInfo')
    ? JSON.parse(sessionStorage.getItem('userInfo'))
    : null
  if (userInfo) {
    if (document.querySelector('.shopee-modal__footer-buttons')) {
      document
        .querySelector('.shopee-modal__footer-buttons')
        .children[0].click()
    }

    if (document.querySelector('form')) {
      window.inputValue(document.querySelectorAll('input')[0], userInfo.name)
      window.inputValue(
        document.querySelectorAll('input')[1],
        userInfo.password
      )

      document.querySelectorAll('.shopee-button--primary')[0].click()
      clearInterval(globalTimer)
    }
  } else {
    ipcNotice('ERROR_DIALOG', { content: '用户授权信息同步失败，请重新登录' })
  }
}

window.onmousewheel = function (e) {
  //   e = e || window.event
  let messageEl = [...document.querySelectorAll('pre')]
  messageEl.map((el, index) => {
    if (!el.getAttribute('flag')) {
      el.innerHTML += `<button  class="emalacca-client-trans-button-mini">译</button>`
      el.setAttribute('flag', true)
      el.setAttribute('data-node-id', index + 1)
    }
    el.addEventListener('click', function (e) {
      if (e.target.nodeName == 'BUTTON') {
        let text = e.target.parentNode.parentNode.innerText.replace('译', '')
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
      // Cookies.set('SPC_U', storeId)
      //   Cookies.set('ahah', params.cookies)
      // Cookies.set('SPC_CDS', storeId)
      // 把主线程对应的当前用户信息存在storage
      sessionStorage.setItem('userInfo', JSON.stringify(params.accountInfo))
      break
    case 'TRANSLATION_RESULT': // 翻译结果替换
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
      break
    case 'CHECKED_SOMEBODY': //选中某人
      appendTranslateButton(params)
      break
    case 'CLEAR_TEXTAREA': //清除文本框
      document.querySelector('textarea').value = ''
      break
    default:
      break
  }
})

// 退出接口
function handleLogout() {
  axios
    .get(location.origin + '/api/v1/logout/')
    .then((res) => {
      console.log(res, '退出成功')
    })
    .catch((err) => {
      console.log(err)
    })
}

// 添加翻译按钮
function appendTranslateButton(params) {
  let { buyer_id } = params
  if (document.querySelector('.emalacca-client-translate-msg-botto')) {
    return false
  }
  setTimeout(() => {
    document.querySelector(
      'textarea'
    ).parentNode.innerHTML += `<div class="emalacca-client-translate-msg-bottom">
                    <button class="emalacca-client-translate-button">翻译并发送</button>
                </div>
               `
    let translationButton = document.querySelector(
      '.emalacca-client-translate-button'
    )
    translationButton.addEventListener('click', function () {
      //翻译
      handleTranslation(buyer_id)
    })
    document.onkeydown = function (event) {
      //回车事件
      if (event.keyCode == 13) {
        handleTranslation(buyer_id)
      }
    }
  }, 1000)
}

// 翻译操作
function handleTranslation(buyer_id) {
  console.log('翻译')
  let currentPageCountry = document
    .querySelector('html')
    .className.toLocaleLowerCase() //当前页面获取到的国家
  localforage
    .getItem('session')
    .then(function (value) {
      // 当离线仓库中的值被载入时，此处代码运行
      let { token } = value
      console.log(token)
      ipcNotice({
        type: 'SEND_MESSAGE',
        params: {
          host: location.host,
          token: token,
          messageText: document.querySelector('textarea').value,
          to_id: buyer_id,
          targetLang: Site.shopeeSeller[currentPageCountry].lang,
        },
      })
    })
    .catch(function (err) {
      // 当出错时，此处代码运行
      console.log(err)
    })
}

// 向主线程发送消息
function ipcNotice({ type, params }) {
  ipcRenderer.send('inject-message', { type: type, params: params })
}
