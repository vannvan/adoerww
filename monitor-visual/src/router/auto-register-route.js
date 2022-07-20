const requireAllVueComponents = require.context(
  '../pages',
  true,
  /\.vue$/,
  'lazy'
)

function toInLine(str) {
  const renderStr = (pageNum) =>
    pageNum
      .split('')
      .map((ele, index) => {
        if (index === 0) {
          ele = ele.toLowerCase()
        } else {
          if (/[A-Z]/.test(ele)) ele = '-' + ele.toLowerCase()
        }
        return ele
      })
      .join('')

  return (
    '/' +
    str
      .replace('/', '')
      .split('/')
      .map((ele) => renderStr(ele))
      .join('/')
  )
}

const routerList = []

const EXCLUDE_PAGE = ['Login'] //需要排除的一些特例页面,例如登录页面，空缺页

requireAllVueComponents.keys().forEach((allVueComponentItem) => {
  const completeName = allVueComponentItem.match(/\w+\.vue$/, '')[0]
  const isComponents = /components/.test(allVueComponentItem)
  if (!/^[A-Z]+/.test(completeName.replace(/(^\.|\.vue)/g, ''))) {
    console.error(
      '组件: ' + completeName,
      '命名不符合规范，请采用大驼峰形式命名'
    )
  }
  const isExclude = EXCLUDE_PAGE.every((el) =>
    new RegExp(el).test(completeName)
  )
  // 文件名尾部有数值的情况下 自动注入路由
  if (completeName.match(/\w\.vue$/g) && !isComponents && !isExclude) {
    const routerMap = {}
    routerMap.path = toInLine(allVueComponentItem.replace(/(^\.|\.vue)/g, ''))
    routerMap.name = toInLine(
      allVueComponentItem.replace(/(\.\/|\/|\.vue)/g, '').toLowerCase()
    )
    routerMap.component = () => requireAllVueComponents(allVueComponentItem)
    routerList.push(routerMap)
  }
})

export default routerList
