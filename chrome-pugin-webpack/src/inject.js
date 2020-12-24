import './inject/follow-content'

//干掉客优云的插件
setTimeout(() => {
  document.getElementById('shopEdenContent')
    ? document.getElementById('shopEdenContent').remove()
    : null
}, 5000)
