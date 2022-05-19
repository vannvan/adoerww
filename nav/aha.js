;(function () {
  var playWords = [
    '富强',
    '民主',
    '文明',
    '和谐',
    '自由',
    '平等',
    '公正',
    '法制',
    '爱国',
    '敬业',
    '诚信',
    '友善',
  ] // 点击展示的词库
  var colors = ['#ff4545', '#3eff00'] // 颜色库
  var wordIdx = Math.floor(Math.random() * playWords.length) // 随机取词下标
  document.body.addEventListener('click', function (e) {
    // 监听点击事件
    if (e.target.tagName == 'A') {
      // a标签
      return
    }
    var x = e.pageX,
      y = e.pageY, // 获取点击位置
      span = document.createElement('span') // 创建展示playWords的span

    span.textContent = playWords[wordIdx]
    wordIdx = (wordIdx + 1) % playWords.length
    color = colors[Math.floor(Math.random() * colors.length)] // 随机取色
    span.style.cssText = [
      'z-index: 9999; position: absolute; top: ',
      y - 20,
      'px; left: ',
      x,
      'px; font-weight: bold; color: ',
      color,
    ].join('')
    document.body.appendChild(span)
    renderWords(span)
  })

  function renderWords(el) {
    var i = 0,
      top = parseInt(el.style.top)

    var playTimer = setInterval(function () {
      if (i > 180) {
        clearInterval(playTimer)
        el.parentNode.removeChild(el)
      } else {
        i += 3
        el.style.top = top - i + 'px'
        el.style.opacity = (180 - i) / 180
      }
    }, 16.7)
  }
})()
