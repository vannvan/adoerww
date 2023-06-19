const phantom = require('phantom')

const websit_list = [
  {
    name: '百度',
    link: 'https://www.baidu.com',
  },

  {
    name: 'nodejs',
    link: 'https://nodejs.cn/',
  },
]

const genImage = (siteInfo) => {
  phantom.create().then(function (ph) {
    ph.createPage().then(function (page) {
      page.open(siteInfo.link).then(function (status) {
        if (status === 'success') {
          return setTimeout(function () {
            page.property('viewportSize', { width: 1920, height: 1080 })

            page.render(`./${siteInfo.name}.jpg`)
            // page.close()
            ph.exit()
            // return next(status, url, file);
          }, 3000)
        }
        // page.property('viewportSize', { width: 1920, height: 1080 })
        // page.render(`./${siteInfo.name}.jpg`).then(function () {
        //   console.log('Page rendered')
        //   ph.exit()
        // })
      })
    })
  })
}

websit_list.forEach((item) => {
  genImage(item)
})
