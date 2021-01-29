//ps：在html页面不能出现任何js代码，页面不会调用
//分类采集程序执行流程：
// 点击采集->获取到输入的url->判断url属于那个平台->进入对应平台的采集方法->使用ajax抓取到整个页面
// ->根据返回的页面进行节点查找，拿到产品信息存到data.list，分析信息data.next->进入单品采集逻辑
import $ from 'jquery'
import { selAllCurrPage, closeRepeatCrawl, emptyResultNum } from '@/background/config/repeat'
import { CONFIGINFO } from '@/background/config.js'
import { ShopeModal } from '@/background/config/modal.js'
import { getURL } from '@/lib/chrome-client.js'
import { Html } from '@/background/server/html.js'
import { Crawl } from '@/background/server/crawl.js'

import '@/background/config/message.js'
import '@/assets/styles/css/index.css'
import '@/assets/styles/css/modal.css'
import '@fonts/iconfont.css'

$(function() {
  MAIN.FirstRun.finishInitialization()
  MAIN.INIT.init()
})
var uid = ''
var account = ''

function afterTabLoaded(callback) {
  return function(openedTab) {
    var onUpdated = function(tabId, changeInfo, tab) {
      if (tabId == openedTab.id && changeInfo.status == 'complete') {
        chrome.tabs.onUpdated.removeListener(onUpdated)
        callback(new Page(openedTab))
      }
    }
    chrome.tabs.onUpdated.addListener(onUpdated)
  }
}
var MAIN = {
  INIT: {
    //js入口
    init: function() {
      //tab 切换
      $(document).off('click', '#CrawlTab li')
      $(document).on('click', '#CrawlTab li', function() {
        var uid = $(this).attr('data-uid')
        $('#CrawlTab')
          .find('li')
          .removeClass('active')
        $(this).addClass('active')
        $('#CrawTabContent')
          .find('.TabPane')
          .addClass('hide')
        $('#CrawTabContent')
          .find('#' + uid)
          .removeClass('hide')
      })
      $('button[name="login"]').on('click', MAIN.LOGIC.login)
      $('button[name="checkLogin"]').on('click', MAIN.LOGIC.checkLogin)

      $('a[name="pro_crawl"]').attr('href', CONFIGINFO.url.showAlreadyCrawl())

      $('button[name="crawlBtn"]').on('click', MAIN.LOGIC.initCrawlBtn)
      // 退出登录
      $('div[name="loginOut"]').on('click', MAIN.LOGIC.loginOut)
      // 登录
      $('div[name="loginHeader"]').on('click', MAIN.LOGIC.login)
      // 取消
      $('button[name="cancleBtn"]').on('click', MAIN.LOGIC.cancle)

      $('button[name="cleanBtn"]').on('click', function() {
        $('#url').val('')
        $('#cateUrl').val('')
      })

      $('#crawlResultClose').on('click', function() {
        var failNum = parseInt($('#failNum').text())
        if (failNum == 0) {
          $('#url').val('')
          $('#cateUrl').val('')
        }
        ShopeModal.hide('#crawlResultClose')
      })

      $(document).on('click', 'input[name="curPage"]', function() {
        selAllCurrPage(this, 'sourceUrlRepeat')
      })

      $('button[name="skipCrawl"]').on('click', closeRepeatCrawl)
      $('#crawlResultModal .emptyResult').on('click', emptyResultNum)
      MAIN.LOGIC.init(0, 0)
      //MAIN.LOGIC.checkVersion();
    }
  },
  LOGIC: {
    //登录逻辑
    login: function() {
      ShopeModal.show('#loginModal')
    },
    checkLogin: function() {
      var username = $.trim($('#userName').val())
      var passwd = $.trim($('#passwd').val())
      $.ajax({
        url: CONFIGINFO.url.checkUserAccount(),
        type: 'post',
        contentType: 'application/json;charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({
          account: username,
          password: passwd,
          type: 2
        }),
        timeout: 30000,
        success: function(data) {
          if (data.code == 0) {
            $.fn.message({ type: 'success', msg: '登录成功' })
            let datas = {
              token: data.data.token,
              user: data.data.userInfo.maAccount,
              accountType: data.data.userInfo.maType,
              version: data.data.userInfo.plugVersion
            }
            localStorage.removeItem('pt-plug-access-user')
            localStorage.setItem('pt-plug-access-user', JSON.stringify(datas))
            ;(account = data.data.userInfo.maAccount),
              (uid = data.data.token),
              $('#account')
                .html(
                  `版本号：${datas.version}   <span class="icon iconfont icon-shejiao-geren"></span> ${account}`
                )
                .show()
            $('#exit')
              .html('<span class="icon iconfont icon-emalacca-tuichu"></span>' + '退出')
              .show()
            $('#loginH').hide()
            $('#topLoginDiv').show()
            $('#topNoLoginDiv').hide()
            ShopeModal.hide('#loginModal')
            // 获取品牌词

            MAIN.LOGIC.getBrandWord(uid)
            // CONFIGINFO.brandData.data = ['苹果', 'iphone', '手机']
          } else {
            $.fn.message({ type: 'error', msg: data.message })
          }
        },
        error: function(err) {
          let { message } = err.responseJSON
          $.fn.message({ type: 'error', msg: message })
        }
      })
    },

    //初始化采集
    initCrawlBtn: function() {
      $('.RepeatBox').html('')
      if (!uid) {
        ShopeModal.show('#loginModal')
        return false
      }

      var type = $(this).data('type')
      var url = type == 'single' ? $.trim($('#url').val()) : $.trim($('#cateUrl').val())
      var objDom = type == 'single' ? $('#url') : $('#cateUrl')
      var outDiv = objDom.closest('div')
      outDiv.find('.errorMsg').remove()
      objDom.removeClass('errorBorder')
      if (url == null || url == '') {
        var errorMsg = $("<div class='errorMsg'>采集地址为空，请填写采集的URL地址</div>")
        objDom.addClass('errorBorder')
        objDom.after(errorMsg)
        return false
      }
      var errorArr = Crawl.checkUrl(type, url)
      if (errorArr.length > 0) {
        var errorMsg = $("<div class='errorMsg'>" + errorArr.join('<br/>') + '</div>')
        objDom.addClass('errorBorder')
        objDom.after(errorMsg)
        return false
      }
      // 显示正在采集结果
      Crawl.showCrawlingResult()

      if (type == 'single') {
        // 单品采集
        $('#failDetail').html('')
        $('#failNum').html(0)

        //MAIN.LOGIC.getBrandWord(uid, url)
        Crawl.singleCrawl(
          JSON.parse(localStorage.getItem('pt-plug-access-user')).token,
          url,
          true,
          false,
          '',
          '',
          JSON.parse(localStorage.getItem('brandData'))
        )
      } else if (type == 'category') {
        // 分类采集
        $('#failDetail').html('')
        $('#failNum').html(0)
      }
    },
    init: function(t, tt) {
      if (JSON.parse(localStorage.getItem('pt-plug-access-user')) !== null) {
        let obj = JSON.parse(localStorage.getItem('pt-plug-access-user'))
        account = obj.user
        uid = obj.token
        $('#account').html(
          `版本号：  ${obj.version} <span class="icon iconfont icon-shejiao-geren"></span> ${account}`
        )
        $('#exit').html('<span class="icon iconfont icon-emalacca-tuichu"></span>' + '退出')
        $('#topLoginDiv').show()
        $('#topNoLoginDiv').hide()
        $('#loginH').hide()
      } else {
        $('#topLoginDiv').hide()
        $('#topNoLoginDiv').show()
        ShopeModal.show('#loginModal')
        $('#loginH').hide()
        $(document).on('keydown', function(event) {
          var e = event ? event : window.event ? window.event : null
          if (e.keyCode == 13) {
            MAIN.LOGIC.checkLogin()
          }
        })
      }
    },
    // 退出登录
    loginOut: function() {
      if (JSON.parse(localStorage.getItem('pt-plug-access-user')) !== null) {
        localStorage.removeItem('pt-plug-access-user')
        localStorage.removeItem('brandData')
        // ShopeModal.show("#loginOutModel")
        $.fn.message({ type: 'success', msg: '退出成功' })
        setTimeout(() => {
          // ShopeModal.hide("#loginOutModel")
          $('#account').hide()
          $('#exit').hide()
          $('#loginH')
            .html('<span class="icon iconfont icon-shejiao-geren"></span>' + '登录')
            .show()
        }, 1000)
      }
    },
    // 取消按钮
    cancle: function() {
      if (JSON.parse(localStorage.getItem('pt-plug-access-user')) == null) {
        $('#topLoginDiv').show()
        $('#loginH')
          .html('<span class="icon iconfont icon-shejiao-geren"></span>' + '登录')
          .show()
        ShopeModal.hide('#loginModal')
      }
    },
    // 获取品牌词
    getBrandWord: function(token, url) {
      if (token) {
        Crawl.singleCrawl(
          JSON.parse(localStorage.getItem('pt-plug-access-user')).token,
          url,
          true,
          false,
          '',
          '',
          JSON.parse(localStorage.getItem('brandData'))
        )

        /*     $.ajax({
          url: CONFIGINFO.url.BrandAPI(),
          type: 'POST',
          headers: {
            Authorization: 'Bearer ' + token,
          },
          timeout: 30000,
          success: function (res) {
            localStorage.setItem('brandData', JSON.stringify(res.data))
            /!*Crawl.singleCrawl(
              JSON.parse(localStorage.getItem('pt-plug-access-user')).token,
              url,
              true,
              false,
              '',
              '',
              JSON.parse(localStorage.getItem('brandData'))
            )*!/
          },
          complete: function (XMLHttpRequest, status) {
            if (status == 'timeout') {
              tt < 3
                ? init(t, tt + 1)
                : $.fn.message({ type: 'error', msg: '请求超时，请稍后重试！' })
            } else if (status == 'error') {
              $.fn.message({ type: 'error', msg: '请求出错，请联系管理员！' })
            }
          },
        })*/
      }
    }
  },
  FirstRun: {
    open: function(url, callback) {
      chrome.tabs.create(
        {
          url: url
        },
        callback && afterTabLoaded(callback)
      )
    },
    finishInitialization: function() {
      if (JSON.parse(localStorage.getItem('firstRun')) == null) {
        localStorage.setItem('firstRun', false)
        FirstRun.open(getURL('presentation/presentation.html'))
      }
    }
  }
}
