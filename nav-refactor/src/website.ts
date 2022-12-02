import bbs from './source/bbs'
import home from './source/home'
import tools from './source/tools'
import document from './source/document'

const WEBSITE: TWebsite[] = [
  home,
  bbs,
  tools,
  document,
  {
    name: '躺平工具',
    icon: 'icon-gongju1',
    linkList: [
      {
        name: 'GitMind',
        link: 'https://gitmind.cn/app/template',
        logo: './logo/GitMind.png',
      },
      {
        name: '图床',
        link: 'https://imgchr.com/',
        logo: './logo/图床.png',
      },
      {
        name: '虫洞栈',
        link: 'http://book.bugstack.cn/',
        logo: null,
      },
      {
        name: 'Unicode字符',
        link: 'https://unicode-table.com/cn/',
        logo: null,
      },
      {
        name: '草料二维码',
        link: 'http://cli.im/url',
        logo: './logo/草料二维码.png',
      },
      {
        name: '程序员工具',
        link: 'http://www.bejson.com/ui/phonesize/',
        logo: null,
      },
      {
        name: '程序员工具2',
        link: 'https://tool.lu/',
        logo: './logo/程序员工具2.png',
      },
      {
        name: '徽章制作',
        link: 'https://badgen.net/',
        logo: './logo/徽章制作.png',
      },
      {
        name: '草料二维码',
        link: 'http://cli.im/url',
        logo: './logo/草料二维码.png',
      },
      {
        name: 'Bejson',
        link: 'http://www.bejson.com/',
        logo: null,
      },
      {
        name: 'Mock-api',
        link: 'http://mock-api.com/app.html#!/',
        logo: null,
      },
      {
        name: 'Easy-mock',
        link: 'https://www.easy-mock.com/',
        logo: null,
      },
      {
        name: 'Faker数据模拟',
        link: 'https://github.com/marak/Faker.js/',
        logo: './logo/Faker数据模拟.png',
      },
      {
        name: '移动端调试',
        link: 'https://github.com/wuchangming/spy-debugger',
        logo: './logo/移动端调试.png',
      },
      {
        name: '图标下载',
        link: 'https://www.easyicon.net/',
        logo: null,
      },
      {
        name: 'css在线选择器',
        link: 'https://www.haorooms.com/tools/css_selecter/',
        logo: null,
      },
      {
        name: 'bootCDN',
        link: 'https://www.bootcdn.cn/',
        logo: './logo/bootCDN.png',
      },
      {
        name: 'cdnjs',
        link: 'https://cdnjs.com/',
        logo: './logo/cdnjs.png',
      },
      {
        name: '在线抠图',
        link: 'https://www.remove.bg/zh/upload',
        logo: './logo/在线抠图.png',
      },
      {
        name: 'wulihub静态托管',
        link: 'https://www.wulihub.com.cn/store/my_space',
        logo: './logo/wulihub静态托管.png',
      },
      {
        name: '阿里imgcook',
        link: 'https://www.imgcook.com/dsl',
        logo: './logo/阿里imgcook.png',
      },
      {
        name: 'sentry',
        link: 'https://sentry.io/',
        logo: null,
      },
      {
        name: '纯CSS小图标',
        link: 'https://www.zhangxinxu.com/sp/icon/css.php',
        logo: './logo/纯CSS小图标.png',
      },
      {
        name: 'sublime主题',
        link: 'http://tmtheme-editor.herokuapp.com/#!/editor/theme/Monokai',
        logo: './logo/sublime主题.png',
      },
      {
        name: 'github1s',
        link: 'https://github1s.com/ant-design/ant-design/',
        logo: null,
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
        logo: './logo/在线压缩png.png',
      },
      {
        name: '徽章制作1',
        link: 'https://shields.io/#/',
        logo: null,
      },
      {
        name: '截图工具',
        link: 'https://zh.snipaste.com',
        logo: null,
      },
      {
        name: '全能转换',
        link: 'https://cn.office-converter.com/',
        logo: './logo/全能转换.png',
      },
      {
        name: 'gif录屏工具',
        link: 'https://www.screentogif.com/',
        logo: null,
      },
      {
        name: '减压神器',
        link: 'https://aidn.jp/mikutap/',
        logo: './logo/减压神器.png',
      },
      {
        name: '无聊',
        link: 'https://thatsthefinger.com/',
        logo: null,
      },
      {
        name: '神奇',
        link: 'http://www.koalastothemax.com/',
        logo: './logo/神奇.png',
      },
      {
        name: '无用的网站',
        link: 'https://theuselessweb.com/',
        logo: './logo/无用的网站.png',
      },
      {
        name: 'CSS渐变色',
        link: 'http://color.oulu.me/',
        logo: './logo/CSS渐变色.png',
      },
      {
        name: '解压',
        link: 'http://findingho.me/',
        logo: null,
      },
      {
        name: '观察星系',
        link: 'http://stars.chromeexperiments.com/',
        logo: './logo/观察星系.png',
      },
      {
        name: '画板',
        link: 'https://excalidraw.com/',
        logo: null,
      },
      {
        name: 'loading.io',
        link: 'https://loading.io/animation/icon/',
        logo: './logo/loading.io.png',
      },
      {
        name: 'canisuse',
        link: 'https://caniuse.com/',
        logo: './logo/canisuse.png',
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
        logo: './logo/JQ插件库.png',
      },
      {
        name: 'CTOlib码库',
        link: 'https://www.ctolib.com/',
        logo: null,
      },
      {
        name: 'icomoon',
        link: 'https://icomoon.io/app/#/select',
        logo: './logo/icomoon.png',
      },
      {
        name: 'Fontawesome',
        link: 'http://www.fontawesome.com.cn/',
        logo: null,
      },
      {
        name: '阿里图标库',
        link: 'https://www.iconfont.cn/',
        logo: './logo/阿里图标库.png',
      },
      {
        name: 'jquery之家',
        link: 'http://www.htmleaf.com/',
        logo: './logo/jquery之家.png',
      },
      {
        name: '前端知识体系xmind',
        link: 'https://www.xmind.net/m/NkQc/',
        logo: './logo/前端知识体系xmind.png',
      },
      {
        name: 'techbrood',
        link: 'https://techbrood.com/',
        logo: './logo/techbrood.png',
      },
      {
        name: 'css动画在线',
        link: 'https://animista.net/play',
        logo: './logo/css动画在线.png',
      },
      {
        name: 'Animate',
        link: 'https://github.com/daneden/animate.css',
        logo: './logo/Animate.png',
      },
      {
        name: 'vivify',
        link: 'https://github.com/Martz90/vivify',
        logo: './logo/vivify.png',
      },
      {
        name: 'bootstrapmb',
        link: 'http://www.bootstrapmb.com/chajian/css3',
        logo: null,
      },
      {
        name: '天行数据',
        link: 'https://www.tianapi.com/',
        logo: './logo/天行数据.png',
      },
      {
        name: '免费开放接口',
        link: 'https://api.66mz8.com/',
        logo: './logo/免费开放接口.png',
      },
      {
        name: '在线生成字符图案',
        link: 'http://patorjk.com/software/taag/#p=display&f=Graffiti&t=Type%20Something%20',
        logo: null,
      },
      {
        name: '壁纸',
        link: 'https://wallhere.com/',
        logo: './logo/壁纸.png',
      },
      {
        name: 'emoji',
        link: 'https://www.emojiall.com/zh-hans/all-emojis',
        logo: './logo/emoji.png',
      },
      {
        name: '产品经理导航',
        link: 'https://www.pmbaobao.com/',
        logo: null,
      },
      {
        name: '程序员的乐趣',
        link: 'https://www.webhek.com/',
        logo: './logo/程序员的乐趣.png',
      },
      {
        name: '免费接口-韩小韩',
        link: 'https://api.vvhan.com/',
        logo: './logo/免费接口-韩小韩.png',
      },
      {
        name: '免费接口-夏柔',
        link: 'https://api.aa1.cn/',
        logo: null,
      },
      {
        name:"可画",
        link:"https://www.canva.cn/",
        logo:null
      }
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
        logo: null,
      },
      {
        name: '豆瓣FM',
        link: 'https://fm.douban.com/',
        logo: './logo/豆瓣FM.png',
      },
      {
        name: '网易严选',
        link: 'http://you.163.com/',
        logo: './logo/网易严选.png',
      },
      {
        name: 'QQ邮箱',
        link: 'https://mail.qq.com/',
        logo: './logo/QQ邮箱.png',
      },
      {
        name: '微云',
        link: 'https://www.weiyun.com/',
        logo: './logo/微云.png',
      },
      {
        name: 'Google邮箱',
        link: 'https://mail.google.com/',
        logo: null,
      },
      {
        name: 'wikiHow',
        link: 'https://zh.wikihow.com/%E9%A6%96%E9%A1%B5',
        logo: './logo/wikiHow.png',
      },
      {
        name: '即时热榜',
        link: 'http://www.jsrank.cn/c/news.html',
        logo: './logo/即时热榜.png',
      },
    ],
  },
]

export default WEBSITE
