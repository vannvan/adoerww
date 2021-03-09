// const chrome = {}
const contextMenus = {}
import {
  ERP_SYSTEM
} from '@/lib/env.conf'

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

  chrome.tab.insertCss(tabId, {
    file: link.match(/\/?(\w+\.?-?\w+\.css)$/)[1]
  })
}
// 插入js
export function exceScript(tabId, linkOrCode) {
  if (!chrome.tab) {
    console.log(" Sorry, maybe you didn't declare tab permission")
    return
  }

  chrome.tab.exceScript(
    tabId,
    linkOrCode.match(/\.js$/) ?
    {
      file: linkOrCode.match(/\/?(\w+\.?-?\w+\.js$)/)[1]
    } :
    {
      code: linkOrCode
    }
  )
}

// 获取当前窗口的ID
export function getCurrent(callback) {
  if (typeof callback != 'function') return
  chrome.windows.getCurrent(function (currentWindow) {
    callback && callback(currentWindow.id)
  })
}
// 获取当前tabID
export function getTabId(callback) {
  if (typeof callback != 'function') return
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    callback && callback(tabs.length ? tabs[0].id : null)
  })
}
// 获取当前tabID2
export function getTabId2(callback) {
  if (typeof callback != 'function') return
  chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({
      active: true,
      windowId: currentWindow.id
    }, function (tabs) {
      if (callback) callback(tabs.length ? tabs[0].id : null)
    })
  })
}

//获取当前tab的url
export function getTabUrl(callback) {
  if (typeof callback != 'function') return
  chrome.tabs.getSelected(null, function (tab) {
    callback(tab.url)
  })
}

//获取所有标签页
export function getAllTabs(callback) {
  if (typeof callback != 'function') return
  chrome.windows.getAll({
    populate: true
  }, function (windows) {
    windows.forEach(function (window) {
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
  chrome.tabs.highlight({
    windowId: windowId,
    tabs: tabIndex
  }, function (tab) {
    callback(tab)
  })
}

//打开erp所在的标签页
export function gotoErp(callback) {
  const currentErpSystem = ERP_SYSTEM[process.env.NODE_ENV]
  let reg = new RegExp(currentErpSystem)
  getAllTabs(function (tabs) {
    for (let i = 0; i < tabs.length; i++) {
      if (reg.test(tabs[i].url)) {
        gotoSomeTab(tabs[i].windowId, tabs[i].index, function (res) {
          callback(res)
        })
        break
      }
    }
  })
}

//storage.sync 获取数据
export function getStorageSync(values) {
  if (!chrome.storage) {
    console.log('Sorry, maybe you dont have storage permission')
    return
  }
  return new Promise(resolve => {
    chrome.storage.sync.get(values, (items) => {
      resolve(items)
    })
  })
}

// storage.sync 保存数据
export function setStorageSync(values) {
  if (!chrome.storage) {
    console.log('Sorry, maybe you dont have storage permission')
    return
  }
  return new Promise(resolve => {
    chrome.storage.sync.set(values, () => {
      resolve()
    })
  })
}

// storage.sync 删除指定key的一个或多个数据项
export function removeStorageSync(values, callback) {
  if (!chrome.storage) {
    console.log('Sorry, maybe you dont have storage permission')
    return
  }
  chrome.storage.sync.remove(values, function () {
    typeof callback == 'function' && callback(values)
  })
}

// storage.sync 清空存储的所有数据项
export function clearStorageSync(callback) {
  if (!chrome.storage) {
    console.log('Sorry, maybe you dont have storage permission')
    return
  }
  chrome.storage.sync.clear(function () {
    typeof callback == 'function' && callback(values)
  })
}

//storage.local 获取数据
export function getStorageLocal(values, callback) {
  if (!chrome.storage) {
    console.log('Sorry, maybe you dont have storage permission')
    return
  }
  chrome.storage.local.get(values, function (items) {
    callback && callback(items)
  })
}

// storage.local 保存数据
export function setStorageLocal(values, callback) {
  if (!chrome.storage) {
    console.log('Sorry, maybe you dont have storage permission')
    return
  }
  chrome.storage.local.set(values, function () {
    typeof callback == 'function' && callback(values)
  })
}

//  存储事件触发,当一项或多项更改时触发。
/**
* @export
 * @param {object} changes  
Object mapping each key that changed to its corresponding StorageChange for that item.
 * @param {string} namespace "sync"，"local"或"managed"
 */
export function storageChanged() {
  chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
      var storageChange = changes[key];
      console.log('Storage key "%s" in namespace "%s" changed. ' +
        'Old value was "%s", new value is "%s".',
        key,
        namespace,
        storageChange.oldValue,
        storageChange.newValue);
    }
  });
}

// storage.local 保存数据
export function getAllCookies(values, callback) {
  if (!chrome.cookies) {
    chrome.cookies = chrome.experimental.cookies;
  }
  chrome.cookies.getAll(values, function () {
    callback && callback(items)
  })
  
}
