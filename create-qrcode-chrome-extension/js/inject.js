function injectCustomJs(jsPath) {
    jsPath = jsPath || 'js/inject.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.extension.getURL(jsPath);
    temp.onload = function() {
        // 放在页面不好看，执行完后移除掉
        this.parentNode.removeChild(this);
    };
    document.head.appendChild(temp);
}

var baidu = {
    appendJq: () => {
        let jsPath = 'js/jquery.min.js';
        var temp = document.createElement('script');
        temp.setAttribute('type', 'text/javascript');
        temp.src = chrome.extension.getURL(jsPath);
        document.head.appendChild(temp);
        console.log('jquery植入成功');
    },
    eventHandler: function() {
        let _this = this
        if (/baidu/.test(document.location.host) && document.location.search) {
            document.onkeydown = function(event) {
                if (event.keyCode == 13 && document.readyState == 'complete') {
                    _this.disableCSDN()
                }
            }
            document.getElementById("su").onclick = function() {
                if (document.readyState == 'complete') {
                    _this.disableCSDN()
                }
            }
            document.onclick = function(event) {
                const matchClass = ['pc', 'n']
                let className = event.target.className
                if (matchClass.includes(className)) {
                    _this.disableCSDN()
                }
            }
        }
    },
    disableCSDN: function() {
        console.log('开始屏蔽')
        let count = 0
        setTimeout(() => {
            let resultList = [...document.querySelectorAll(".result")]
            resultList.map(el => {
                let reg = /csdn已为您找到关于/
                if (el.innerHTML.match(reg)) {
                    el.remove()
                    count++
                }
            })
            console.log(`已屏蔽${count}条CSDN垃圾推荐`)
            if (count > 0) {
                document.querySelector(".FYB_RD").innerText = `已屏蔽${count}条CSDN垃圾推荐`
            }
        }, 500)

    },
    init: function() {
        this.disableCSDN()
        this.eventHandler()
    }
}





window.onload = function() {
    console.log('页面加载完成')
    if (/baidu/.test(document.location.host)) {
        baidu.init()
    }
}