const Baidu = {
    count: 0,
    disableList: [
        'csdn已为您找到关于',
    ],
    //加个表情包
    setMenhera: function() {
        // 标签
        let countInfo = document.createElement('div')
        countInfo.id = 'intercept-box'
        countInfo.style.cssText = 'width:300px;height:0px;background-image:url(https://acg.yanwz.cn/menhera/api.php);background-size:100% auto;padding-top:10%;position:fixed;bottom:0;right:0'
        if (!$$('#intercept-box').length) {
            document.body.append(countInfo)
        }
        let countPanel = document.createElement('div')
        countPanel.id = 'count-panel'
        let infoText = this.count > 0 ? `已屏蔽${this.count}条CSDN垃圾推荐` : '真好，本次查询没有垃圾信息'
        countPanel.style.cssText = 'position:fixed;bottom:170px;right:300px;color:#bdc3c7'
        countPanel.innerHTML = infoText
        console.log($$("#count-panel").length)
        if (!$$("#count-panel").length) {
            document.body.append(countPanel)
        }
    },
    //更换几个背景图片
    resetBottomBg: function() {
        let white = "#fff"
        document.getElementById("page").style.background = white
        document.getElementById("foot").style.background = white
        document.getElementById("help").style.background = white
        document.querySelector(".foot-inner").style.background = white
    },
    dissCSDN: function() {
        let resultList = [...document.querySelectorAll(".result")]
        resultList.map(el => {
            let reg = new RegExp(this.disableList.join('').replace(',', '|'))
            if (el.innerHTML.match(reg)) {
                el.remove()
                this.count++
            }
        })

    },
    init: function() {
        if (/baidu/.test(window.location.hash)) {
            this.dissCSDN()
            this.setMenhera()
            this.resetBottomBg()
        }
    }
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    let { statusCode } = message
    if (statusCode == 200) {
        Baidu.dissCSDN()
        Baidu.setMenhera()
        Baidu.resetBottomBg()
        sendResponse('开始拦截啦')
    }
    return true
})


var port = chrome.extension.connect({ name: "knockknock" });

port.postMessage({ joke: "Knock knock" });
port.onMessage.addListener(function(msg) {
    if (msg.question == "Who's there?")
        port.postMessage({ answer: "Madame" });
    else if (msg.question == "Madame who?")
        port.postMessage({ answer: "Madame... Bovary" });
});