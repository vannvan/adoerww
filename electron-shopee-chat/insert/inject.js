const { ipcRenderer } = require('electron')
const localforage = require('localforage')
const $ = require('jquery')
const { default: axios } = require('axios')

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

function storageGet(key) {
  return sessionStorage.getItem(key)
    ? JSON.parse(sessionStorage.getItem(key))
    : null
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
        <span action-type="seller-center">卖家中心</span>
        <span action-type="remove-bind">解绑商店</span>
        <span action-type="modify-alias">修改别名</span>
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
          left: offset.left + 46,
          top: offset.top,
        })
        .show()
        .mouseleave(function () {
          $storeOperation.hide()
          $storeOperation.attr('data-store', '')
        })
        .click(function (e) {
          //   console.log(e.target.getAttribute('action-type'))
          let actionType = e.target.getAttribute('action-type')
          dispatchStoreAction(actionType, storeId)
        })
    }
  })

  // 菜单点击
  $('.emalacca-client-menu-fixed').click(function (e) {
    $('textarea').val('')
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
  $('.emalacca-logout')
    .click(function () {
      ipcNotice({
        type: 'ERP_LOGOUT',
      })
    })
    .mouseleave(function () {
      $(this).hide()
    })

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
  ipcRenderer.on('mainWindow-message', async (e, args) => {
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
        await addNewUnReadMessageForStore(params)
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
    { lang: 'zh-TW', langName: '中文繁体' },
    { lang: 'EN', currency: 'SGD', langName: '英语' },
    { lang: 'tl', currency: 'PHP', langName: '菲律宾语' },
    { lang: 'ms', currency: 'MYR', langName: '马来语' },
    { lang: 'ID', currency: 'IDR', langName: '印尼语' },
    { lang: 'TH', currency: 'THB', langName: '泰语' },
    { lang: 'VI', currency: 'VND', langName: '越南语' },
    { lang: 'pt', currency: 'BRL', langName: '葡萄牙语' },
  ]

  var checkedLang = storageGet('currentLang') || {
    lang: 'EN',
    langName: '英语',
  }
  setTimeout(() => {
    let langOptionsNode = ''
    langOptions.map((el, index) => {
      langOptionsNode += `<li data-lang="${el.lang}" data-langName="${
        el.langName
      }" data-index="${index}">
      <span class="em-iconfont em-icon-right1" style="visibility:${
        checkedLang.lang == el.lang ? 'inherit' : 'hidden'
      }"></span>${el.langName}</li>`
    })
    //这种方式插入节点可以使原本的回车事件失效
    document.querySelector(
      'textarea'
    ).parentNode.innerHTML += `<div class="emalacca-client-translate-msg-bottom">
                    <div class="select-lang-options-wrap">
                        <div class="lang-options">
                          ${langOptionsNode}
                        </div>
                        <div class="lang-btn selected-lang">
                            <span>${checkedLang.langName}</span>
                            <span class="em-iconfont em-icon-13"></span>
                        </div>
                    </div>
                    <span class="lang-btn translate-btn">翻译</span>
                    <span class="lang-btn send-btn">发送</span>
                </div>
               `

    $('.selected-lang').click(function () {
      $('.lang-options').toggle()
      $('.lang-options').mouseleave(function () {
        $('.lang-options').hide()
      })
    })

    //选择语言
    $('.lang-options').click(function (e) {
      let lang = e.target.getAttribute('data-lang')
      let langName = e.target.getAttribute('data-langName')
      let index = e.target.getAttribute('data-index')
      checkedLang.lang = lang
      checkedLang.langName = langName
      sessionStorage.setItem('currentLang', JSON.stringify(checkedLang))
      $('.selected-lang span:eq(0)').text(langName)
      $('.lang-options li span').css('visibility', 'hidden')
      $(`.lang-options li span:eq(${index})`).css('visibility', 'inherit')
      $(this).hide()
    })
    //翻译按钮
    $('.translate-btn').click(function () {
      handleTranslation(checkedLang.lang)
    })
    //发送按钮
    $('.send-btn').click(function () {
      dispatchSendMessage(buyer_id)
    })

    //文本框回车
    $('textarea').keyup(function (event) {
      if (event.shiftKey && event.keyCode == 13) {
        return false
      }
      if (event.keyCode == 13) {
        event.preventDefault()
        event.stopPropagation()
        dispatchSendMessage(buyer_id)
      }
    })
    // 输入监听
    $(`body`).delegate('textarea', 'propetychange input', function () {
      //监听
      $(this).val($(this).val())
      $(this).text($(this).val())
    })
  }, 1000)
}

//翻译待发送的文本
async function handleTranslation(targetLang) {
  //   let currentPageCountry = $('html').attr('class').toLocaleLowerCase() //当前页面获取到的国家
  ipcNotice({
    type: 'TRANS_TEXT',
    params: {
      type: 'send',
      messageText: $('textarea').val(),
      targetLang: targetLang,
    },
  })
}

//发送消息分发
async function dispatchSendMessage(buyer_id) {
  // 要区分图片还是文本
  if ($('section img').length == 0 && !$('textarea').val()) {
    ipcNotice({
      type: 'ERROR_DIALOG',
      params: '请输入消息内容',
    })
    $('textarea').val('')
    return false
  }
  let messageType = $('section img').length > 0 ? 'image' : 'text'

  if (messageType == 'image') {
    $('section img').each(async function () {
      //先上传图片
      let imagesParams = {
        type: 'image',
        content: {
          width: $(this).width(),
          height: $(this).height(),
          file_server_id: 0,
        },
      }
      try {
        let base64 = await getBase64($(this).attr('src'))
        let imageUrl = handleUpload(base64)
        imagesParams.content.url = imageUrl
        handleSendMessage(buyer_id, imagesParams)
      } catch (error) {
        ipcNotice({
          type: 'ERROR_DIALOG',
          params: '消息发送失败',
        })
        ipcNotice({
          type: 'WRITE_LOG',
          params: error,
        })
      }
    })
  } else {
    let textParams = {
      type: 'text',
      content: {
        text: $('textarea').text(),
      },
    }
    handleSendMessage(buyer_id, textParams)
  }
}

//发送消息
async function handleSendMessage(buyer_id, params) {
  localforage
    .getItem('session')
    .then(function (value) {
      // 当离线仓库中的值被载入时，此处代码运行
      let { token } = value
      const baseInfo = {
        host: location.host,
        token: token,
        to_id: buyer_id,
      }
      ipcNotice({
        type: 'SEND_MESSAGE',
        params: Object.assign(baseInfo, params),
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

//blob转base64
async function getBase64(url) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('get', url, true)
    xhr.responseType = 'blob'
    xhr.onload = function () {
      if (this.status === 200) {
        var blob = this.response
        var fileReader = new FileReader()
        fileReader.onloadend = function (e) {
          var result = e.target.result
          resolve(result)
        }
        fileReader.readAsDataURL(blob)
      }
    }
    xhr.onerror = function () {
      reject()
    }
    xhr.send()
  })
}

//base64转文件对象
function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  filename = `${filename}.jpg`
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

//虾皮上传图片
async function handleUpload(base64) {
  new Promise((resolve, reject) => {
    let randomName = Math.random().toString(36).substring(2)
    formData.append('file', dataURLtoFile(base64, randomName))
    // formData.append('conversation_id', 1451748750830325495)
    axios({
      method: 'post',
      data: formData,
      url: `${location.origin}/webchat/api/v1.2/images`,
    })
      .then(res => {
        if (res.data.url) {
          resolve(res.data.url)
        } else {
          ipcNotice({
            type: 'ERROR_DIALOG',
            params: '消息发送失败',
          })
          reject(-1)
        }
      })
      .catch(error => {
        ipcNotice({
          type: 'ERROR_DIALOG',
          params: '消息发送失败',
        })
        ipcNotice({
          type: 'WRITE_LOG',
          params: error,
        })
      })
  })
}

/**
 * 店铺操作分发
 *
 * @param {*} actionType seller-center|remove-bind|modify-alias
 * @param {*} storeId  店铺ID
 */
function dispatchStoreAction(actionType, storeId) {
  switch (actionType) {
    case 'seller-center':
      window.open(location.origin)
      break
    case 'remove-bind':
      ipcNotice({
        type: 'REMOVE_BIND_STORE',
        params: storeId,
      })
      break
    default:
      break
  }
}
