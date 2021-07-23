class Monitor {
        constructor() {
                // 发送队列的阈值
                this.vpt = 10

                // 事件节点类型限制
                this.limitNodeType = ['button']

                // 用户浏览器信息
                this.uaInfo = {}

                // 页面级别的数据队列
                this.pageDataQuene = []

                // 当前操作队列ID
                this.currentQueneId = null

                // 此属性用于保存bind返回的匿名函数
                this.eventHandler = null
        }

        /**
         * @description 生成guid，当前操作队列的唯一标识
         * @returns {*}
         * @memberof Monitor
         */
        guid() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        var r = (Math.random() * 16) | 0,
                                v = c == 'x' ? r : (r & 0x3) | 0x8
                        return v.toString(16)
                })
        }

        /**
         * @description 当前时间戳
         * @returns {*}
         * @memberof Monitor
         */
        getTime() {
                return Date.parse(new Date())
        }

        /**
         * @description 初始化方法:
         *  extendData 用于传入基于业务的数据信息，
         *  router 是vue-router对象,这里既可以通过init传入，也可以在当前类模块直接引入，
         *  config 是配置信息
         * @param {*} { extendData = null, router = null, config = {} }
         * @memberof Monitor
         */
        init({ extendData = null, router = null, config = {}, vptHanlder }) {
                console.log('monitor init ......')
                let { vpt } = config
                this.vpt = vpt ? vpt : this.vpt
                this.uaHandler()

                this.eventHandler = this.eventCallback.bind(this) // 关键
                document.addEventListener('click', this.eventHandler, true)
                if (router) {
                        router.afterEach(async (to) => {
                                // 离开监听
                                this.updateLeaveTime()

                                // 外部传入
                                this.vptHandler = vptHanlder.bind(this, this.get())

                                // 阈值监听
                                this.vptHandler()

                                // 当前操作页面的唯一标识
                                this.currentQueneId = this.guid()
                                let initPageData = [{
                                        id: this.currentQueneId,
                                        path: to.path,
                                        uaInfo: this.uaInfo,
                                        pageInfo: {
                                                entryTime: this.getTime()
                                        },
                                        ...extendData,
                                        eventData: []
                                }]
                                if (this.pageDataQuene.length >= this.vpt) {
                                        this.clear()
                                }
                                this.pageDataQuene = this.pageDataQuene.concat(initPageData)
                        })
                } else {
                        console.warn('请传入router对象')
                }
        }

        /**
         * @description ua信息
         * @memberof Monitor
         */
        uaHandler() {
                this.uaInfo = {
                        userAgent: navigator.userAgent,
                        dpiWidth: window.screen.width,
                        dpiHeight: window.screen.height
                }
        }

        /**
         * @description 页面离开时间更新
         * @memberof Monitor
         */
        updateLeaveTime() {
                let index = this.pageDataQuene.findIndex(
                        (el) => el.id == this.currentQueneId
                )
                if (index >= 0) {
                        this.pageDataQuene[index].pageInfo.leaveTime = this.getTime()
                }
        }

        /**
         * @description 事件回调中转
         * @param {*} e
         * @memberof Monitor
         */
        eventCallback(e) {
                //TODO
                if (e.type == 'click') {
                        this.clickEventHandler(e)
                }
        }

        /**
         * @description 页面点击事件收集
         * @param {*} ele 事件节点
         * @memberof Monitor
         */
        clickEventHandler(ele) {
                const { innerText, localName, formAction, type } = ele.target
                let isEv = this.limitNodeType.includes(localName)
                if (isEv) {
                        let eventData = [{
                                innerText,
                                localName,
                                formAction,
                                eleType: type,
                                eventType: 'click',
                                clickTime: this.getTime()
                        }]

                        let index = this.pageDataQuene.findIndex(
                                (el) => el.id == this.currentQueneId
                        )
                        if (index >= 0) {
                                this.pageDataQuene[index].eventData = this.pageDataQuene[
                                        index
                                ].eventData.concat(eventData)
                        }
                }
        }

        /**
         * @description 阈值监听，达到阈值就发送数据
         * @memberof Monitor
         */
        vptHandler() {
                if (this.pageDataQuene.length >= this.vpt) {
                        this.sendData()
                }
        }

        /**
         * @description 用于外部获取操作队列
         * @returns {*} Object
         * @memberof Monitor
         */
        get() {
                return {
                        value: this.pageDataQuene,
                        length: this.pageDataQuene.length
                }
        }

        /**
         * @description 用于清空队列
         * @memberof Monitor
         */
        clear() {
                //TODO
                this.pageDataQuene = []
        }

        // 销毁监听事件
        destroy() {
                document.removeEventListener('click', this.eventHandler, true)
        }
}

export default Monitor
