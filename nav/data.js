var msg = "万头攒动火树银花之处不必找我。如欲相见，我在各种悲喜交集处，能做的只是长途跋涉的归真返璞-by木心";
var timer = null

function titnimation() {
    msg = msg.substring(1, msg.length) + msg.substring(0, 1);
    document.title = msg;
}
var hiddenProperty = 'hidden' in document ? 'hidden' :
    'webkitHidden' in document ? 'webkitHidden' :
    'mozHidden' in document ? 'mozHidden' :
    null;
var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
var onVisibilityChange = function() {
    if (!document[hiddenProperty]) {
        clearInterval(timer)
        document.title = 'JUST DO　IT．．．'
    } else {
        timer = setInterval("titnimation()", 200);
    }
}
document.addEventListener(visibilityChangeEvent, onVisibilityChange)
$(document).ready(function() {
    const WEBSITE = [{
        'name': '社区博客',
        'icon': 'icon-bokexinwen',
        'linkList': [{
            name: "Github",
            link: "https://github.com/"
        }, {
            name: "Gitee",
            link: "https://gitee.com/wwya"
        }, {
            name: "Oschina",
            link: 'https://www.oschina.net/'
        }, {
            name: 'segmentfault',
            link: 'https://segmentfault.com/'
        }, {
            name: '脚本之家',
            link: 'http://www.jb51.net/'
        }, {
            name: '掘金',
            link: 'https://juejin.im/timeline'
        }, {
            name: 'codepen',
            link: 'http://codepen.io/'
        }, {
            name: '前端精选',
            link: 'http://top.html.cn/'
        }, {
            name: '博客园',
            link: 'https://www.cnblogs.com/'
        }, {
            name: '国外某大神',
            link: "https://dmitripavlutin.com/"
        }, {
            name: '张鑫旭',
            link: 'https://www.zhangxinxu.com'
        }, {
            name: 'W3cplus',
            link: 'https://www.w3cplus.com/'
        }, {
            name: "程序园",
            link: 'http://www.voidcn.com/column/web'
        }, {
            name: "Aaron的博客",
            link: "https://www.haorooms.com/"
        }, {
            name: '木易杨博客',
            link: 'https://muyiy.cn/'
        }, {
            name: '技术胖',
            link: "https://jspang.com/"
        }, {
            name: "技术导航",
            link: "https://iiter.cn/"
        }, {
            name: "珠峰架构Vue.js",
            link: "http://www.zhufengpeixun.cn/train/vue-info/component.html"
        }, {
            name: "汤姆大叔-深入JS",
            link: "https://www.cnblogs.com/TomXu/archive/2011/12/15/2288411.html"
        }, {
            name: "前端内参",
            link: "https://coffe1891.gitbook.io/frontend-hard-mode-interview/1/1.2.6"
        }]
    }, {
        'name': '工具文档',
        'icon': 'icon-shiyongshouce',
        'linkList': [{
            name: 'Moment',
            link: 'http://momentjs.cn/docs/#/parsing/string-format/'
        }, {
            name: 'Gulp',
            link: 'https://www.w3cschool.cn/qtaitm/1cvdkozt.html'
        }, {
            name: "Webpack",
            link: 'https://www.webpackjs.com/concepts/'
        }, {
            name: 'ES6文档',
            link: 'http://es6.ruanyifeng.com/#docs/intro'
        }, {
            name: 'jquery中文',
            link: 'http://jquery.cuishifeng.cn/'
        }, {
            name: 'Archives',
            link: 'https://github.com/vannvan/archives'
        }, {
            name: "css手册",
            link: "http://css.cuishifeng.cn/"
        }, {
            name: 'C3.JS图表',
            link: "https://c3js.org/"
        }, {
            name: "umi方案",
            link: "https://umijs.org/zh/guide/"
        }, {
            name: "ZEIT静态网站",
            link: "https://zeit.co/dashboard"
        }, {
            name: "腾讯云开发者文档",
            link: "https://cloud.tencent.com/developer/section/1490167"
        }, {
            name: 'md美化',
            link: "https://mdnice.com/"
        }]
    }, {
        name: "框架文档",
        icon: "icon-bangzhushouce",
        linkList: [{
            name: 'Element',
            link: 'https://element.eleme.cn/#/zh-CN/component/table'
        }, {
            name: 'Vux',
            link: 'https://doc.vux.li/zh-CN/components/x-input.html'
        }, {
            name: 'iview',
            link: 'https://www.iviewui.com/docs/guide/install'
        }, {
            name: 'React',
            link: 'http://caibaojian.com/react/'
        }, {
            name: 'Ant-Design',
            link: "https://ant.design/docs/react/introduce-cn"
        }, {
            name: 'taro多端框架',
            link: "https://taro.aotu.io"
        }, {
            name: 'next.js',
            link: "https://nextjs.frontendx.cn/"
        }, {
            name: "antv",
            link: "https://antv.vision/zh#products"
        }, {
            name: "nuxt",
            link: "https://www.nuxtjs.cn/guide"
        }, {
            name: '前端面试之道',
            link: "http://caibaojian.com/interview-map/frontend/"
        }, {
            name: "nest.js",
            link: "https://exlley.gitbooks.io/nest-js/content/chapter1/di-yi-ge-kong-zhi-qi.html"
        }]
    }, {
        'name': '码农工具',
        'icon': 'icon-ai-tool',
        'linkList': [{
            name: "Unicode字符百科",
            link: 'https://unicode-table.com/cn/'
        }, {
            name: "草料二维码",
            link: "http://cli.im/url"
        }, {
            name: '程序员工具',
            link: 'http://www.bejson.com/ui/phonesize/'
        }, {
            name: '程序员工具2',
            link: 'https://tool.lu/'
        }, {
            name: '徽章制作',
            link: 'https://badgen.net/'
        }, {
            name: "草料二维码",
            link: 'http://cli.im/url'
        }, {
            name: 'Bejson',
            link: 'http://www.bejson.com/'
        }, {
            name: 'Mock-api',
            link: 'http://mock-api.com/app.html#!/'
        }, {
            name: 'Faker数据模拟',
            link: 'https://github.com/marak/Faker.js/'
        }, {
            name: "移动端调试",
            link: 'https://github.com/wuchangming/spy-debugger'
        }, {
            name: '图标下载',
            link: 'https://www.easyicon.net/'
        }, {
            name: "css在线选择器",
            link: "https://www.haorooms.com/tools/css_selecter/"
        }, {
            name: 'bootCDN',
            link: 'https://www.bootcdn.cn/'
        }, {
            name: "在线抠图",
            link: "https://www.remove.bg/zh/upload"
        }, {
            name: "wulihub静态托管",
            link: "https://www.wulihub.com.cn/store/my_space"
        }, {
            name: "阿里imgcook",
            link: "https://www.imgcook.com/dsl"
        }]
    }, {
        name: "减负工具",
        icon: "icon-gongju",
        linkList: [{
                name: '在线压缩png',
                link: 'https://compresspng.com/zh/'
            }, {
                name: '徽章制作1',
                link: 'https://shields.io/#/'
            }, {
                name: '截图工具',
                link: 'https://zh.snipaste.com'
            }, {
                name: '全能转换',
                link: 'https://cn.office-converter.com/'
            }, {
                name: 'gif录屏工具',
                link: 'https://www.screentogif.com/'
            }, {
                name: '减压神器',
                link: 'https://aidn.jp/mikutap/'
            }, {
                name: "无聊",
                link: 'https://thatsthefinger.com/'
            }, {
                name: "神奇",
                link: 'http://www.koalastothemax.com/'
            }, {
                name: "无用的网站",
                link: 'https://theuselessweb.com/'
            }, {
                name: "CSS渐变色",
                link: "http://color.oulu.me/"
            }

        ]
    }, {
        'name': '硬核资源',
        'icon': "icon-ziyuan",
        'linkList': [{
            name: 'JQ插件库',
            link: 'http://www.jq22.com'
        }, {
            name: 'CTOlib码库',
            link: 'https://www.ctolib.com/'
        }, {
            name: 'icomoon',
            link: 'https://icomoon.io/app/#/select'
        }, {
            name: 'Fontawesome',
            link: 'http://www.fontawesome.com.cn/'
        }, {
            name: '阿里图标库',
            link: 'https://www.iconfont.cn/'
        }, {
            name: 'jquery之家',
            link: 'http://www.htmleaf.com/'
        }, {
            name: "前端知识体系xmind",
            link: "https://www.xmind.net/m/NkQc/"
        }, {
            name: "techbrood",
            link: "https://techbrood.com/"
        }, {
            name: "css动画在线",
            link: "https://animista.net/play"
        }, {
            name: "Animate",
            link: "https://github.com/daneden/animate.css"
        }, {
            name: "vivify",
            link: "https://github.com/Martz90/vivify"
        }, {
            name: "bootstrapmb",
            link: "http://www.bootstrapmb.com/chajian/css3"
        }, {
            name: "天行数据",
            link: "https://www.tianapi.com/"
        }]
    }, {
        'name': '世间百态',
        'icon': 'icon-yinleyule',
        'linkList': [{
            name: "天猫",
            link: "https://www.tmall.com/"
        }, {
            name: '京东',
            link: 'https://www.jd.com'
        }, {
            name: "豆瓣FM",
            link: "https://fm.douban.com/"
        }, {
            name: '网易严选',
            link: 'http://you.163.com/'
        }, {
            name: 'QQ邮箱',
            link: 'https://mail.qq.com/'
        }, {
            name: "微云",
            link: 'https://www.weiyun.com/'
        }, {
            name: "Google邮箱",
            link: 'https://mail.google.com/'
        }]
    }];

    (function() {
        let elStr = ''
        $.each(WEBSITE, (index) => {
            elStr = `<div id="${WEBSITE[index].name}" class="webBox"></div>`
            $(".website").append(elStr)
            buildList(WEBSITE[index].name, WEBSITE[index].linkList)
        })
    })();

    (function() {
        let htmlStr = ''
        $.each(WEBSITE, (index) => {
            htmlStr += `<li onClick="window.location.href='#${WEBSITE[index].name}'"><i class="iconfont ${WEBSITE[index].icon}"></i><a>${WEBSITE[index].name}</li>`
        })
        $('.link-box').append(htmlStr)
    })()

    function buildList(elName, dataList) {
        var htmlStr = `<div class="title">${elName}</div>`
        $.each(dataList, (index) => {
            htmlStr += `<li class="link" onClick="window.open('${dataList[index].link}','_blank')" ><a target="view_window" style='color:#FFFFE0'>${dataList[index].name}</a></li>`
        })
        if (dataList.length % 5 != 0) {
            for (let i = 0; i < Math.abs(dataList.length % 5 - 5); i++) {
                htmlStr += '<li class="empty"></li>'
            }
        }
        $("#" + elName).append(htmlStr)
    }
    (function() {
        let count = 0
        WEBSITE.map(el => {
            el.linkList.map(subEl => {
                count++
            })
        })
        console.log(count)
        let htmlStr = '已收录' + count + '个'
        $("#included").append(htmlStr)
    })();

    function RandomColor() {
        let r, g, b;
        r = Math.floor(Math.random() * 256);
        g = Math.floor(Math.random() * 256);
        b = Math.floor(Math.random() * 256);
        return "rgb(" + r + ',' + g + ',' + b + ")";
    }
})