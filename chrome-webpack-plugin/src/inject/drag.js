const dragApp = () => {
  //   //获取元素
  let dv = document.querySelector('.emalacca-plugin-action-wrap')
  let toggleElement = document.querySelector('.emalacca-plugin-action-toggle')
  toggleElement.addEventListener('mousedown', function(e) {
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
}

export default dragApp
