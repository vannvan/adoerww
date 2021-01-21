export function dragApp() {
  //获取元素
  let dv = document.getElementById('emalaccaRightApp')
  let x = 0
  let y = 0
  let l = 0
  let t = 0
  let firstTime = ''
  let lastTime = ''
  let isDown = false
  //鼠标按下事件
  dv.onmousedown = function(e) {
    firstTime = new Date().getTime()
    e.preventDefault() //图片要加
    //获取x坐标和y坐标
    x = e.clientX
    y = e.clientY

    //获取左部和顶部的偏移量
    l = dv.offsetLeft
    t = dv.offsetTop
    //开关打开
    isDown = true
    //设置样式
    dv.style.cursor = 'move'
    dv.style.position = 'fixed'
  }
  //鼠标移动
  window.onmousemove = function(e) {
    if (isDown == false) {
      return
    }
    //获取x和y
    let nx = e.clientX
    let ny = e.clientY
    //计算移动后的左偏移量和顶部的偏移量
    let nl = nx - (x - l)
    let nt = ny - (y - t)
    dv.style.position = 'fixed'
    if (nl < document.body.offsetWidth - 20 && nl > 20) {
      dv.style.left = nl + 'px'
    }
    if (nt < document.body.offsetHeight - 20 && nt > 20) {
      dv.style.top = nt + 'px'
    }
  }
  //鼠标抬起事件
  dv.onmouseup = function() {
    // window.onmousemove = null
    // window.onmouseup = null
    //开关关闭
    lastTime = new Date().getTime()
    if (lastTime - firstTime < 200) {
      dv.style.cursor = 'default'
    }
    setTimeout(() => {
      isDown = false
    }, 200)
  }
}
