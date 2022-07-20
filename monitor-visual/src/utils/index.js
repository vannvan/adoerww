/**
 * @param {Array} arr  数据源
 * @param {Function} fn 去重方法
 */
export const uniqueElementsBy = (arr, fn) =>
  arr.reduce((acc, v) => {
    if (!acc.some((x) => fn(v, x))) acc.push(v)
    return acc
  }, [])

/**
 *
 *
 * @param {Array} arr  数据源
 * @param {Array} [result=[]]
 * @return {Array}
 */
export const flatData = (arr, result = []) => {
  arr.forEach((item) => {
    result.push(item)
    item.children && item.children.length > 0
      ? flatData(item.children, result)
      : ''
    item.children = '' //如果扁平化后的数组需要显示父子层级，可以把这一项删除
  })
  return result
}

/**
 *
 *
 * @param {Array} menuPermissions 扁平菜单权限
 * @param {Array} routesSource  所有可加载的扁平路由
 * @return {Array}
 */
export const generateRoleRouters = (menuPermissions, routesSource) => {
  const menuPaths = menuPermissions.map((el) => el.path.toLowerCase())
  return routesSource.filter((item) =>
    menuPaths.includes(item.path.toLowerCase())
  )
}

/**
 * 生成树形数据
 */

export const createTree = (list) => {
  // eslint-disable-line no-unused-vars
  let map = {}
  list.forEach((item) => {
    if (!map[item.menuId]) {
      map[item.menuId] = item
    }
  })
  list.forEach((item) => {
    item.check = false
    item.title = item.menuName
    item.expand = true
    const parentObj = map[item.parentId]
    if (item.parentId !== 0 && parentObj) {
      parentObj.children
        ? parentObj.children.push(item)
        : (parentObj.children = [item])
    }
  })
  return list.filter((item) => {
    if (item.parentId === 0) {
      return item
    }
  })
}

/** 除法
 * @param { number } num1
 * @param { number } num2
 */
export function division(num1, num2) {
  let t1, t2, r1, r2
  try {
    t1 = num1.toString().split('.')[1].length
  } catch (e) {
    t1 = 0
  }
  try {
    t2 = num2.toString().split('.')[1].length
  } catch (e) {
    t2 = 0
  }
  r1 = Number(num1.toString().replace('.', ''))
  r2 = Number(num2.toString().replace('.', ''))
  return (r1 / r2) * Math.pow(10, t2 - t1)
}

export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
