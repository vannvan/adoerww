const { ipcRenderer } = require('electron')
const localforage = require('localforage')
const $ = require('jquery')

// 将链接中携带的店铺信息放进storage
if (location.search) {
  let query = {}
  window.location.search.replace(
    /([^?&=]+)=([^&]+)/g,
    (_, k, v) => (query[k] = v)
  )
  let storeInfo = { storeId: query.storeId, currentSite: query.site }
  sessionStorage.setItem('storeInfo', JSON.stringify(storeInfo))
  //未读消息
  let unReadMessage = sessionStorage.getItem('unReadMessage')
    ? JSON.parse(sessionStorage.getItem('unReadMessage'))
    : null
  if (unReadMessage) {
    addNewUnReadMessageForStore(unReadMessage)
  }
}

function addCssByLink(url) {
  var doc = document
  var link = doc.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('type', 'text/css')
  link.setAttribute('href', url)
  var heads = doc.getElementsByTagName('head')
  if (heads.length) heads[0].appendChild(link)
  else doc.documentElement.appendChild(link)
}
//加载阿里图标
addCssByLink('//at.alicdn.com/t/font_1833787_5je7dr8w03.css')
const Site = {
  shopeeSeller: {
    my: { host: 'seller.my.shopee.cn', lang: 'en' },
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
    {
      name: '菲律宾',
      key: 'ph',
      storeList: [{ name: 'feilvb', storeId: '128728821' }],
    },
    { name: '泰国', key: 'th' },
    { name: '新加坡', key: 'sg' },
    { name: '台湾', key: 'tw' },
    { name: '巴西', key: 'br' },
    { name: '印度尼西亚', key: 'id' },
    { name: '越南', key: 'vn' },
  ],
}
//消息通知
const MessageNotify = document.createElement('audio')
MessageNotify.src =
  'https://downsc.chinaz.net/Files/DownLoad/sound1/202012/13724.mp3'

var currentTransNodeIndex = null //当前翻译节点索引
var currentStoreId = null
var currentSite = null

