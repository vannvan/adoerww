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
    //js加载完成执行
    //console.log(hookAjax)
    let isLoading = false
    let reqNum = 0
    let searchParams = null
    const ws = new WebSocket("wss://remark.ikjzd.com/connect");
    console.log('WebSocket已初始化')
    ws.onopen = function() {
        console.log("WebSocket已连接");
        // ws.send('测试数据，已建立连接');
    };

    // setTimeout(() => {
    //     document.getElementById("BRAND_input").value = Math.random().toString(36).substring(2)
    //     document.querySelector(".searchButton ").click()
    // }, 5000)

    hookAjax({
        //拦截回调
        onreadystatechange: function(xhr) {
            reqNum--
            // console.log('当前请求数:', reqNum)
            // console.log(xhr)
            let { responseURL, responseText } = xhr
            if (responseURL == 'https://www3.wipo.int/branddb/jsp/select.jsp' && searchParams) {
                // console.log(responseURL)
                console.log('数据拦截成功')
                sendMessage({ params: searchParams, data: responseText.qi })
                reqNum = 0
            }


        },
        onload: function(xhr) {
            console.log('onload', xhr);
            // console.log("onload called: %O", xhr.responseText)
        },
        send: function() {
            reqNum++
            // console.log('当前请求数+', reqNum)
        },
        //拦截方法
        open: function(arg, xhr) {
            // console.log("open called: method:%s,url:%s,async:%s", arg[0], arg[1], arg[2])
        }
    })

    function sendMessage(message) {
        // const ws = new WebSocket("wss://remark.ikjzd.com/connect");
        console.log("数据发送中...");
        console.log(message)
        ws.send(JSON.stringify(message));
    }

    if (window.location.host == 'www3.wipo.int') {
        setInterval(() => {
            let searchList = [...document.querySelectorAll('.searchItem')]
            console.log(searchList.length, '查询条件');
            if (searchList.length > 0) {
                searchList.map(el => {
                    el.children[0].click()
                })
            }
        }, 5000);
    }




    ws.onmessage = function(evt) {
        var received_msg = evt.data;
        let { params } = JSON.parse(received_msg)
        searchParams = params
        console.log("接收到的数据：", searchParams);
        document.getElementById("BRAND_input").value = searchParams
        document.querySelector(".searchButton ").click()
    };

    ws.onclose = function() {
        console.log("连接已关闭...");
    };
    // console.log("hook xhr")
})();