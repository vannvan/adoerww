chrome.contextMenus.create({
  title: '使用度娘翻译：%s', // %s表示选中的文字
  contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
  onclick: function (params) {
    // 注意不能使用location.href，因为location是属于background的window对象
    chrome.tabs.create({
      url: 'https://fanyi.baidu.com/#zh/en/' + encodeURI(params.selectionText),
    })
  },
})
chrome.contextMenus.create({
  title: '打开扩展页',
  onclick: function (params) {
    // 注意不能使用location.href，因为location是属于background的window对象
    MAIN.FirstRun.finishInitialization()
  },
})

var MAIN = {
  FirstRun: {
    open: function (url, callback) {
      chrome.tabs.create(
        {
          url: url,
        },
        callback && afterTabLoaded(callback)
      )
    },
    finishInitialization: function () {
      MAIN.FirstRun.open(chrome.extension.getURL('index.html'))
    },
  },
}

function logURL(response) {
  sendMessageToContentScript(response, (loadMessage) => {
    if (loadMessage) {
      console.log(loadMessage)
    }
  })
}

chrome.webRequest.onHeadersReceived.addListener(
  logURL,
  { urls: ['*://*.baidu.com/*'], types: ['xmlhttprequest'] },
  ['responseHeaders']
)

function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
      if (callback) callback(response)
    })
  })
}

chrome.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    // console.log(details)
    const OPTIONS = ['http://192.168.50.63:8080']
    OPTIONS.map((el) => {
      details.url = details.url.replace(el, 'http://192.168.50.244:8080')
    })
    return { redirectUrl: 'http://192.168.50.244:8080' }
  },
  {
    urls: ['<all_urls>'],
  },
  ['blocking', 'requestHeaders', 'extraHeaders']
)
