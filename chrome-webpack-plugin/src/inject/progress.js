import { ERP_LOGIN_URL } from '@/lib/env.conf'
let batchGatherObj = {
  batchGatherSum: 0, // 请求完的总数
  batchGatherLength: 0, // 需要请求的总数
  batchSuccessNum: 0, // 成功数
  batchErrorNum: 0 // 失败数
}
let batchTimer, progress_timeout = null
// 计算采集状态数量
export function hintNotifyProgress(isSucc) {
  window.clearTimeout(batchTimer)
  
  batchGatherObj.batchGatherSum++
  if (isSucc) {
    batchGatherObj.batchSuccessNum++
  } else {
    batchGatherObj.batchErrorNum++
  }
  let { batchGatherLength, batchSuccessNum, batchErrorNum, batchGatherSum } = batchGatherObj
  var num = (batchGatherSum / batchGatherLength).toFixed(2)

  num = parseInt(num * 100)
  
  if (batchGatherSum == batchGatherLength) {
    notifyProgress({ percent: 100, success: batchSuccessNum, faild: batchErrorNum })
  } else {
    notifyProgress({ percent: num, success: batchSuccessNum, faild: batchErrorNum })
    batchTimer = window.setTimeout(function() {
      let errorNum = batchGatherLength - batchSuccessNum
      notifyProgress({ percent: 100, success: batchSuccessNum, faild: errorNum })
    }, 10000)
  }
}

//progress进度条
export function notifyProgress({ percent, success, faild, count }) {
  var progressHtml =
    '<div class="sellerwant-progress-box"><p class="ellerwant-progress-txt"></p><div class="sellerwant-progress-inner"><span></span><div class="sellerwant-progress-bg"></div></div><p class="sellerwant-progress-results"><span class="sellerwant-progress-results-success"></span><span class="sellerwant-progress-results-failure"></span></p></div>'
  clearTimeout(progress_timeout)
  if (percent == 0) {
    // 初始化赋值
    batchGatherObj = {
      batchGatherSum: 0, // 请求完的总数
      batchGatherLength: count || batchGatherObj.batchGatherLength, // 需要请求的总数
      batchSuccessNum: 0, // 成功数
      batchErrorNum: 0 // 失败数
    }
    $(progressHtml).appendTo('body')
    $('.sellerwant-progress-box').fadeTo(1000, 1)
    $('.sellerwant-progress-box')
      .find('.ellerwant-progress-txt')
      .text('采集中')
    $('.sellerwant-progress-box')
      .find('.sellerwant-progress-inner>span')
      .text('0%')
    $('.sellerwant-progress-box')
      .find('.sellerwant-progress-bg')
      .css({ width: '0' })
    $('.sellerwant-progress-box')
      .find('.sellerwant-progress-results>.sellerwant-progress-results-success')
      .text('成功 0')
    $('.sellerwant-progress-box')
      .find('.sellerwant-progress-results>.sellerwant-progress-results-failure')
      .text('失败 0')
  } else if (percent !== 100) {
    $('.sellerwant-progress-box')
      .find('.sellerwant-progress-inner>span')
      .text(percent + '%')
    $('.sellerwant-progress-box')
      .find('.sellerwant-progress-bg')
      .css({ width: percent + '%' })
    $('.sellerwant-progress-box')
      .find('.sellerwant-progress-results>.sellerwant-progress-results-success')
      .text('成功 ' + success)
    $('.sellerwant-progress-box')
      .find('.sellerwant-progress-results>.sellerwant-progress-results-failure')
      .text('失败 ' + faild)
  } else if (percent == 100) {
    $('.sellerwant-progress-box')
      .find('.sellerwant-progress-inner>span')
      .text('100%')
    $('.sellerwant-progress-box')
      .find('.ellerwant-progress-txt')
      .html(
        `已加入采集箱，可到<a style="margin: 0 15px; color: blue !important;" target="_blank" href="${ERP_LOGIN_URL}goods/collect">采集箱</a>查看采集商品`
      )
    $('.sellerwant-progress-box')
      .find('.sellerwant-progress-bg')
      .css({ width: '100%' })
    $('.sellerwant-progress-box')
      .find('.sellerwant-progress-results>.sellerwant-progress-results-success')
      .text('成功 ' + success)
    $('.sellerwant-progress-box')
      .find('.sellerwant-progress-results>.sellerwant-progress-results-failure')
      .text('失败 ' + faild)
    progress_timeout = setTimeout(function() {
      $('.sellerwant-progress-box').fadeOut(3000, function() {
        $('.sellerwant-progress-box').remove()
        // 采集完成清除样式
        hintBatch()
      })
    }, 3000)
  }
}

// 批量采集提示
function hintBatch() {
  $('.fetch .FetchBtn').css('pointer-events', 'auto')
  $('.fetch .fetch-selectBtn').css('pointer-events', 'auto')
  $('.fetch .fetch-selectBtn').html('采集选中')
  $('.fetch .FetchBtn').html('采集本页')
}
