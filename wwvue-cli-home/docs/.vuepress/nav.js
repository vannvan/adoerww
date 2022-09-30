// 具体配置文档: https://vuepress.vuejs.org/zh/theme/default-theme-config.html#%E5%AF%BC%E8%88%AA%E6%A0%8F%E9%93%BE%E6%8E%A5

module.exports = [
  {
    text: '上手使用',
    link: '/guide/',
  },

  {
    text: '推荐工具',
    items: [
      {
        text: 'Web导航',
        items: [{ text: 'adoerww', link: 'https://adoerww.netlify.app/' }],
      },
      {
        text: '轮子',
        items: [{ text: 'UI组件库', link: 'https://github.com/vannvan/ww-ui' }],
      },
      {
        text: '开发灵感',
        items: [
          { text: '奇奇怪怪', link: 'https://github.com/vannvan/web-explore-demo' },
          { text: '工具方案', link: 'https://github.com/vannvan/adoerww' },
        ],
      },
    ],
  },
  {
    text: 'github',
    link: 'https://github.com/vannvan/wvue-cli',
  },
]
