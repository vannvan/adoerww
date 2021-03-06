const { ipcRenderer } = require('electron')
const localforage = require('localforage')
const $ = require('jquery')
const md5 = require('js-md5')
const { default: axios } = require('axios')
const Store = require('electron-store')
;(function ($) {
  $.fn.extend({
    message: function (options) {
      options.className = options.type || 'info'
      options = $.extend(
        {
          //type : options.type,
          msg: options.msg,
          speed: options.speed || 300,
          //提示消息5秒后消失
          existTime: options.existTime || 3000,
        },
        options
      )

      var div = $(
        '<div class="emalacca-plugin-toast ' +
          options.className +
          '" role="alert" >' +
          options.msg +
          '</div>'
      )
      $('body').append(div)
      div.show(options.speed)
      //隐藏对象
      setTimeout(function () {
        div.toggle(options.speed)
      }, options.existTime)
      //移除对象
      setTimeout(function () {
        div.remove()
      }, options.existTime + 5000)
      // 关闭弹窗
      $('#closeLoginMessage').click(function () {
        $(this).closest('.emalacca-plugin-toast').remove()
      })
    },
    loading: function () {
      var div = $(
        `<div class="shoppe-loading-wrap">
            <div class="mask"></div>
            <div class="inside"></div>
            <div class="back"></div>
        </div>`
      )
      $('body').append(div)
    },
    loadingHide: function () {
      $('.shoppe-loading-wrap').hide()
    },
    loadingShow: function () {
      $('.shoppe-loading-wrap').show()
    },
  })
  return this
})($)

$.fn.loading()

let store = new Store()

// 将链接中携带的店铺信息放进storage
if (location.search) {
  //未读消息
  let unReadMessage = sessionStorage.getItem('unReadMessage')
    ? JSON.parse(sessionStorage.getItem('unReadMessage'))
    : null
  if (unReadMessage) {
    addNewUnReadMessageForStore(unReadMessage)
  }
}
if (location.pathname == '/webchat/conversations') {
  $('#root').css('transform', 'translateY(-62px)')
}

// 监听页面链接更新
let bodyList = document.querySelector('body'),
  observer = new MutationObserver(function (mutations) {
    if (location.pathname == '/webchat/conversations') {
      $('#root').css('transform', 'translateY(-62px)')
    } else {
      $('#root').css('transform', 'translateY(0px)')
    }
  })
let config = {
  childList: true,
  subtree: true,
}
observer.observe(bodyList, config)

//加载阿里图标
Lib.addCssByLink('//at.alicdn.com/t/font_1833787_5je7dr8w03.css')