$(function () {
  ReceiveMasterMessage()
  const leftMenuWrap = $(
    `<div class="emalacca-client-menu-fixed">
        <div class="emalacca-client-menu-top">
            <span class="menu-top-button add-store">添加店铺</span>
        </div>
        <div class="emalacca-client-menu-list"></div>
        <div class="head-img">
            <img src="https://s3.ax1x.com/2021/03/12/6UDVqs.png" class="emalacca-head-img"/>
        <div class="emalacca-logout">退出登录</div>
    </div>
    <div class="emalacca-store-operation">
        <span>卖家中心</span>
        <span>解绑商店</span>
        <span>修改别名</span>
    </div>`
  )
  $('body').append(leftMenuWrap)
  Site.siteOption.map(el => {
    let storeInfo = sessionStorage.getItem('storeInfo')
    if (storeInfo) {
      currentStoreId = JSON.parse(storeInfo).storeId
      currentSite = JSON.parse(storeInfo).currentSite
    }
    let storeListEl = ''
    if (el.storeList && el.storeList.length > 0) {
      el.storeList.map(subEl => {
        let background = currentStoreId == subEl.storeId ? '#FF720D' : '#fff'
        let color = currentStoreId == subEl.storeId ? '#fff' : '#000'
        let highlightClass = currentStoreId == subEl.storeId ? 'active' : ''
        storeListEl += `<li class="store-item ${highlightClass}"  style="background:${background};color:${color}">
          <span data-store="${subEl.storeId}" data-key="${el.key}"> ${subEl.name}</span>
          <span class="icon em-iconfont em-icon-elipsis-v" data-store="${subEl.storeId}"></span>
          <span class="new-message-tip" data-store="${subEl.storeId}"></span>
        </li>`
      })
    }
    let checkBox =
      currentSite == el.key
        ? `<input type="checkbox" checked id="site-${el.key}"/>`
        : `<input type="checkbox" id="site-${el.key}"/>`
    $('.emalacca-client-menu-list').append(`<div class="nav-item" data-key="${
      el.key
    }">
      <label class="site-name ${
        currentSite == el.key ? 'show-list' : ''
      }" for="site-${el.key}">
          <i class="icon em-iconfont em-icon-right"></i>
          <span> ${el.name}</span>
          </label>
          ${checkBox}
          <div class="store-list-wrap" >
              ${storeListEl}
          </div>
      </div>`)
  })

  // 菜单折叠
  $('label').click(function () {
    if (!$(this).hasClass('show-list')) {
      $(this).addClass('show-list')
    } else {
      $(this).removeClass('show-list')
    }
  })

  //店铺操作
  $('.em-icon-elipsis-v').click(function () {
    console.log('店铺操作')
    let $storeOperation = $('.emalacca-store-operation')
    let storeId = $storeOperation.attr('data-store')
    if ($(this).attr('data-store') == storeId) {
      $storeOperation.hide()
      $storeOperation.attr('data-store', '')
    } else {
      $storeOperation.attr('data-store', $(this).attr('data-store'))
      let offset = $(this).offset()
      $storeOperation
        .css({
          left: offset.left + 52,
          top: offset.top,
        })
        .show()
    }
  })

  //
  function handleClick(evt) {
    if (!evt.target.closest('.em-icon-elipsis-v')) {
      console.log('在下拉菜单区域外点击')
      let $storeOperation = $('.emalacca-store-operation')
      $storeOperation.hide()
      $storeOperation.attr('data-store', '')
    }
  }
  // 菜单点击
  $('.emalacca-client-menu-fixed').click(function (e) {
    let key = e.target.getAttribute('data-key')
    if (key) {
      let storeId = e.target.getAttribute('data-store')
      // 如果选中的可存下的店铺相同，就不动
      let storeEdInfo = sessionStorage.getItem('storeInfo')
      if (storeEdInfo) {
        currentStoreId = JSON.parse(storeEdInfo).storeId
        if (currentStoreId && currentStoreId == storeId) {
          return false
        }
      }
      //切换店铺
      ipcNotice({
        type: 'CHANGE_STORE',
        params: {
          host: Site.shopeeSeller[key].host,
          storeId: storeId,
          key: key,
        },
      })
    }
  })

  // 退出erp操作
  $('.emalacca-logout').click(function () {
    ipcNotice({
      type: 'ERP_LOGOUT',
    })
  })

  //全局点击监听
  window.addEventListener('click', handleClick)
  //添加店铺操作
  $('.add-store').click(function (param) {
    console.log('添加店铺')
    ipcNotice({
      type: 'ADD_STORE',
    })
  })
  //点击头像
  $('.emalacca-head-img').click(function () {
    $('.emalacca-logout').toggle()
  })
})

if (/webchat\/conversations/.test(location.pathname)) {
  setTimeout(() => {
    // 高亮当前店铺
    let userInfo = sessionStorage.getItem('userInfo')
      ? JSON.parse(sessionStorage.getItem('userInfo'))
      : null
    if (userInfo) {
      //
    }
  }, 200)
}

window.onmousewheel = function (e) {
  //   e = e || window.event
  let messageEl = [...document.querySelectorAll('pre')]
  messageEl.map((el, index) => {
    if (!el.getAttribute('flag')) {
      el.innerHTML += `<button class="emalacca-client-trans-button-mini">译</button>`
      el.setAttribute('flag', true)
      el.setAttribute('data-node-id', index + 1)
    }
    el.addEventListener('click', function (e) {
      if (e.target.nodeName == 'BUTTON') {
        let text = e.target.parentNode.parentNode.innerText.replace('译', '')
        console.log('文本', text)
        currentTransNodeIndex = el.getAttribute('data-node-id')
        ipcNotice({
          type: 'TRANS_TEXT',
          params: {
            messageText: text,
            type: 'receive',
            targetLang: 'zh-CN',
          },
        })
      }
    })
  })
}

