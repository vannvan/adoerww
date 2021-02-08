// const chrome = {}
const contextMenus = {}
import { ERP_SYSTEM } from '@/lib/env.conf'

// 右键菜单
export function contextMenu(config) {
  config = config || {}
  contextMenus.title = config.showSelect ? config.title + ': %s' : config.title
  config.showSelect ? (contextMenus.contexts = ['selection']) : null
  contextMenus.onclick = config.onclick

  return chrome.contextMenus.create(contextMenus)
}
// 插入Css
export function insertCss(tabId, link) {
  if (!chrome.tab) {
    console.log(" Sorry, maybe you didn't declare tab permission")
    return
  }

  chrome.tab.insertCss(tabId, { file: link.match(/\/?(\w+\.?-?\w+\.css)$/)[1] })
}
// 插入js
export function exceScript(tabId, linkOrCode) {
  if (!chrome.tab) {
    console.log(" Sorry, maybe you didn't declare tab permission")
    return
  }

  chrome.tab.exceScript(
    tabId,
    linkOrCode.match(/\.js$/)
      ? { file: linkOrCode.match(/\/?(\w+\.?-?\w+\.js$)/)[1] }
      : { code: linkOrCode }
  )
}

// 获取当前窗口的ID
export function getCurrent(callback) {
  if (typeof callback != 'function') return
  chrome.windows.getCurrent(function(currentWindow) {
    callback && callback(currentWindow.id)
  })
}
// 获取当前tabID
export function getTabId(callback) {
  if (typeof callback != 'function') return
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    callback && callback(tabs.length ? tabs[0].id : null)
  })
}
// 获取当前tabID2
export function getTabId2(callback) {
  if (typeof callback != 'function') return
  chrome.windows.getCurrent(function(currentWindow) {
    chrome.tabs.query({ active: true, windowId: currentWindow.id }, function(tabs) {
      if (callback) callback(tabs.length ? tabs[0].id : null)
    })
  })
}

//获取当前tab的url
export function getTabUrl(callback) {
  if (typeof callback != 'function') return
  chrome.tabs.getSelected(null, function(tab) {
    callback(tab.url)
  })
}

//获取所有标签页
export function getAllTabs(callback) {
  if (typeof callback != 'function') return
  chrome.windows.getAll({ populate: true }, function(windows) {
    windows.forEach(function(window) {
      //   window.tabs.forEach(function(tab) {
      //     //collect all of the urls here, I will just log them instead
      //     console.log(tab.url)
      //   })
      callback(window.tabs)
    })
  })
}

//打开指定标签页
export function gotoSomeTab(windowId, tabIndex, callback) {
  if (typeof callback != 'function') return
  chrome.tabs.highlight({ windowId: windowId, tabs: tabIndex }, function(tab) {
    callback(tab)
  })
}

//打开erp所在的标签页
export function gotoErp(callback) {
  const currentErpSystem = ERP_SYSTEM[process.env.NODE_ENV]
  let reg = new RegExp(currentErpSystem)
  getAllTabs(function(tabs) {
    for (let i = 0; i < tabs.length; i++) {
      if (reg.test(tabs[i].url)) {
        gotoSomeTab(tabs[i].windowId, tabs[i].index, function(res) {
          callback(res)
        })
        break
      }
    }
  })
}

//storage
export function getItem(values, callback) {
  if (!chrome.storage) {
    console.log('Sorry, maybe you dont have storage permission')
    return
  }

  chrome.storage.sync.get(values, function(items) {
    callback && callback(items)
  })
}

// storage 保存数据
export function setItem(values, callback) {
  chrome.storage.sync.set(values, function() {
    typeof callback == 'function' && callback(values)
  })
}