const storeMenuList = store.get('storeMenuList')
//消息通知
const MessageNotify = document.createElement('audio')
MessageNotify.src = store.get('noticeSounds')

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
    </div>
    <div class="emalacca-store-input">
        <input />
        <span class="btn cancel">取消</span>
        <span class="btn ok">保存</span>
    </div>
    `
  )
  $('body').append(leftMenuWrap)
  storeMenuList.map(el => {
    currentStoreId = store.get('currentStore')
    currentSite = store.get('currentSite')
    let storeListEl = ''
    if (el.storeList && el.storeList.length > 0) {
      el.storeList.map(subEl => {
        let background = currentStoreId == subEl.shopId ? '#FF720D' : '#fff'
        let color = currentStoreId == subEl.shopId ? '#fff' : '#000'
        let highlightClass = currentStoreId == subEl.shopId ? 'active' : ''
        let preIconColor = currentStoreId == subEl.shopId ? '#fff' : '#ef4d2d'
        storeListEl += `<li class="store-item ${highlightClass}"  style="background:${background};color:${color}">
        <span class="icon em-iconfont em-icon-shopee" style="color:${preIconColor}"></span>  
        <span class="store-item-name" data-store="${subEl.shopId}" data-key="${
          el.key
        }"> ${
          subEl.storeAlias || subEl.storeName || subEl.storeLoginAccount
        }</span>
          <span class="icon em-iconfont em-icon-elipsis-v" style="visibility:${
            subEl.authorizedStatus == 1 ? 'inherit' : 'hidden'
          }" data-store="${subEl.shopId}"></span>
          <span class="re-auth reauthorization" data-id="${
            subEl.id
          }" style="display:${
          subEl.authorizedStatus == 0 ? 'inline-block' : 'none'
        }">重新授权</span>
          <span class="new-message-tip" data-store="${subEl.shopId}"></span>
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
          <span> ${el.siteName}</span>
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
    }
  })

  //店铺操作
  $('.emalacca-store-operation').click(function (e) {
    //   console.log(e.target.getAttribute('action-type'))
    e.preventDefault()
    let actionType = e.target.getAttribute('action-type')
    dispatchStoreAction(actionType, $(this).attr('data-store'))
  })

  //重新授权
  $('.reauthorization').click(function (e) {
    let dataId = e.target.getAttribute('data-id')
    let storeMenuList = Lib.flat(
      store.get('storeMenuList').map(el => el.storeList)
    )
    let storeInfo = storeMenuList.find(el => el.id == dataId) //查找当前操作店铺信息
    ipcNotice({
      type: 'RE_AURH',
      params: {
        dataId: dataId,
        countryCode: storeInfo?.countryCode,
        storeLoginAccount: storeInfo?.storeLoginAccount,
      },
    })
  })

  // 菜单点击
  $('.emalacca-client-menu-fixed').click(function (e) {
    $('textarea').val('')
    let key = e.target.getAttribute('data-key')
    if (key) {
      let storeId = e.target.getAttribute('data-store')
      // 如果选中的和存下的店铺相同，就不动
      if (storeId == store.get('currentStore')) {
        return false
      }
      //切换店铺
      ipcNotice({
        type: 'CHANGE_STORE',
        params: {
          host: store.get('siteConfig.shopeeSeller')[key].host,
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

  //在聊天界面之外的页面添加返回上一页操作
})

window.onmousewheel = function (e) {
  //   e = e || window.event
  let messageEl = [...document.querySelectorAll('pre')]
  messageEl.map((el, index) => {
    //判断消息位置
    let flexPos = window.getComputedStyle(el.parentElement.parentElement, null)
      .justifyContent
    if (!el.getAttribute('flag') && flexPos == 'flex-start') {
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
          if (
            currentTransNodeIndex == el.getAttribute('data-node-id') &&
            !el.getAttribute('trans')
          ) {
            el.setAttribute('trans', true)
            el.innerHTML = `${JSON.parse(params.targetText)
              .map(el => el[0])
              .join('')}`
          }
        })
        break
      case 'CHECKED_SOMEBODY': //选中某人
        appendTranslateButton(params)
        break
      case 'NEW_MESSAGE': //新消息提醒
        let { messageList, noticeEnable } = params
        if (noticeEnable) {
          MessageNotify.play()
        }
        await addNewUnReadMessageForStore(messageList)
        sessionStorage.setItem('unReadMessage', JSON.stringify(messageList)) //把未读存起来
        break
      case 'REPLACE_TEXTAREA': // 替换待发送的文本
        $('textarea').text(params)
        $('textarea').val(params) //替换textarea文本
      case 'CHECK_VERSION': // 检查更新
        let { cmd } = params
        if (cmd == 'update-available') {
          $.fn.message({
            type: 'info',
            msg: '检查到新版本，正在下载，请稍后...',
          })
        }
        if (cmd == 'update-not-available') {
          $.fn.message({
            type: 'info',
            msg: '没有新版本可用！',
          })
        }
        break
      case 'HIDE_LOADING': //隐藏loading
        $.fn.loadingHide()
        break
      case 'ERROR_ALERT': //错误提示
        $.fn.message({
          type: 'warning',
          msg: params,
        })
        break
      case 'IS_LOADING_AUTHINFO': //正在加载权限列表
        $.fn.message({
          type: 'info',
          msg: '正在重新加载店铺数据，请稍后...',
        })
        $.fn.loadingShow()
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
      $(this).parent().find('span:eq(2)').hide() //隐藏操作
      $(this).show().text(unReadMessageCount)
    }
  })
}

// 添加翻译按钮
function appendTranslateButton(params) {
  if ($('.emalacca-client-translate-msg-bottom').length != 0) {
    return false
  }
  let { buyer_id } = params
  const langOptions = store.get('siteConfig.langOptions')

  var checkedLang = Lib.storageGet('currentLang') || {
    lang: 'en',
    langName: '英语',
  }

  const svgPath = [
    '<path d="M7 18l-5 3V4a1 1 0 011-1h18a1 1 0 011 1v13a1 1 0 01-1 1H7zm-3-.532L6.446 16H20V5H4v12.468zM7 9h10A5 5 0 017 9z"></path>',
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M19.974 3h-16a1 1 0 00-1 1v16a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1zm-15 16V5h14v14h-14z"></path><path d="M15.42 11.733a.3.3 0 010 .534L9.627 15.24a.3.3 0 01-.437-.267V9.027a.3.3 0 01.437-.267l5.793 2.973z"></path>',
  ]

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
    //去掉视频和个人定制图标曹祖
    $(".chat-icon[viewBox='0 0 24 24']").each(function (e) {
      if (svgPath.includes(this.innerHTML)) {
        this.remove()
      }
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
  if ($("section img[src^='blob']").length == 0 && !$('textarea').val()) {
    $.fn.message({
      type: 'warning',
      msg: '请输入消息内容',
    })
    $('textarea').val('')
    $('textarea').text('')
    return false
  }
  let messageType = $("section img[src^='blob']").length > 0 ? 'image' : 'text'

  if (messageType == 'image') {
    $("section img[src^='blob']").each(async function () {
      if (/blob/.test($(this).attr('src'))) {
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
          let base64 = await Lib.getBase64($(this).attr('src'))
          let imageUrl = await handleUpload(base64)
          imagesParams.content.url = imageUrl
          handleSendMessage(buyer_id, imagesParams)
        } catch (error) {
          $.fn.message({
            type: 'warning',
            msg: '消息发送失败',
          })
          $('#messagesContainer').nextAll().find('svg').last().parent().click()
          //   $("section svg[class='chat-icon']").parent().click()
          ipcNotice({
            type: 'WRITE_LOG',
            params: error,
          })
        }
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
      let {
        token,
        version,
        user: { uid },
      } = value
      const baseInfo = {
        host: location.host,
        token: token,
        uid: uid,
        version: version,
        to_id: buyer_id,
      }
      sendMessage(Object.assign(baseInfo, params))
    })
    .catch(function (err) {
      // 当出错时，此处代码运行
      console.log(err)
    })
}
async function sendMessage(params) {
  let { to_id, token, version, host, uid, ...messageContent } = params
  let data = Object.assign(messageContent, {
    request_id: Lib.guid(),
    to_id: parseInt(to_id),
    chat_send_option: {
      force_send_cancel_order_warning: false,
      comply_cancel_order_warning: false,
    },
  })
  axios({
    method: 'post',
    data: data,
    url: `https://${host}/webchat/api/v1.2/messages?_uid=${uid}&_v=5.3.2`,
    headers: {
      Authorization: 'Bearer ' + token,
      'x-v': 3,
      'x-s': getXSString(uid, token),
    },
  })
    .then(() => {
      // 清除文本框
      $('textarea').val('')
      $('#messagesContainer').nextAll().find('svg').last().parent().click()
      //   $("section svg[class='chat-icon']").parent().click()
    })
    .catch(err => {
      console.log('sendMessage error:', err.data)
      $.fn.message({
        type: 'error',
        msg: '发送失败，请稍后重试',
      })
    })
}

// 向主线程发送消息
function ipcNotice({ type, params }) {
  console.log('type:', type, 'params:', params)
  ipcRenderer.send('inject-message', { type: type, params: params })
}

//虾皮上传图片
async function handleUpload(base64) {
  return new Promise((resolve, reject) => {
    let randomName = Math.random().toString(36).substring(2)
    let formData = new FormData()
    formData.append('file', Lib.dataURLtoFile(base64, randomName))
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
          $.fn.message({
            type: 'warning',
            msg: '消息发送失败',
          })
          $("section svg[class='chat-icon']").parent().click()
          reject(-1)
        }
      })
      .catch(error => {
        $.fn.message({
          type: 'warning',
          msg: '消息发送失败',
        })
        $("section svg[class='chat-icon']").parent().click()
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
      $.fn.loadingShow()
      setTimeout(() => {
        $.fn.loadingHide()
      }, 30000)
      break
    case 'modify-alias':
      //找到该店铺的位置
      let $storeItemName = $(`.store-item-name[data-store='${storeId}']`)
      $('.emalacca-store-input').css({
        top: $storeItemName.offset().top,
        display: 'flex',
      })
      $('.emalacca-store-input input').focus()
      $('.emalacca-store-input .cancel').click(function () {
        $('.emalacca-store-input').hide()
        $('.emalacca-store-input input').val('')
      })
      $('.emalacca-store-input .ok').click(function () {
        let aliasName = $('.emalacca-store-input input').val()
        if (!aliasName) {
          $.fn.message({
            type: 'warning',
            msg: '请输入有效字符',
          })
        } else {
          ipcNotice({
            type: 'MODIFY_ALIAS_NAME',
            params: { storeId: storeId, aliasName: aliasName },
          })
          $.fn.loadingShow()
          setTimeout(() => {
            $.fn.loadingHide()
          }, 30000)
        }
      })
    default:
      break
  }
}

function getXSString(uid, token) {
  let url = `/messages?_uid=${uid}&_v=5.3.2`
  let hashStr = '42990074-9a73-4459-b749-f3110d222a72'
  token = 'Bearer ' + token
  console.log(url + hashStr + token)
  return md5(url + hashStr + token)
}
