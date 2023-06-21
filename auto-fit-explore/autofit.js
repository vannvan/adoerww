let currRenderDom = null
let currelRectification = ''
let currelRectificationLevel = ''
let resizeListener = null
let timer = null
let currScale = 1
let isAutofitRunnig = false
let isElRectification = false
const autofit = {
  init(options = {}, isShowInitTip = true) {
    if (isShowInitTip) {
      console.log(
        `%c` + `autofit.js` + ` is running`,
        `font-weight: bold; color: #ffb712; background:linear-gradient(-45deg, #bd34fe 50%, #47caff 50% );background: -webkit-linear-gradient( 120deg, #bd34fe 30%, #41d1ff );background-clip: text;-webkit-background-clip: text; -webkit-text-fill-color:linear-gradient( -45deg, #bd34fe 50%, #47caff 50% ); padding: 8px 12px; border-radius: 4px;`
      )
    }
    const {
      designWidth = 1920,
      dw = 1920,
      designHeight = 929,
      dh = 929,
      renderDom = typeof options === 'string' ? options : '#app',
      el = typeof options === 'string' ? options : '#app',
      resize = true,
      ignore = [],
      transition = 'none',
      delay = 0,
    } = options
    currRenderDom = el || renderDom
    let dom = document.querySelector(el)
    if (!dom) {
      console.error(`autofit: '${el}' is not exist`)
      return
    }
    const style = document.createElement('style')
    const ignoreStyle = document.createElement('style')
    style.lang = 'text/css'
    ignoreStyle.lang = 'text/css'
    style.id = 'autofit-style'
    ignoreStyle.id = 'ignoreStyle'
    style.innerHTML = `
      body {
        overflow: hidden;
      }
    `
    dom.appendChild(style)
    dom.appendChild(ignoreStyle)
    dom.style.height = `${dh || designHeight}px`
    dom.style.width = `${dw || designWidth}px`
    dom.style.transformOrigin = `0 0`
    keepFit(dw || designWidth, dh || designHeight, dom, ignore)
    resizeListener = () => {
      clearTimeout(timer)
      if (delay != 0)
        timer = setTimeout(() => {
          keepFit(dw || designWidth, dh || designHeight, dom, ignore)
          isElRectification && elRectification(currelRectification, currelRectificationLevel)
        }, delay)
      else {
        keepFit(dw || designWidth, dh || designHeight, dom, ignore)
        isElRectification && elRectification(currelRectification, currelRectificationLevel)
      }
    }
    resize && window.addEventListener('resize', resizeListener)
    isAutofitRunnig = true
    setTimeout(() => {
      dom.style.transition = `${transition}s`
    })
  },
  off(el = '#app') {
    try {
      isElRectification = false
      window.removeEventListener('resize', resizeListener)
      document.querySelector('#autofit-style').remove()
      document.querySelector(currRenderDom ? currRenderDom : el).style = ''
      for (let item of document.querySelectorAll(currelRectification)) {
        item.style.width = ``
        item.style.height = ``
        item.style.transform = ``
      }
    } catch (error) {
      console.error(`autofit: Failed to remove normally`, error)
      isAutofitRunnig = false
    }
    isAutofitRunnig &&
      console.log(
        `%c` + `autofit.js` + ` is off`,
        `font-weight: bold;color: #707070; background: #c9c9c9; padding: 8px 12px; border-radius: 4px;`
      )
  },
}
function elRectification(el, level = 1) {
  if (!isAutofitRunnig) {
    console.error('autofit.js：autofit has not been initialized yet')
  }
  !el && console.error(`autofit.js：bad selector: ${el}`)
  currelRectification = el
  currelRectificationLevel = level
  const currEl = document.querySelectorAll(el)
  if (currEl.length == 0) {
    console.error('autofit.js：elRectification found no element')
    return
  }
  for (let item of currEl) {
    if (!isElRectification) {
      item.originalWidth = item.clientWidth
      item.originalHeight = item.clientHeight
    }
    let rectification = currScale == 1 ? 1 : currScale * level
    item.style.width = `${item.originalWidth * rectification}px`
    item.style.height = `${item.originalHeight * rectification}px`
    item.style.transform = `scale(${1 / currScale})`
    item.style.transformOrigin = `0 0`
  }
  isElRectification = true
}
function keepFit(dw, dh, dom, ignore) {
  let clientHeight = document.documentElement.clientHeight
  let clientWidth = document.documentElement.clientWidth
  currScale = clientWidth / clientHeight < dw / dh ? clientWidth / dw : clientHeight / dh
  dom.style.height = `${clientHeight / currScale}px`
  dom.style.width = `${clientWidth / currScale}px`
  dom.style.transform = `scale(${currScale})`
  for (let item of ignore) {
    let itemEl = item.el || item.dom
    if (!itemEl) {
      console.error(`autofit: bad selector: ${itemEl}`)
      continue
    }
    let realScale = item.scale ? item.scale : 1 / currScale
    let realFontSize = realScale != currScale ? item.fontSize : 'autofit'
    let realWidth = realScale != currScale ? item.width : 'autofit'
    let realHeight = realScale != currScale ? item.height : 'autofit'
    let regex = new RegExp(`${itemEl}(\x20|{)`, 'gm')
    let isIgnored = regex.test(document.querySelector('#ignoreStyle').innerHTML)
    if (isIgnored) {
      continue
    }
    document.querySelector('#ignoreStyle').innerHTML += `\n${itemEl} { 
      transform: scale(${realScale})!important;
      transform-origin: 0 0;
      width: ${realWidth}px!important;
      height: ${realHeight}px!important;
    }`
    document.querySelector(
      '#ignoreStyle'
    ).innerHTML += `\n${itemEl} div ,${itemEl} span,${itemEl} a,${itemEl} * {
    font-size: ${realFontSize}px;
    }`
  }
}
export { elRectification }
export default autofit
