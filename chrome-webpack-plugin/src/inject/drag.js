export function dragApp() {
  //   //获取元素
  let dv = document.querySelector('.emalacca-plugin-action-wrap')
<<<<<<< HEAD
  let toggleElement = document.querySelector('.emalacca-plugin-action-toggle')
  toggleElement.addEventListener('mousedown', function(e) {
=======
  dv.addEventListener('mousedown', function(e) {
>>>>>>> 170d99bae1f3f289ec99c5d5e45a6170fe143306
    let x = e.clientX - dv.offsetLeft
    let y = e.clientY - dv.offsetTop
    document.onmousemove = function(e) {
      dv.style.left = e.clientX - x + 'px'
      dv.style.top = e.clientY - y + 'px'
      setTimeout(() => {
        dv.style.cursor = 'move'
      }, 100)
    }

    document.onmouseup = function(e) {
      setTimeout(() => {
        dv.style.cursor = 'default'
      }, 150)
      document.onmousemove = document.onmouseup = ''
    }
  })
  //   let x = 0
  //   let y = 0
  //   let l = 0
  //   let t = 0
  //   let firstTime = ''
  //   let lastTime = ''
  //   let isDown = false
  //   //鼠标按下事件
  //   dv.onmousedown = function(e) {
  //     firstTime = new Date().getTime()
  //     e.preventDefault() //图片要加
  //     //获取x坐标和y坐标
  //     x = e.clientX
  //     y = e.clientY

  //     //获取左部和顶部的偏移量
  //     l = dv.offsetLeft
  //     t = dv.offsetTop
  //     //开关打开
  //     isDown = true
  //     //设置样式
  //     dv.style.cursor = 'move'
  //     dv.style.position = 'fixed !important'
  //   }
  //   //鼠标移动
  //   document.onmousemove = function(e) {
  //     if (isDown == false) {
  //       return
  //     }
  //     //获取x和y
  //     let nx = e.clientX
  //     let ny = e.clientY
  //     //计算移动后的左偏移量和顶部的偏移量
  //     let nl = nx - (x - l)
  //     let nt = ny - (y - t)
  //     dv.style.position = 'fixed !important'
  //     if (nl < document.body.offsetWidth - 20 && nl > 20) {
  //       dv.style.left = nl + 'px'
  //     } else {
  //       dv.style.left = document.body.offsetWidth - 100 + 'px'
  //       console.log(nl, 'nl')
  //     }
  //     if (nt < document.body.offsetHeight - 20 && nt > 20) {
  //       dv.style.top = nt + 'px'
  //     }
  //   }
  //   //鼠标抬起事件
  //   document.onmouseup = function() {
  //     document.onmousemove = null
  //     document.onmouseup = null

  //     console.log('onmouseup')
  //     //开关关闭
  //     lastTime = new Date().getTime()
  //     if (lastTime - firstTime < 200) {
  //       dv.style.cursor = 'default'
  //       dv.style.position = 'relative !important'
  //     }
  //     setTimeout(() => {
  //       isDown = false
  //     }, 200)
  //   }
}
