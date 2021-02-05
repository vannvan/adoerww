/*!
 *
 * 采集提示信息
 */
import $ from 'jquery'
import { ShopeModal } from './modal.js'
import { Html } from '@/background/server/html.js'

//全选复选框
export const selAllCurrPage = (obj, name) => {
  var isChecked = $(obj).is(':checked')
  isChecked
    ? $("input[name='" + name + "']").prop('checked', true)
    : $("input[name='" + name + "']").prop('checked', false)
}

//跳过
export const closeRepeatCrawl = () => {
  ShopeModal.hide('#repeatCrawlModal')
  Crawl.displayCrawlResult(true)
}

//继续采集
export const submitRepeatCrawl = () => {
  var crawlCategory = false
  var sourceUrls = getCheckBoxValByName('sourceUrlRepeat')
  if (+$('.totalNum').text() == 0) {
    if (!sourceUrls) {
      $.fn.message({ type: 'error', msg: '请至少选择一个产品进行采集' })
      return
    }
  } else {
    crawlCategory = true
    if (!sourceUrls) {
      $.fn.message({ type: 'error', msg: '请至少选择一个产品进行采集' })
      return
    }
  }
  //$('#loading').modal('show');
  ShopeModal.hide('#repeatCrawlModal')

  if (!crawlCategory) {
    // 显示正在采集结果
    Crawl.showCrawlingResult()
  } else {
    ShopeModal.hide('#repeatCrawlModal')
    crawlCategory = true
  }
  var urlArr = sourceUrls.split(',')
  if (crawlCategory) {
    $('#msgModal .Count').text(urlArr.length)
    $('#msgModal .TotalCount').text(dataArr.length - urlArr.length)
    ShopeModal.show('#msgModal')
    $('#repeatCrawlModal')
      .find('#repeatValue')
      .remove()
  }
  for (var i in dataArr) {
    //天猫截断时间戳
    if (dataArr[i].url.indexOf('detail.tmall.com') > -1 && dataArr[i].url.indexOf('&rn') > -1) {
      dataArr[i].url = updateUrl(dataArr[i].url.split('&'))
    }
    if (urlArr.indexOf(dataArr[i].url) > -1) {
      dataArr[i].repeatCheck = 0
      Html.postCrawlHtml(CONFIGINFO.url.postCrawlHtml(), dataArr[i], 0, function(result) {
        Crawl.recordCrawlResult(result, dataArr[i].url, true, 0, crawlCategory)
      })
    }
  }
  if (!crawlCategory) closeRepeatCrawl()
}

//得到选择的复选框
export const getCheckBoxValByName = name => {
  var s = ''
  $("input[name='" + name + "']:checked").each(function() {
    var v = $(this).val()
    if (v.indexOf(',') > -1) v = v.replace(/,/g, '')
    if (s != '') s = s + ','
    s = s + v
  })
  return s
}

//清空采集结果数量
export const emptyResultNum = () => {
  $('#successNum').text(0)
  $('#failNum').text(0)
  $('#failDetail').empty()
  $('#failDetailDiv').hide()
}

export const updateUrl = urls => {
  var s = ''
  for (var i = 0; i < urls.length; i++) {
    if (urls[i].indexOf('rn=') > -1) continue
    i == urls.length - 1 ? (s += urls[i]) : (s += urls[i] + '&')
  }
  return s
}
