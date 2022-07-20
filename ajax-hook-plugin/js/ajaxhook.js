(function() {
  'use strict';
  //console.log("hook my xhr")
  ! function(t) {
    function r(n) { if (e[n]) return e[n].exports; var o = e[n] = { exports: {}, id: n, loaded: !1 }; return t[n].call(o.exports, o, o.exports, r), o.loaded = !0, o.exports }
    var e = {};
    return r.m = t, r.c = e, r.p = "", r(0)
  }([function(t, r, e) { e(1)(window) }, function(t, r) {
    t.exports = function(t) {
      t.hookAjax = function(t) {
        function r(r) {
          return function() {
            var e = this.hasOwnProperty(r + "_") ? this[r + "_"] : this.xhr[r],
              n = (t[r] || {}).getter;
            return n && n(e, this) || e
          }
        }

        function e(r) {
          return function(e) {
            var n = this.xhr,
              o = this,
              i = t[r];
            if ("function" == typeof i) n[r] = function() { t[r](o) || e.apply(n, arguments) };
            else {
              var a = (i || {}).setter;
              e = a && a(e, o) || e;
              try { n[r] = e } catch (t) { this[r + "_"] = e }
            }
          }
        }

        function n(r) { return function() { var e = [].slice.call(arguments); if (!t[r] || !t[r].call(this, e, this.xhr)) return this.xhr[r].apply(this.xhr, e) } } window._ahrealxhr = window._ahrealxhr || XMLHttpRequest, XMLHttpRequest = function() {
          var t = new window._ahrealxhr;
          Object.defineProperty(this, "xhr", { value: t })
        };
        var o = window._ahrealxhr.prototype;
        for (var i in o) { var a = ""; try { a = typeof o[i] } catch (t) {} "function" === a ? XMLHttpRequest.prototype[i] = n(i) : Object.defineProperty(XMLHttpRequest.prototype, i, { get: r(i), set: e(i), enumerable: !0 }) }
        return window._ahrealxhr
      }, t.unHookAjax = function() { window._ahrealxhr && (XMLHttpRequest = window._ahrealxhr), window._ahrealxhr = void 0 }, t.default = t
    }
  }]);
})();

let requestList = []

hookAjax({
  //拦截回调
  onreadystatechange: function(xhr) {
    // console.log(xhr)
    let { responseURL, responseText } = xhr
    if (responseURL == 'https://www3.wipo.int/branddb/jsp/select.jsp') {
      console.log('数据拦截成功')
      requestList.push(responseText)
      console.log(requestList.length)
      if (requestList.length == 3) {
        setTimeout(() => {
          console.log('抓取dom数据')
          getTableData()
        }, 5000)
      }
    }
  },
})

const wsUrl = "wss://remark.ikjzd.com/connect"

var ws = new WebSocket(wsUrl);
var searchQuery = null
var searchQueryQueue = []
var dataList = []
var searchText = null
var searchClass = null
let timer = null


ws.onclose = function() {
  reconnect()
};
ws.onerror = function() {
  reconnect()
};

// 重连
function reconnect(wsUrl) {
  setTimeout(function() { //没连接上会一直重连，设置延迟避免请求过多
    createWebSocket(wsUrl);
  }, 2000);
}

// 实例websocket
function createWebSocket(wsUrl) {
  try {
    if ('WebSocket' in window) {
      ws = new WebSocket(wsUrl);
    } else if ('MozWebSocket' in window) {
      ws = new MozWebSocket(wsUrl);
    } else {
      // _alert("当前浏览器不支持websocket协议,建议使用现代浏览器", 3000)
    }
    initEventHandle();
  } catch (e) {
    reconnect(wsUrl);
  }
}

// 初始化事件函数
function initEventHandle() {
  ws.onclose = function() {
    reconnect(wsUrl);
  };
  ws.onerror = function(err) {
    reconnect(wsUrl);
  };
}

ws.onmessage = function(evt) {
  let received_msg = evt.data;
  let { text, cls } = JSON.parse(received_msg)
  searchText = text
  searchClass = cls
  console.log("接收到的数据：", text, cls);
  // searchQueryQueue.push(searchQuery)
  handleCheckClick(text, cls)
};

ws.onclose = function() {
  console.log('连接已关闭')
  reconnect()
};
ws.onerror = function() {
  console.log('连接错误');
  reconnect()
};

ws.onopen = function(evt) {
  console.log("连接中");
};

setTimeout(() => {
  // $("#USTM_check").parent().parent().click()
  // $("#ui-id-10").click()
  // $("#ACT_check").parent().parent().click()
  // $("#PEND_check").parent().parent().click()
  // $(".addFilterButton").click()
  console.log('点击事件操作完毕')
}, 10000)


timer = setInterval(() => {
  // checkLife()
}, 10000);

function checkLife() {
  let exit1 = $("#ACT_check").parent().parent().hasClass('selected')
  let exit2 = $("#USTM_check").parent().parent().hasClass('selected')
  if (!exit1) {
    console.log('重置Origin...');
    $("#ui-id-10").click()
    $("#ACT_check").parent().parent().click()
    $("#PEND_check").parent().parent().click()
    $(".addFilterButton").click()
  }
  if (!exit2) {
    console.log('重置Source');
    $("#ui-id-7").click()
    $("#USTM_check").parent().parent().click()
    $(".addFilterButton").click()
  }
}

function handleCheckClick(text, cls) {
  // searchQuery = searchQueryQueue[0]
  $(".operatorMenu li:eq(1) div").click()
  $("#BRAND_input").val(text)
  // $("#ui-id-5").click()
  $("#GOODS_CLASS_input").val(cls)
  document.querySelector(".searchButton ").click()
}


function getTableData() {
  let brandList = []
  let countryList = []
  let niceList = []
  $(".ui-widget-content").find("td").each(function() {
    if ($(this).index() == 6) {
      brandList.push($(this).text())
    }
    if ($(this).index() == 12) {
      countryList.push($(this).text())
    }
    if ($(this).index() == 18) {
      niceList.push($(this).text())
    }
  })

  let data = Array.from({ length: brandList.length }, (v, k) => {
    return {
      brand: brandList[k],
      country: countryList[k],
      nice: niceList[k]
    }
  })
  data = data.filter(item => item.brand)
  if (searchText && searchClass) {
    console.log('发送数据：', JSON.stringify(data))
    ws.send(JSON.stringify({
      data: data,
      text: searchText,
      cls: searchClass
    }))
    setTimeout(() => {
      // let searchList = [....click()]
      // console.log('查询条件:', searchList.length);
      // if (searchList.length > 0) {
      //     console.log('清空页面查询记录...')
      //     searchList.map(el => {
      //         el.children[0].click()
      //     })
      // }

      // $('.searchItem').parent().each(function() {
      //     $(this).click()
      // })

      $('.searchItem').parent().find(".ui-icon-close")[0].click();
      setTimeout(() => {
        $('.searchItem').parent().find(".ui-icon-close")[0].click();
      }, 3000)

    }, 2000)
  }
  // checkLife()

  clearSearchHistory()
}


function clearSearchHistory() {
  requestList = []
  searchText = null
  searchClass = null
  // console.clear()

}