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
        if (!document.getElementById('intercept-box')) {
            document.body.append(countInfo)
        }
        let countPanel = document.createElement('div')
        countPanel.id = 'count-panel'
        let infoText = this.count > 0 ? `已屏蔽${this.count}条CSDN垃圾推荐` : '真好，本次查询没有垃圾信息'
        countPanel.style.cssText = 'position:fixed;bottom:170px;right:300px;color:#bdc3c7'
        countPanel.innerHTML = infoText
        if (!document.getElementById("count-panel")) {
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
        this.dissCSDN()
        this.setMenhera()
        this.resetBottomBg()
        // if (!document.querySelector(".pio-container")) {
        //     this.pio()
        // }
    },
    addJs: function(url) {
        var file = chrome.extension.getURL(url)
        var s = document.createElement('script')
        s.type = 'text/javascript'
        s.src = file
        document.documentElement.appendChild(s)
    },
    pio: function() {
        let pioContent = `<div class="pio-container right">
        <div class="pio-action"></div>
            <canvas id="pio" width="280" height="250"></canvas>
        </div>`
        document.body.innerHTML += pioContent
        let pioScript = `<link type="text/css" rel="stylesheet" href="https://adoerww.now.sh/Pio-demo/static/pio.css">`
        this.addJs('js/static/l2d.js')
        this.addJs('js/static/pio.js')
        document.body.innerHTML += pioScript
        this.addJs('js/static/draw.js')
    },

}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    let { statusCode } = message
    if (statusCode == 200) {
        if (/baidu/.test(document.location.host)) {
            Baidu.init()
        }
        sendResponse('开始拦截啦')
    }
    return true
})