// const https = require('https')
import https from 'https'
import http from 'http'
import cheerio from 'cheerio'
import fs, { link } from 'fs'
import request from 'request'
import path, { resolve } from 'path'

// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
const WEBSITE = [
  {
    name: '首页',
    icon: 'icon-home-fill',
    linkList: [],
  },
  {
    name: '社区博客',
    icon: 'icon-shequ',
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
        link: 'http://zoo.zhengcaiyun.cn/',
      },
      {
        name: 'HelloWorld',
        link: 'https://www.helloworld.net/',
      },
      {
        name: '阮一峰',
        link: 'https://www.ruanyifeng.com/blog/',
      },
    ],
  },
  {
    name: '工具文档',
    icon: 'icon-wxbgongju',
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
        name: '插画2',
        link: 'https://www.manypixels.co/gallery',
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
        name: '在线JS环境',
        link: 'https://stackblitz.com/',
      },
      {
        name: 'netlify静态资源',
        link: 'https://app.netlify.com/sites',
      },
    ],
  },
  {
    name: '框架文档',
    icon: 'icon-wenjian',
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
      {
        name: 'sveltejs',
        link: 'https://www.sveltejs.cn/docs',
      },
      {
        name: '飞冰',
        link: 'https://ice.work/',
      },
    ],
  },
  {
    name: '躺平工具',
    icon: 'icon-gongju1',
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
        name: 'cdnjs',
        link: 'https://cdnjs.com/',
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
      {
        name: '画板',
        link: 'https://excalidraw.com/',
      },
      {
        name: 'loading.io',
        link: 'https://loading.io/animation/icon/',
      },
      {
        name: 'canisuse',
        link: 'https://caniuse.com/',
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
      {
        name: '产品经理导航',
        link: 'https://www.pmbaobao.com/',
      },
      {
        name: '程序员的乐趣',
        link: 'https://www.webhek.com/',
      },
      {
        name: '免费接口-韩小韩',
        link: 'https://api.vvhan.com/',
      },
      {
        name: '免费接口-夏柔',
        link: 'https://api.aa1.cn/',
      },
    ],
  },
  {
    name: '世间百态',
    icon: 'icon-life',
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
      {
        name: '即时热榜',
        link: 'http://www.jsrank.cn/c/news.html',
      },
    ],
  },
]

const down = async (host, filename) => {
  // https://zj.v.api.aa1.cn/api/ico/?url=www.wpon.cn

  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(host)
  //   }, 3000)
  // })
  setTimeout(() => {
    let url = `https://api.vvhan.com/api/ico?url=${host}`
    console.log('url', url)
    request.head(url, function (err, res, body) {
      request(url).pipe(fs.createWriteStream('./download/' + filename))
    })
  }, 3000)
}

const urlReg = new RegExp(/(\w+):\/\/([^/:]+)(:\d*)?/)
const reg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/

for (let i = 0; i < WEBSITE.length; i++) {
  const linkList = WEBSITE[i].linkList
  for (let j = 0; j < linkList.length; j++) {
    const linkItem = WEBSITE[i].linkList[j]
    // console.log('linkItem', linkItem)
    const host = linkItem.link.match(reg)[0]
    let a = await down(host, `${linkItem.name}.png`)
  }
}

// WEBSITE.forEach((el) => {
//   el.linkList.forEach(async (linkItem) => {
//     const host = linkItem.link.match(reg)[0]
//     let a = await down(host)
//     console.log('a', a)
//   })
// })

// WEBSITE.map((el) => {
//   el.linkList.map(async (linkItem) => {
//     // console.log(object);
//     const host = linkItem.link.match(urlReg)[0]
//     // setTimeout(() => {
//     //   // getImage(linkItem.link, linkItem.name)
//     //   console.log('host', host)
//     // }, 3000)
//     let a = await down(host)
//     console.log('a', a)
//     // console.log('host', `${host}/favicon.ico`)
//     // request.get(`${host}/favicon.ico`).pipe(fs.createWriteStream(`download/${linkItem.name}.png`))
//   })
// })

function download(url, dir, filename) {
  //得到扩展名
  var extname = path.extname(url)
  if (extname === '.jpg' || extname === '.png' || extname === 'gif' || extname === 'svg') {
    console.log('url: ', url)
    request.head(url, function (err, res, body) {
      request(url).pipe(fs.createWriteStream(dir + '/' + filename))
    })
  }
}

function getImage(siteLink, siteName) {
  console.log('siteLink', siteLink)
  let request = /https/.test(siteLink) ? https : http
  request.get(siteLink, function (res) {
    // 分段返回的 自己拼接
    let html = ''
    // 有数据产生的时候 拼接
    res.on('data', function (chunk) {
      html += chunk
    })
    // 拼接完成
    res.on('end', function () {
      const $ = cheerio.load(html)
      // console.log($('link'))
      // $('link').find((item) => {
      //   console.log(item)
      // })
      let img = null
      $('link').each(function () {
        let srcUrl = $(this).attr('href')
        if (/svg|png|ico/.test(srcUrl)) {
          // console.log(srcUrl)
          img = srcUrl
          download(srcUrl, `./download/${siteName}`, 'icon' + path.extname(srcUrl))
        }
      })
      if (!img) {
        $('img').each(function () {
          let srcUrl = $(this).attr('src')
          if (/svg|png|ico/.test(srcUrl)) {
            // console.log(srcUrl)
            download(srcUrl, `./download/${siteName}`, 'icon' + path.extname(srcUrl))
          }
        })
      }
    })
  })
}
