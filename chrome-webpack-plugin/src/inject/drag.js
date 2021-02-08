const dragApp = () => {
  //   //获取元素
  let dv = document.querySelector('.emalacca-plugin-action-wrap')
<<<<<<< HEAD
  let toggleElement = document.querySelector('.emalacca-plugin-action-toggle')
  toggleElement.addEventListener('mousedown', function(e) {
=======
<<<<<<< HEAD
  let toggleElement = document.querySelector('.emalacca-plugin-action-toggle')
  toggleElement.addEventListener('mousedown', function(e) {
=======
  dv.addEventListener('mousedown', function(e) {
>>>>>>> 170d99bae1f3f289ec99c5d5e45a6170fe143306
>>>>>>> a15dd05e7b36518510e1d4604177f9e1e733be56
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
