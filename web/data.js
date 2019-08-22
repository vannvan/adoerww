/*
* @Author: vannvan <https://github.com/vannvan>
* @Date:   2019-08-22 14:26:15
* @Last Modified by:   vannvan
* @Last Modified time: 2019-08-22 14:26:29
*/
$(document).ready(function(){
    const FAVOURITE = [
      {name:"Github",link:"https://github.com/"},
      {name:"Gitee",link:"https://gitee.com/wwya"},
      {name:"Oschina",link:'https://www.oschina.net/'},
      {name:'segmentfault',link:'https://segmentfault.com/'},
      {name:'脚本之家',link:'http://www.jb51.net/'},
      {name:'掘金',link:'https://juejin.im/timeline'},
      {name:'codepen',link:'http://codepen.io/'},
      {name:'前端精选',link:'http://top.html.cn/'},
      {name:'博客园',link:'https://www.cnblogs.com/'},
      {name:'element',link:'https://element.eleme.cn/#/zh-CN/component/table'},
      {name:'vux',link:'https://doc.vux.li/zh-CN/components/x-input.html'},
      {name:'moment',link:'http://momentjs.cn/docs/#/parsing/string-format/'},
      {name:'Gulp',link:'https://www.w3cschool.cn/qtaitm/1cvdkozt.html'},
      {name:'iview',link:'https://www.iviewui.com/docs/guide/install'},
      {name:'react',link:'http://caibaojian.com/react/'},
      {name:"webpack",link:'https://www.webpackjs.com/concepts/'},
      {name:'ES6文档',link:'http://es6.ruanyifeng.com/#docs/intro'},
      {name:'jquery中文',link:'http://jquery.cuishifeng.cn/'},
      {name:'bootCDN',link:'https://www.bootcdn.cn/api/#about'},
      {name:'explore',link:'https://github.com/vannvan/web-explore-demo'},
      {name:'archives',link:'https://github.com/vannvan/archives'}

    ]
    const TOOL = [
      {name:"草料二维码",link:"http://cli.im/url"},
      {name:'Fontawesome',link:'http://www.fontawesome.com.cn/'},
      {name:'程序员工具',link:'http://www.bejson.com/ui/phonesize/'},
      {name:'程序员工具2',link:'https://tool.lu/'},
      {name:'徽章制作',link:'https://badgen.net/'},
      {name:'图标定制',link:'http://www.shouce.ren/tool/tubiao'},
      {name:'icomoon',link:'https://icomoon.io/app/#/select'},
      {name:"草料二维码",link:'http://cli.im/url'},
      {name:'阿里图标库',link:'https://www.iconfont.cn/'},
      {name:'Bejson',link:'http://www.bejson.com/'},
      {name:'徽章制作1',link:'https://shields.io/#/'},
      {name:'在线压缩png',link:'https://compresspng.com/zh/'}
    ]

    const OTHER = [
      {name:"天猫",link:"https://www.tmall.com/"},
      {name:'京东',link:'https://www.jd.com'},
      {name:"网易云",link:'https://music.163.com/'},
      {name:'网易严选',link:'http://you.163.com/'},
      {name:'QQ邮箱',link:'https://mail.qq.com/'},
      {name:"微云",link:'https://www.weiyun.com/'},
      {name:"Google邮箱",link:'https://mail.google.com/'}
    ]
    buildList('Favourite',FAVOURITE)
    buildList('Tool',TOOL)
    buildList('Other',OTHER)

    function buildList(elName,dataList) {
      var htmlStr = ''
      for (let i=0;i<dataList.length;i++){
         htmlStr += `<li class="link"><a target="view_window" style='color:${RandomColor()}' href="${dataList[i].link}">${dataList[i].name}</a></li>`
      }
      $("."+elName).append(htmlStr)
    }
    function RandomColor() {
           let r, g, b;
           r = Math.floor(Math.random() * 256);
           g = Math.floor(Math.random() * 256);
           b = Math.floor(Math.random() * 256);
           return "rgb(" +r + ',' +g+ ',' +b+ ")";
    }
  })