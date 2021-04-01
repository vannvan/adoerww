const { ipcRenderer } = require('electron')
const $ = require('jquery')
const localforage = require('localforage')
const { default: axios } = require('axios')
const Store = require('electron-store')
const Lib = require('../utils/lib')
var currentStoreId = null
var currentSite = null
var checkUpdateTimer = null
//加载阿里图标
let store = new Store()

Lib.addCssByLink('https://at.alicdn.com/t/font_1833787_5je7dr8w03.css')
$(function () {
  const storeMenuList = store.get('storeMenuList')

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
  $('body').prepend(leftMenuWrap)
  if (storeMenuList && storeMenuList.length > 0) {
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
              <span class="store-item-name" data-store="${
                subEl.shopId
              }" data-key="${el.key}"> ${
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
                <span class="new-message-tip" data-store="${
                  subEl.shopId
                }"></span>
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
  } else {
    $('.emalacca-client-menu-list').append(`<div class="virtual-list">
        <img src="data:image/png;base64,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"
            class="_36TChUqGo9">
        <p>暂时还没有绑定店铺哦！</p>
    </div>`)
    console.log('没有店铺')
  }

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

// 向主线程发送消息
function ipcNotice({ type, params }) {
  console.log('type:', type, 'params:', params)
  ipcRenderer.send('inject-message', { type: type, params: params })
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
