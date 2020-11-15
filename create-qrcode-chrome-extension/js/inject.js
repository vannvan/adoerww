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

const Baidu = {
    count: 0,
    disableList: [
        'csdn已为您找到关于',
    ],
    dissCSDN: function() {
        let resultList = [...document.querySelectorAll(".result")]
        resultList.map(el => {
            let reg = new RegExp(this.disableList.join('').replace(',', '|'))
            if (el.innerHTML.match(reg)) {
                el.remove()
                this.count++
            }
        })
        let countInfo = document.createElement('div')
        let infoText = this.count > 0 ? `已屏蔽${this.count}条CSDN垃圾推荐` : '真好，本次查询没有垃圾信息'
        countInfo.style.cssText = 'position:absolute;bottom:50px;right:20px;color:#bdc3c7'
        countInfo.innerHTML = infoText
        document.getElementById("page").append(countInfo)
    },

    init: function() {
        this.dissCSDN()
    }
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    let { statusCode } = message
    if (statusCode == 200) {
        Baidu.dissCSDN()
        sendResponse('开始拦截啦')
    }
    return true
})