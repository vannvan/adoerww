<<<<<<< HEAD
let msg =  '万头攒动火树银花之处不必找我。如欲相见，我在各种悲喜交集处，能做的只是长途跋涉的归真返璞-by木心'let timer = nullfunction titnimation() {  msg = msg.substring(1, msg.length) + msg.substring(0, 1)  document.title = msg}let hiddenProperty =  'hidden' in document ?  'hidden' :  'webkitHidden' in document ?  'webkitHidden' :  'mozHidden' in document ?  'mozHidden' :  nulllet visibilityChangeEvent = hiddenProperty.replace(  /hidden/i,  'visibilitychange')let onVisibilityChange = function() {  if (!document[hiddenProperty]) {    clearInterval(timer)    document.title = 'JUST DO　IT．．．'  } else {    timer = setInterval('titnimation()', 200)  }}document.addEventListener(visibilityChangeEvent, onVisibilityChange)$(document).ready(function() {  let currentHour = new Date().getHours()  let theme = currentHour < 19 ? 'light' : 'dark'  const HOVER_CLASS = [    'hvr-sweep-to-right',    'hvr-sweep-to-left',    'hvr-sweep-to-bottom',    'hvr-sweep-to-bottom',    'hvr-bounce-to-right',    'hvr-bounce-to-left',    'hvr-bounce-to-bottom',    'hvr-bounce-to-top',    'hvr-radial-out',    'hvr-rectangle-out',    'hvr-shutter-out-vertical',  ]  const THEME_COLOR = {    light: {      body: '#e7eff4',      fontColor: '#31c193',      linkFontColor: '#27ae60',      listBgColor: '#fff',      leftBarBgColor: '#fff',      rightTitleBgColor: '#fff',      rightLinkItemBgColor: 'rgba(255,255,255,0.8)',      inputColor: '#27ae60',    },    dark: {      body: '#434343',      fontColor: '#fff',      listBgColor: '#434343',      linkFontColor: '#FFFFE0',      leftBarBgColor: '#242424',      rightTitleBgColor: '#242424',      rightLinkItemBgColor: 'rgba(36,36,36,0.8)',      inputColor: '#09c',    },  }  function initTheme(theme) {    $('body').css({ background: THEME_COLOR[theme].body })    $('.left-nav').css({      background: THEME_COLOR[theme].leftBarBgColor,      color: THEME_COLOR[theme].fontColor,    }) //左侧栏    $('.title').css({      background: THEME_COLOR[theme].rightLinkItemBgColor,      color: THEME_COLOR[theme].fontColor,    }) //右侧导航标题    $('.link-item').css({      background: THEME_COLOR[theme].rightLinkItemBgColor,      color: THEME_COLOR[theme].linkFontColor,    })    $('.iconfont').css(      Object.assign({ color: THEME_COLOR[theme].fontColor },        theme == 'dark' ? transform(0) : transform(90)      )    )    // 输入框样式    $('#input').css({      'border-color': THEME_COLOR[theme].inputColor,      color: THEME_COLOR[theme].fontColor,    })    $('#search-btn').css('background', THEME_COLOR[theme].inputColor)  }  function transform(rotate) {    return { transform: `rotate(${rotate}deg)` }  }  const WEBSITE = [{      name: '社区博客',      icon: 'icon-bokexinwen',      linkList: [{          name: 'Github',          link: 'https://github.com/',        },        {          name: 'Gitee',          link: 'https://gitee.com/wwya',        },        {          name: 'Oschina',          link: 'https://www.oschina.net/',        },        {          name: 'segmentfault',          link: 'https://segmentfault.com/',        },        {          name: '脚本之家',          link: 'http://www.jb51.net/',        },        {          name: '掘金',          link: 'https://juejin.im/timeline',        },        {          name: 'codepen',          link: 'http://codepen.io/',        },        {          name: '前端精选',          link: 'http://top.html.cn/',        },        {          name: '博客园',          link: 'https://www.cnblogs.com/',        },        {          name: '国外某大神',          link: 'https://dmitripavlutin.com/',        },        {          name: '张鑫旭',          link: 'https://www.zhangxinxu.com',        },        {          name: 'W3cplus',          link: 'https://www.w3cplus.com/',        },        {          name: '程序园',          link: 'http://www.voidcn.com/column/web',        },        {          name: 'Aaron的博客',          link: 'https://www.haorooms.com/',        },        {          name: '木易杨博客',          link: 'https://muyiy.cn/',        },        {          name: '技术胖',          link: 'https://jspang.com/',        },        {          name: '技术导航',          link: 'https://iiter.cn/',        },        {          name: '珠峰架构Vue.js',          link: 'http://www.zhufengpeixun.cn/train/vue-info/component.html',        },        {          name: '汤姆大叔-深入JS',          link: 'https://www.cnblogs.com/TomXu/archive/2011/12/15/2288411.html',        },        {          name: '前端内参',          link: 'https://coffe1891.gitbook.io/frontend-hard-mode-interview/1/1.2.6',        },        {          name: '奇舞周刊-优秀好文章',          link: 'https://weekly.75.team/',        },        {          name: 'css-tricks(国外技术栈)',          link: 'https://css-tricks.com/archives/',        },        {          name: '政采云',          link: "https://weekly.zoo.team/"        }      ],    },    {      name: '工具文档',      icon: 'icon-shiyongshouce',      linkList: [{          name: 'parcel',          link: 'https://zh.parceljs.org/getting_started.html',        },        {          name: 'Moment',          link: 'http://momentjs.cn/docs/#/parsing/string-format/',        },        {          name: 'Gulp',          link: 'https://www.w3cschool.cn/qtaitm/1cvdkozt.html',        },        {          name: 'Webpack',          link: 'https://www.webpackjs.com/concepts/',        },        {          name: 'ES6文档',          link: 'http://es6.ruanyifeng.com/#docs/intro',        },        {          name: 'jquery中文',          link: 'http://jquery.cuishifeng.cn/',        },        {          name: 'Archives',          link: 'https://github.com/vannvan/archives',        },        {          name: 'css手册',          link: 'http://css.cuishifeng.cn/',        },        {          name: 'C3.JS图表',          link: 'https://c3js.org/',        },        {          name: 'umi方案',          link: 'https://umijs.org/zh/guide/',        },        {          name: 'ZEIT静态网站',          link: 'https://zeit.co/dashboard',        },        {          name: '腾讯云开发者文档',          link: 'https://cloud.tencent.com/developer/section/1490167',        },        {          name: 'md美化',          link: 'https://mdnice.com/',        },        {          name: '前端开发者手册',          link: 'https://dwqs.gitbooks.io/frontenddevhandbook/content/',        },        {          name: 'hexo博客模板',          link: 'https://hexo.io/',        },        {          name: 'echarts实例',          link: 'https://www.makeapie.com/explore.html',        },        {          name: '动画插件',          link: 'https://www.tweenmax.com.cn/',        },        {          name: '可商用插画',          link: 'https://undraw.co/illustrations',        },        {          name: '现代JavaScript教程',          link: 'https://zh.javascript.info/',        },        {          name: "markdown编辑器",          link: 'https://pandao.github.io/editor.md/'        },        {          name: "ramdajs函数库",          link: "https://ramdajs.com/"        }      ],    },    {      name: '框架文档',      icon: 'icon-bangzhushouce',      linkList: [{          name: 'Element',          link: 'https://element.eleme.cn/#/zh-CN/component/table',        },        {          name: 'Vux',          link: 'https://doc.vux.li/zh-CN/components/x-input.html',        },        {          name: 'iview',          link: 'https://www.iviewui.com/docs/guide/install',        },        {          name: 'React',          link: 'http://caibaojian.com/react/',        },        {          name: 'Ant-Design',          link: 'https://ant.design/docs/react/introduce-cn',        },        {          name: 'taro多端框架',          link: 'https://taro.aotu.io',        },        {          name: 'next.js',          link: 'https://nextjs.frontendx.cn/',        },        {          name: 'antv',          link: 'https://antv.vision/zh#products',        },        {          name: 'nuxt',          link: 'https://www.nuxtjs.cn/guide',        },        {          name: '前端面试之道',          link: 'http://caibaojian.com/interview-map/frontend/',        },        {          name: 'nest.js',          link: 'https://exlley.gitbooks.io/nest-js/content/chapter1/di-yi-ge-kong-zhi-qi.html',        },      ],    },    {      name: '躺平工具',      icon: 'icon-ai-tool',      linkList: [{          name: "GitMind",          link: 'https://gitmind.cn/app/template'        },        {          name: '图床',          link: 'https://imgchr.com/',        },        {          name: '虫洞栈',          link: 'http://book.bugstack.cn/',        },        {          name: 'Unicode字符百科',          link: 'https://unicode-table.com/cn/',        },        {          name: '草料二维码',          link: 'http://cli.im/url',        },        {          name: '程序员工具',          link: 'http://www.bejson.com/ui/phonesize/',        },        {          name: '程序员工具2',          link: 'https://tool.lu/',        },        {          name: '徽章制作',          link: 'https://badgen.net/',        },        {          name: '草料二维码',          link: 'http://cli.im/url',        },        {          name: 'Bejson',          link: 'http://www.bejson.com/',        },        {          name: 'Mock-api',          link: 'http://mock-api.com/app.html#!/',        },        {          name: 'Easy-mock',          link: 'https://www.easy-mock.com/',        },        {          name: 'Faker数据模拟',          link: 'https://github.com/marak/Faker.js/',        },        {          name: '移动端调试',          link: 'https://github.com/wuchangming/spy-debugger',        },        {          name: '图标下载',          link: 'https://www.easyicon.net/',        },        {          name: 'css在线选择器',          link: 'https://www.haorooms.com/tools/css_selecter/',        },        {          name: 'bootCDN',          link: 'https://www.bootcdn.cn/',        },        {          name: '在线抠图',          link: 'https://www.remove.bg/zh/upload',        },        {          name: 'wulihub静态托管',          link: 'https://www.wulihub.com.cn/store/my_space',        },        {          name: '阿里imgcook',          link: 'https://www.imgcook.com/dsl',        },        {          name: 'sentry-web监控工具',          link: 'https://sentry.io/',        },        {          name: '纯CSS小图标',          link: 'https://www.zhangxinxu.com/sp/icon/css.php',        },        {          name: "sublime主题",          link: 'http://tmtheme-editor.herokuapp.com/#!/editor/theme/Monokai'        }      ],    },    {      name: '减负工具',      icon: 'icon-gongju',      linkList: [{          name: '在线压缩png',          link: 'https://compresspng.com/zh/',        },        {          name: '徽章制作1',          link: 'https://shields.io/#/',        },        {          name: '截图工具',          link: 'https://zh.snipaste.com',        },        {          name: '全能转换',          link: 'https://cn.office-converter.com/',        },        {          name: 'gif录屏工具',          link: 'https://www.screentogif.com/',        },        {          name: '减压神器',          link: 'https://aidn.jp/mikutap/',        },        {          name: '无聊',          link: 'https://thatsthefinger.com/',        },        {          name: '神奇',          link: 'http://www.koalastothemax.com/',        },        {          name: '无用的网站',          link: 'https://theuselessweb.com/',        },        {          name: 'CSS渐变色',          link: 'http://color.oulu.me/',        },        {          name: "解压",          link: 'http://findingho.me/'        },        {          name: "观察星系",          link: "http://stars.chromeexperiments.com/"        }      ],    },    {      name: '硬核资源',      icon: 'icon-ziyuan',      linkList: [{          name: 'JQ插件库',          link: 'http://www.jq22.com',        },        {          name: 'CTOlib码库',          link: 'https://www.ctolib.com/',        },        {          name: 'icomoon',          link: 'https://icomoon.io/app/#/select',        },        {          name: 'Fontawesome',          link: 'http://www.fontawesome.com.cn/',        },        {          name: '阿里图标库',          link: 'https://www.iconfont.cn/',        },        {          name: 'jquery之家',          link: 'http://www.htmleaf.com/',        },        {          name: '前端知识体系xmind',          link: 'https://www.xmind.net/m/NkQc/',        },        {          name: 'techbrood',          link: 'https://techbrood.com/',        },        {          name: 'css动画在线',          link: 'https://animista.net/play',        },        {          name: 'Animate',          link: 'https://github.com/daneden/animate.css',        },        {          name: 'vivify',          link: 'https://github.com/Martz90/vivify',        },        {          name: 'bootstrapmb',          link: 'http://www.bootstrapmb.com/chajian/css3',        },        {          name: '天行数据',          link: 'https://www.tianapi.com/',        },        {          name: '免费开放接口',          link: 'https://api.66mz8.com/',        },        {          name: '在线生成字符图案',          link: 'http://patorjk.com/software/taag/#p=display&f=Graffiti&t=Type%20Something%20',        },        {          name: '壁纸',          link: 'https://wallhere.com/',        },        {          name: "emoji",          link: 'https://www.emojiall.com/zh-hans/all-emojis'        }      ],    },    {      name: '世间百态',      icon: 'icon-yinleyule',      linkList: [{          name: '天猫',          link: 'https://www.tmall.com/',        },        {          name: '京东',          link: 'https://www.jd.com',        },        {          name: '豆瓣FM',          link: 'https://fm.douban.com/',        },        {          name: '网易严选',          link: 'http://you.163.com/',        },        {          name: 'QQ邮箱',          link: 'https://mail.qq.com/',        },        {          name: '微云',          link: 'https://www.weiyun.com/',        },        {          name: 'Google邮箱',          link: 'https://mail.google.com/',        },        {          name: "wikiHow",          link: 'https://zh.wikihow.com/%E9%A6%96%E9%A1%B5'        }      ],    },  ]  ;  (function() {    let elStr = ''    $.each(WEBSITE, (index) => {      elStr = `<div id="${WEBSITE[index].name}" class="webBox"></div>`      $('.website').append(elStr)      buildList(WEBSITE[index].name, WEBSITE[index].linkList)    })  })();  (function() {    let htmlStr = ''    $.each(WEBSITE, (index) => {      htmlStr += `<li onClick="window.location.href='#${WEBSITE[index].name}'"><i class="iconfont ${WEBSITE[index].icon}"></i><a>${WEBSITE[index].name}</li>`    })    $('.link-box').append(htmlStr)    $('.left-nav').animate({        opacity: 1,      },      'slow'    )    $('.logo img').animate({      height: '60px',    })  })()  function buildList(elName, dataList) {    let htmlStr = `<div class="title">${elName}</div>`    $.each(dataList, (index) => {      let className =        HOVER_CLASS[Math.floor(Math.random() * HOVER_CLASS.length)] //随机      htmlStr += `<li class="link-item ${className}" onClick="window.open('${dataList[index].link}','_blank')" ><a target="view_window">${dataList[index].name}</a></li>`    })    if (dataList.length % 5 != 0) {      for (let i = 0; i < Math.abs((dataList.length % 5) - 5); i++) {        htmlStr += '<li class="empty"></li>'      }    }    $('#' + elName).append(htmlStr)    $('.search').animate({      opacity: 1,    })    $('#' + elName).animate({        width: '100%',        height: '+=100%',        opacity: 1,      },      'slow'    )  };  (function() {    let count = 0    WEBSITE.map((el) => {      el.linkList.map((subEl) => {        count++      })    })    let htmlStr = '已收录' + count + '个'    $('#included').append(htmlStr)  })()  initTheme(theme)  $('.icon-mingan').click(function() {    theme = theme == 'dark' ? 'light' : 'dark'    initTheme(theme)  })  function RandomColor() {    let r, g, b    r = Math.floor(Math.random() * 256)    g = Math.floor(Math.random() * 256)    b = Math.floor(Math.random() * 256)    return 'rgb(' + r + ',' + g + ',' + b + ')'  }})
=======
let msg =
  '万头攒动火树银花之处不必找我。如欲相见，我在各种悲喜交集处，能做的只是长途跋涉的归真返璞-by木心'
let timer = null

function titnimation() {
  msg = msg.substring(1, msg.length) + msg.substring(0, 1)
  document.title = msg
}
let hiddenProperty =
  'hidden' in document
    ? 'hidden'
    : 'webkitHidden' in document
    ? 'webkitHidden'
    : 'mozHidden' in document
    ? 'mozHidden'
    : null
let visibilityChangeEvent = hiddenProperty.replace(
  /hidden/i,
  'visibilitychange'
)
let onVisibilityChange = function () {
  if (!document[hiddenProperty]) {
    clearInterval(timer)
    document.title = 'JUST DO　IT．．．'
  } else {
    timer = setInterval('titnimation()', 200)
  }
}
document.addEventListener(visibilityChangeEvent, onVisibilityChange)
$(document).ready(function () {
  let currentHour = new Date().getHours()
  let theme = currentHour < 19 ? 'light' : 'dark'
  const HOVER_CLASS = [
    'hvr-sweep-to-right',
    'hvr-sweep-to-left',
    'hvr-sweep-to-bottom',
    'hvr-sweep-to-bottom',
    'hvr-bounce-to-right',
    'hvr-bounce-to-left',
    'hvr-bounce-to-bottom',
    'hvr-bounce-to-top',
    'hvr-radial-out',
    'hvr-rectangle-out',
    'hvr-shutter-out-vertical',
  ]

  const THEME_COLOR = {
    light: {
      body: '#e7eff4',
      fontColor: '#31c193',
      linkFontColor: '#27ae60',
      listBgColor: '#fff',
      leftBarBgColor: '#fff',
      rightTitleBgColor: '#fff',
      rightLinkItemBgColor: 'rgba(255,255,255,0.8)',
      inputColor: '#27ae60',
    },
    dark: {
      body: '#434343',
      fontColor: '#fff',
      listBgColor: '#434343',
      linkFontColor: '#FFFFE0',
      leftBarBgColor: '#242424',
      rightTitleBgColor: '#242424',
      rightLinkItemBgColor: 'rgba(36,36,36,0.8)',
      inputColor: '#09c',
    },
  }

  function initTheme(theme) {
    $('body').css({ background: THEME_COLOR[theme].body })
    $('.left-nav').css({
      background: THEME_COLOR[theme].leftBarBgColor,
      color: THEME_COLOR[theme].fontColor,
    }) //左侧栏
    $('.title').css({
      background: THEME_COLOR[theme].rightLinkItemBgColor,
      color: THEME_COLOR[theme].fontColor,
    }) //右侧导航标题
    $('.link-item').css({
      background: THEME_COLOR[theme].rightLinkItemBgColor,
      color: THEME_COLOR[theme].linkFontColor,
    })
    $('.iconfont').css(
      Object.assign(
        { color: THEME_COLOR[theme].fontColor },
        theme == 'dark' ? transform(0) : transform(90)
      )
    )
    // 输入框样式
    $('#input').css({
      'border-color': THEME_COLOR[theme].inputColor,
      color: THEME_COLOR[theme].fontColor,
    })
    $('#search-btn').css('background', THEME_COLOR[theme].inputColor)
  }

  function transform(rotate) {
    return { transform: `rotate(${rotate}deg)` }
  }

  const WEBSITE = [
    {
      name: '社区博客',
      icon: 'icon-bokexinwen',
      linkList: [
        {
          name: 'Github',
          link: 'https://github.com/',
        },
        {
          name: 'Gitee',
          link: 'https://gitee.com/wwya',
        },
        {
          name: 'Oschina',
          link: 'https://www.oschina.net/',
        },
        {
          name: 'segmentfault',
          link: 'https://segmentfault.com/',
        },
        {
          name: '脚本之家',
          link: 'http://www.jb51.net/',
        },
        {
          name: '掘金',
          link: 'https://juejin.im/timeline',
        },
        {
          name: 'codepen',
          link: 'http://codepen.io/',
        },
        {
          name: '前端精选',
          link: 'http://top.html.cn/',
        },
        {
          name: '博客园',
          link: 'https://www.cnblogs.com/',
        },
        {
          name: '国外某大神',
          link: 'https://dmitripavlutin.com/',
        },
        {
          name: '张鑫旭',
          link: 'https://www.zhangxinxu.com',
        },
        {
          name: 'W3cplus',
          link: 'https://www.w3cplus.com/',
        },
        {
          name: '程序园',
          link: 'http://www.voidcn.com/column/web',
        },
        {
          name: 'Aaron的博客',
          link: 'https://www.haorooms.com/',
        },
        {
          name: '木易杨博客',
          link: 'https://muyiy.cn/',
        },
        {
          name: '技术胖',
          link: 'https://jspang.com/',
        },
        {
          name: '技术导航',
          link: 'https://iiter.cn/',
        },
        {
          name: '珠峰架构Vue.js',
          link: 'http://www.zhufengpeixun.cn/train/vue-info/component.html',
        },
        {
          name: '汤姆大叔-深入JS',
          link: 'https://www.cnblogs.com/TomXu/archive/2011/12/15/2288411.html',
        },
        {
          name: '前端内参',
          link: 'https://coffe1891.gitbook.io/frontend-hard-mode-interview/1/1.2.6',
        },
        {
          name: '奇舞周刊-优秀好文章',
          link: 'https://weekly.75.team/',
        },
        {
          name: 'css-tricks(国外技术栈)',
          link: 'https://css-tricks.com/archives/',
        },
        {
          name: '政采云',
          link: 'https://weekly.zoo.team/',
        },
      ],
    },
    {
      name: '工具文档',
      icon: 'icon-shiyongshouce',
      linkList: [
        {
          name: 'parcel',
          link: 'https://zh.parceljs.org/getting_started.html',
        },
        {
          name: 'Moment',
          link: 'http://momentjs.cn/docs/#/parsing/string-format/',
        },
        {
          name: 'Gulp',
          link: 'https://www.w3cschool.cn/qtaitm/1cvdkozt.html',
        },
        {
          name: 'Webpack',
          link: 'https://www.webpackjs.com/concepts/',
        },
        {
          name: 'ES6文档',
          link: 'http://es6.ruanyifeng.com/#docs/intro',
        },
        {
          name: 'jquery中文',
          link: 'http://jquery.cuishifeng.cn/',
        },
        {
          name: 'Archives',
          link: 'https://github.com/vannvan/archives',
        },
        {
          name: 'css手册',
          link: 'http://css.cuishifeng.cn/',
        },
        {
          name: 'C3.JS图表',
          link: 'https://c3js.org/',
        },
        {
          name: 'umi方案',
          link: 'https://umijs.org/zh/guide/',
        },
        {
          name: 'ZEIT静态网站',
          link: 'https://zeit.co/dashboard',
        },
        {
          name: '腾讯云开发者文档',
          link: 'https://cloud.tencent.com/developer/section/1490167',
        },
        {
          name: 'md美化',
          link: 'https://mdnice.com/',
        },
        {
          name: '前端开发者手册',
          link: 'https://dwqs.gitbooks.io/frontenddevhandbook/content/',
        },
        {
          name: 'hexo博客模板',
          link: 'https://hexo.io/',
        },
        {
          name: 'echarts实例',
          link: 'https://gallery.echartsjs.com/explore.html',
        },
        {
          name: '动画插件',
          link: 'https://www.tweenmax.com.cn/',
        },
        {
          name: '可商用插画',
          link: 'https://undraw.co/illustrations',
        },
        {
          name: '现代JavaScript教程',
          link: 'https://zh.javascript.info/',
        },
        {
          name: 'markdown编辑器',
          link: 'https://pandao.github.io/editor.md/',
        },
        {
          name: 'ramdajs函数库',
          link: 'https://ramdajs.com/',
        },
        {
          name:"在线JS环境",
          link:'https://stackblitz.com/'
        }
      ],
    },
    {
      name: '框架文档',
      icon: 'icon-bangzhushouce',
      linkList: [
        {
          name: 'Element',
          link: 'https://element.eleme.cn/#/zh-CN/component/table',
        },
        {
          name: 'Vux',
          link: 'https://doc.vux.li/zh-CN/components/x-input.html',
        },
        {
          name: 'iview',
          link: 'https://www.iviewui.com/docs/guide/install',
        },
        {
          name: 'React',
          link: 'http://caibaojian.com/react/',
        },
        {
          name: 'Ant-Design',
          link: 'https://ant.design/docs/react/introduce-cn',
        },
        {
          name: 'taro多端框架',
          link: 'https://taro.aotu.io',
        },
        {
          name: 'next.js',
          link: 'https://nextjs.frontendx.cn/',
        },
        {
          name: 'antv',
          link: 'https://antv.vision/zh#products',
        },
        {
          name: 'nuxt',
          link: 'https://www.nuxtjs.cn/guide',
        },
        {
          name: '前端面试之道',
          link: 'http://caibaojian.com/interview-map/frontend/',
        },
        {
          name: 'nest.js',
          link: 'https://exlley.gitbooks.io/nest-js/content/chapter1/di-yi-ge-kong-zhi-qi.html',
        },
      ],
    },
    {
      name: '躺平工具',
      icon: 'icon-ai-tool',
      linkList: [
        {
          name: 'GitMind',
          link: 'https://gitmind.cn/app/template',
        },
        {
          name: '图床',
          link: 'https://imgchr.com/',
        },
        {
          name: '虫洞栈',
          link: 'http://book.bugstack.cn/',
        },
        {
          name: 'Unicode字符百科',
          link: 'https://unicode-table.com/cn/',
        },
        {
          name: '草料二维码',
          link: 'http://cli.im/url',
        },
        {
          name: '程序员工具',
          link: 'http://www.bejson.com/ui/phonesize/',
        },
        {
          name: '程序员工具2',
          link: 'https://tool.lu/',
        },
        {
          name: '徽章制作',
          link: 'https://badgen.net/',
        },
        {
          name: '草料二维码',
          link: 'http://cli.im/url',
        },
        {
          name: 'Bejson',
          link: 'http://www.bejson.com/',
        },
        {
          name: 'Mock-api',
          link: 'http://mock-api.com/app.html#!/',
        },
        {
          name: 'Easy-mock',
          link: 'https://www.easy-mock.com/',
        },
        {
          name: 'Faker数据模拟',
          link: 'https://github.com/marak/Faker.js/',
        },
        {
          name: '移动端调试',
          link: 'https://github.com/wuchangming/spy-debugger',
        },
        {
          name: '图标下载',
          link: 'https://www.easyicon.net/',
        },
        {
          name: 'css在线选择器',
          link: 'https://www.haorooms.com/tools/css_selecter/',
        },
        {
          name: 'bootCDN',
          link: 'https://www.bootcdn.cn/',
        },
        {
          name: '在线抠图',
          link: 'https://www.remove.bg/zh/upload',
        },
        {
          name: 'wulihub静态托管',
          link: 'https://www.wulihub.com.cn/store/my_space',
        },
        {
          name: '阿里imgcook',
          link: 'https://www.imgcook.com/dsl',
        },
        {
          name: 'sentry-web监控工具',
          link: 'https://sentry.io/',
        },
        {
          name: '纯CSS小图标',
          link: 'https://www.zhangxinxu.com/sp/icon/css.php',
        },
        {
          name: 'sublime主题',
          link: 'http://tmtheme-editor.herokuapp.com/#!/editor/theme/Monokai',
        },
        {
          name: 'github1s',
          link: 'https://github1s.com/ant-design/ant-design/',
        },
      ],
    },
    {
      name: '减负工具',
      icon: 'icon-gongju',
      linkList: [
        {
          name: '在线压缩png',
          link: 'https://compresspng.com/zh/',
        },
        {
          name: '徽章制作1',
          link: 'https://shields.io/#/',
        },
        {
          name: '截图工具',
          link: 'https://zh.snipaste.com',
        },
        {
          name: '全能转换',
          link: 'https://cn.office-converter.com/',
        },
        {
          name: 'gif录屏工具',
          link: 'https://www.screentogif.com/',
        },
        {
          name: '减压神器',
          link: 'https://aidn.jp/mikutap/',
        },
        {
          name: '无聊',
          link: 'https://thatsthefinger.com/',
        },
        {
          name: '神奇',
          link: 'http://www.koalastothemax.com/',
        },
        {
          name: '无用的网站',
          link: 'https://theuselessweb.com/',
        },
        {
          name: 'CSS渐变色',
          link: 'http://color.oulu.me/',
        },
        {
          name: '解压',
          link: 'http://findingho.me/',
        },
        {
          name: '观察星系',
          link: 'http://stars.chromeexperiments.com/',
        },
      ],
    },
    {
      name: '硬核资源',
      icon: 'icon-ziyuan',
      linkList: [
        {
          name: 'JQ插件库',
          link: 'http://www.jq22.com',
        },
        {
          name: 'CTOlib码库',
          link: 'https://www.ctolib.com/',
        },
        {
          name: 'icomoon',
          link: 'https://icomoon.io/app/#/select',
        },
        {
          name: 'Fontawesome',
          link: 'http://www.fontawesome.com.cn/',
        },
        {
          name: '阿里图标库',
          link: 'https://www.iconfont.cn/',
        },
        {
          name: 'jquery之家',
          link: 'http://www.htmleaf.com/',
        },
        {
          name: '前端知识体系xmind',
          link: 'https://www.xmind.net/m/NkQc/',
        },
        {
          name: 'techbrood',
          link: 'https://techbrood.com/',
        },
        {
          name: 'css动画在线',
          link: 'https://animista.net/play',
        },
        {
          name: 'Animate',
          link: 'https://github.com/daneden/animate.css',
        },
        {
          name: 'vivify',
          link: 'https://github.com/Martz90/vivify',
        },
        {
          name: 'bootstrapmb',
          link: 'http://www.bootstrapmb.com/chajian/css3',
        },
        {
          name: '天行数据',
          link: 'https://www.tianapi.com/',
        },
        {
          name: '免费开放接口',
          link: 'https://api.66mz8.com/',
        },
        {
          name: '在线生成字符图案',
          link: 'http://patorjk.com/software/taag/#p=display&f=Graffiti&t=Type%20Something%20',
        },
        {
          name: '壁纸',
          link: 'https://wallhere.com/',
        },
        {
          name: 'emoji',
          link: 'https://www.emojiall.com/zh-hans/all-emojis',
        },
      ],
    },
    {
      name: '世间百态',
      icon: 'icon-yinleyule',
      linkList: [
        {
          name: '天猫',
          link: 'https://www.tmall.com/',
        },
        {
          name: '京东',
          link: 'https://www.jd.com',
        },
        {
          name: '豆瓣FM',
          link: 'https://fm.douban.com/',
        },
        {
          name: '网易严选',
          link: 'http://you.163.com/',
        },
        {
          name: 'QQ邮箱',
          link: 'https://mail.qq.com/',
        },
        {
          name: '微云',
          link: 'https://www.weiyun.com/',
        },
        {
          name: 'Google邮箱',
          link: 'https://mail.google.com/',
        },
        {
          name: 'wikiHow',
          link: 'https://zh.wikihow.com/%E9%A6%96%E9%A1%B5',
        },
      ],
    },
  ]

  ;(function () {
    let elStr = ''
    $.each(WEBSITE, (index) => {
      elStr = `<div id="${WEBSITE[index].name}" class="webBox"></div>`
      $('.website').append(elStr)
      buildList(WEBSITE[index].name, WEBSITE[index].linkList)
    })
  })()
  ;(function () {
    let htmlStr = ''
    $.each(WEBSITE, (index) => {
      htmlStr += `<li onClick="window.location.href='#${WEBSITE[index].name}'"><i class="iconfont ${WEBSITE[index].icon}"></i><a>${WEBSITE[index].name}</li>`
    })
    $('.link-box').append(htmlStr)
    $('.left-nav').animate(
      {
        opacity: 1,
      },
      'slow'
    )
    $('.logo img').animate({
      height: '60px',
    })
  })()

  function buildList(elName, dataList) {
    let htmlStr = `<div class="title">${elName}</div>`
    $.each(dataList, (index) => {
      let className =
        HOVER_CLASS[Math.floor(Math.random() * HOVER_CLASS.length)] //随机
      htmlStr += `<li class="link-item ${className}" onClick="window.open('${dataList[index].link}','_blank')" ><a target="view_window">${dataList[index].name}</a></li>`
    })
    if (dataList.length % 5 != 0) {
      for (let i = 0; i < Math.abs((dataList.length % 5) - 5); i++) {
        htmlStr += '<li class="empty"></li>'
      }
    }
    $('#' + elName).append(htmlStr)
    $('.search').animate({
      opacity: 1,
    })
    $('#' + elName).animate(
      {
        width: '100%',
        height: '+=100%',
        opacity: 1,
      },
      'slow'
    )
  }
  ;(function () {
    let count = 0
    WEBSITE.map((el) => {
      el.linkList.map((subEl) => {
        count++
      })
    })
    let htmlStr = '已收录' + count + '个'
    $('#included').append(htmlStr)
  })()

  initTheme(theme)
  $('.icon-mingan').click(function () {
    theme = theme == 'dark' ? 'light' : 'dark'
    initTheme(theme)
  })

  function RandomColor() {
    let r, g, b
    r = Math.floor(Math.random() * 256)
    g = Math.floor(Math.random() * 256)
    b = Math.floor(Math.random() * 256)
    return 'rgb(' + r + ',' + g + ',' + b + ')'
  }
})


>>>>>>> dff01eeee02dbbeb8d9323877c008189468d95c0