//接收主进程的消息
function ReceiveMasterMessage() {
  ipcRenderer.on('mainWindow-message', (e, args) => {
    let { type, params } = args
    console.log(type, params)
    switch (type) {
      case 'TRANSLATION_RESULT': // 翻译结果替换
        let messageEl = [...document.querySelectorAll('pre')]
        messageEl.map(el => {
          console.log(JSON.stringify(params.targetText))
          if (
            currentTransNodeIndex == el.getAttribute('data-node-id') &&
            !el.getAttribute('trans')
          ) {
            el.setAttribute('trans', true)
            el.innerHTML = `${params.targetText.map(el => el[0]).join('')}`
          }
        })
        break
      case 'CHECKED_SOMEBODY': //选中某人
        appendTranslateButton(params)
        break
      case 'CLEAR_TEXTAREA': //清除文本框
        document.querySelector('textarea').value = ''
        break
      case 'NEW_MESSAGE': //新消息提醒
        MessageNotify.play()
        addNewUnReadMessageForStore(params)
        sessionStorage.setItem('unReadMessage', JSON.stringify(params)) //把未读存起来
      case 'REPLACE_TEXTAREA': // 替换待发送的文本
        $('textarea').text(params)
        $('textarea').val(params) //替换textarea文本
      default:
        break
    }
  })
}

//新消息店铺新增未读消息数
async function addNewUnReadMessageForStore(newMessageParams) {
  let storeIds = newMessageParams.map(el => el.storeId) //有新消息的店铺id
  $('.new-message-tip').each(function () {
    if (storeIds.includes($(this).attr('data-store'))) {
      let unReadMessageCount = newMessageParams.find(
        el => el.storeId == $(this).attr('data-store')
      ).unread_message_count
      $(this).parent().find('span:eq(1)').hide() //隐藏操作
      $(this).show().text(unReadMessageCount)
    }
  })
}

// 添加翻译按钮
function appendTranslateButton(params) {
  let { buyer_id } = params
  const langOptions = [
    { lang: 'zh', langName: '中文' },
    { lang: 'EN', currency: 'SGD', langName: '英语' },
    { lang: 'PH', currency: 'PHP', langName: '菲律宾语' },
    { lang: 'MY', currency: 'MYR', langName: '马来语' },
    { lang: 'ID', currency: 'IDR', langName: '印尼语' },
    { lang: 'TH', currency: 'THB', langName: '泰语' },
    { lang: 'VN', currency: 'VND', langName: '越南语' },
    { lang: 'BR', currency: 'BRL', langName: '巴西语' },
  ]
  const checkedLang = 'EN'
  setTimeout(() => {
    // if (!$('.emalacca-client-translate-msg-bottom')) {
    let langOptionsNode = ''
    langOptions.map(el => {
      langOptionsNode += `<li><span class="em-iconfont em-icon-right1" style="visibility:${
        checkedLang == el.lang ? 'inherit' : 'hidden'
      }"></span>${el.langName}</li>`
    })
    // $('textarea')
    //   .parent()
    //   .append(
    document.querySelector(
      'textarea'
    ).parentNode.innerHTML += `<div class="emalacca-client-translate-msg-bottom">
                    <div class="select-lang-options-wrap">
                        <div class="lang-options">
                          ${langOptionsNode}
                        </div>
                        <span class="lang-btn selected-lang">英语<span class="em-iconfont em-icon-13"></span></span>
                    </div>
                    <span class="lang-btn translate-btn">翻译</span>
                    <span class="lang-btn send-btn">发送</span>
                </div>
               `
    //   )
    $('.selected-lang').click(function () {
      $('.lang-options').toggle()
      $('.lang-options').mouseleave(function () {
        $('.lang-options').hide()
      })
    })

    $('.translate-btn').click(function () {
      handleTranslation(buyer_id, checkedLang)
    })

    $('.send-btn').click(function () {
      handleSendMessage(buyer_id)
    })
    $('textarea').keyup(function (event) {
      if (event.shiftKey && event.keyCode == 13) {
        return false
      }
      if (event.keyCode == 13) {
        event.preventDefault()
        handleSendMessage(buyer_id)
      }
    })
    $('textarea').keyup(function (e) {
      $(this).text(e.target.value)
      $(this).val(e.target.value)
    })
  }, 1000)
}

//翻译待发送的文本
async function handleTranslation(buyer_id, targetLang) {
  let currentPageCountry = $('html').attr('class').toLocaleLowerCase() //当前页面获取到的国家
  targetLang = targetLang || currentPageCountry
  ipcNotice({
    type: 'TRANS_TEXT',
    params: {
      type: 'send',
      messageText: $('textarea').val(),
      targetLang: targetLang,
    },
  })
}

//发送消息
async function handleSendMessage(buyer_id) {
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
          messageText: $('textarea').text(),
          to_id: buyer_id,
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
