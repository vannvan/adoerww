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
