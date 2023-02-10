/*
 *项目名: 个人简历
 *创建者: Edit
 *创建时间:2020.2.15 20:40:41
 *联系方式:15622749328(微信同号)
 *描述: 酷炫个人简历
 */

let textArr = [
  {
    name: 'h2',
    class: 'inten',
    text: '求职意向：前端开发工程师',
  },
  {
    name: 'h4',
    class: 'text-title',
    text: '基本信息',
  },
  {
    name: 'div',
    class: 'base-info',
    children: [
      {
        name: 'div',
        children: [
          {
            name: 'div',
            text: '姓名：Edit',
          },
          {
            name: 'div',
            text: '年龄：23',
          },
        ],
      },
      {
        name: 'div',
        children: [
          {
            name: 'div',
            text: '毕业院校：中山大学南方学院',
          },
          {
            name: 'div',
            text: '联系电话：15622749328',
          },
        ],
      },
    ],
  },
  {
    name: 'h4',
    class: 'text-title',
    text: '教育背景',
  },
  {
    name: 'div',
    class: 'school',
    children: [
      {
        name: 'span',
        class: 'mr',
        text: '学校：中山大学南方学院',
      },
      {
        name: 'span',
        text: '专业：计算机科学与技术',
      },
      {
        name: 'div',
        text: '主修课程：HTML、CSS、JavaScript、Vue、JavaEE、MySQL',
      },
    ],
  },
  {
    name: 'h4',
    class: 'text-title',
    text: '专业技能',
  },
  {
    name: 'ul',
    class: 'ul-list',
    children: [
      {
        name: 'li',
        text: '熟练掌握',
        children: [
          {
            name: 'span',
            class: 'tag',
            text: 'H5、CSS3、ES6',
          },
        ],
      },
      {
        name: 'li',
        text: '能熟练运用不同主流UI框架ElementUI及多个移动端UI框架',
      },
      {
        name: 'li',
        text: '掌握前端主流',
        children: [
          {
            name: 'span',
            class: 'tag',
            text: 'Vue框架',
          },
        ],
      },
      {
        name: 'li',
        text: '熟练掌握',
        children: [
          {
            name: 'span',
            class: 'tag',
            text: 'H5混合APP开发',
          },
          {
            name: 'span',
            text: '，跨多端技术uni-app、apicloud',
          },
        ],
      },
      {
        name: 'li',
        text: '了解微信小程序开发',
      },
      {
        name: 'li',
        text: '熟悉后端语言Java、node.js',
      },
      {
        name: 'li',
        text: '熟悉',
        children: [
          {
            name: 'span',
            class: 'tag',
            text: 'css预处理器',
          },
          {
            name: 'span',
            text: 'sass、stylus以及前端构建工具webpack和npm包管理库',
          },
        ],
      },
    ],
  },
  {
    name: 'h4',
    class: 'text-title',
    text: '工作经历',
  },
  {
    name: 'div',
    class: 'work',
    children: [
      {
        name: 'span',
        class: 'mr',
        text: '2018.08 — 2019.06',
      },
      {
        name: 'span',
        text: 'web前端开发',
      },
    ],
  },
  {
    name: 'ul',
    class: 'ul-list',
    children: [
      {
        name: 'li',
        text: '担任公司前端技术部主管，负责',
        children: [
          {
            name: 'span',
            class: 'tag',
            text: '带领新人、项目安排、BUG解决、产品优化、定期开展技术交流会议',
          },
        ],
      },
      {
        name: 'li',
        text: '负责公司项目开发（web hybridApp、微信公众号H5），其他公司基础项目开发，如PC端商城，企业响应式网站，APP开发！',
      },
    ],
  },
  {
    name: 'h4',
    class: 'text-title',
    text: '项目经验',
  },
  {
    name: 'div',
    class: 'item-lv',
    children: [
      {
        name: 'ul',
        class: 'ul-list',
        children: [
          {
            name: 'li',
            class: 'project-title',
            text: '项目一：宠物商城（混合APP开发）',
          },
          {
            name: 'li',
            text: '使用技术栈：YDUI框架、',
            children: [
              {
                name: 'span',
                class: 'tag',
                text: 'Vue全家桶、ApiCloud跨多端打包',
              },
            ],
          },
          {
            name: 'li',
            text: '项目描述：基于vue-cli搭建的web应用，多用户商城。功能主要包括商家入驻平台上传个人身份信息、发布宠物信息、会员商家一对一聊天、商城买卖、城市筛选。其中包含收货地址、搜索记录、宠物和商家店铺收藏的CRUD操作',
          },
        ],
      },
      {
        name: 'ul',
        class: 'ul-list',
        children: [
          {
            name: 'li',
            class: 'project-title',
            text: '项目二：智慧校园类（混合APP开发）',
          },
          {
            name: 'li',
            text: '使用技术栈：',
            children: [
              {
                name: 'span',
                class: 'tag',
                text: 'Vue全家桶、',
              },
              {
                name: 'span',
                text: '滴滴官方',
              },
              {
                name: 'span',
                class: 'tag',
                text: 'cube-ui',
              },
              {
                name: 'span',
                text: '框架、',
              },
              {
                name: 'span',
                class: 'tag',
                text: 'ApiCloud跨多端打包',
              },
            ],
          },
          {
            name: 'li',
            text: '项目描述：老师发布作业、考勤点到、发布校园动态...家长接收信息，与老师端进行交互',
          },
        ],
      },
      {
        name: 'ul',
        class: 'ul-list',
        children: [
          {
            name: 'li',
            class: 'project-title',
            text: '项目三：微信公众号，亲子游商城',
          },
          {
            name: 'li',
            text: '使用技术栈：',
            children: [
              {
                name: 'span',
                class: 'tag',
                text: 'Vue、Vue-Router、Axios、Stylus',
              },
              {
                name: 'span',
                text: '、YDUI、Vue-awesome-swiper',
              },
            ],
          },
          {
            name: 'li',
            text: '项目描述：1. Vue-cli脚手架搭建项目',
          },
          {
            name: 'li',
            text: '2. 使用Vue-Router做应用页面跳转，路由导航守卫权限控制,params、query传参',
          },
          {
            name: 'li',
            text: '3. Axios用做Ajax数据交互，dev环境下配置代理解决跨域，使用createAPI配置baseURL。',
          },
          {
            name: 'li',
            text: '4. 使用CSS预处理器stylus简化CSS代码编写，浏览器兼容前缀，rem函数封装。',
          },
          {
            name: 'li',
            text: '5. 使用UI框架YDUI，减少不必要的造轮子，提高代码编写效率，用户体验。',
          },
          {
            name: 'li',
            text: '6. 使用vue-awesome-swiper轮播图插件。',
          },
        ],
      },
      {
        name: 'ul',
        class: 'ul-list',
        children: [
          {
            name: 'li',
            class: 'project-title',
            text: '项目四：企业官网（响应式）、商城（PC)兼容IE8以及多端浏览器',
          },
          {
            name: 'li',
            text: '使用技术栈：',
            children: [
              {
                name: 'span',
                class: 'tag',
                text: 'jQuery',
              },
            ],
          },
          {
            name: 'li',
            text: 'PC使用兼容写法兼容Ie8、使用渐进增强逐渐增添些许特效，mediaQuery实现网页自适应，移动端样式权重高于PC，完成移动端页面布局。',
          },
        ],
      },
    ],
  },
  {
    name: 'h4',
    class: 'text-title',
    text: '自我评价',
  },
  {
    name: 'ul',
    class: 'ul-list',
    children: [
      {
        name: 'li',
        text: '具有',
        children: [
          {
            name: 'span',
            class: 'tag',
            text: '团队管理经验',
          },
          {
            name: 'span',
            text: '，拥有良好的',
          },
          {
            name: 'span',
            class: 'tag',
            text: '团队协调能力',
          },
          {
            name: 'span',
            text: '，工作当中和同事融洽相处',
          },
        ],
      },
      {
        name: 'li',
        text: '常混迹于',
        children: [
          {
            name: 'span',
            class: 'tag',
            text: '前端主流社区',
          },
          {
            name: 'span',
            text: '（github、掘金、知乎、简书），翻阅前端',
          },
          {
            name: 'span',
            class: 'tag',
            text: '大咖',
          },
          {
            name: 'span',
            text: '博客（张鑫旭、阮一峰、黄轶）',
          },
        ],
      },
      {
        name: 'li',
        text: '热爱前端、思维活跃、学习能力强，抗压能力强。',
      },
      {
        name: 'li',
        text: '性格随和、诚恳稳重、身体素质较好、能够很快地适应新环境。',
      },
    ],
  },
]
let style = `
  /*
  * 面试官你好，我是Edit，广东惠州人
  * 为您精心准备一份不一样的简历来介绍自己
  * 首先准备一些样式
  */
  *{
      transition: all .8s;
  }
  /* 稍等，在容器上添加点样式 */
  #codeEdit{
      color: #fff;
      background: #1E1E1E;
  }
  #resume{
      box-shadow: -1px 4px 9px 3px rgba(0, 0, 0, .15);
  }
  /* 我需要一点代码高亮 */
  pre#codeEdit{
      color: #CE9e78;
  }
  .token.selector{
      color: rgb(230, 155, 43);
  }
  .token.comment{
      color: #6A9955;
      font-size: 14px;
  }
  .token.property{
      color: #60C8FE;
  }
  .token.function {
      color: #DD4A68;
  }
  /* 接下来请欣赏我的个人简历吧 */
`
let balloon = `
  <div class="balloon-wrap">
      <img src="images/balloon.png" id="bg-balloon-small">
      <img src="images/balloon.png" id="bg-balloon-large">
      <img src="images/logo.png" id="bg-balloon-logo">
  </div>
  <div class="connect" style="width: 100%; display: flex;"></div>`
let line = `
  <div class="line-wrap">
      <div class="line-left"></div>
      <div class="line-right">
          <p class="line-defColor line-item1"></p>
          <p class="line-darkColor line-item2"></p>
          <p class="line-defColor line-item3"></p>
          <p class="line-midColor line-item4"></p>
          <p class="line-darkColor line-item5"></p>
          <p class="line-midColor line-item6"></p>
          <p class="line-darkColor line-item7"></p>
          <p class="line-midColor line-item7"></p>
      </div>
  </div>
  <div class="connect"></div>`
let text = `
  <div class="text-wrap"></div>
`
