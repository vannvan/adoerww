// 具体配置文档: https://vuepress.vuejs.org/zh/guide/

module.exports = {
  title: 'wwvue-cli',
  description: '这是简短描述...',
  dest: './dist',

  // LOGO大图配置
  head: [['link', { rel: 'icon', href: '/logo.jpg' }]],

  markdown: {
    lineNumbers: true,
  },

  themeConfig: {
    // 右上角导航菜单
    nav: require('./nav'),

    // 文档侧边栏
    // sidebar: require('./sidebar'),

    // 侧边栏展开下潜深度
    sidebarDepth: 2,

    // 记录编辑/更新修改时间
    // 需要传到git仓库(vuepress才能获取并显示)
    lastUpdated: 'Last Updated',
    searchMaxSuggestoins: 10,
    serviceWorker: {
      updatePopup: {
        message: '有新的内容.',
        buttonText: '更新',
      },
    },
    editLinks: true,
    editLinkText: '在 GitHub 上编辑此页 ！',
  },
}
