export function Popup() {
  /*
   * alert 弹窗 title、text 必传
   */
  var that = this
  ;(this.alert = function(title, text) {
    var model = document.getElementById('EmalaccaModel')
    if (model) {
      var content = document.getElementById('alertContent')
      content.innerText = text
      model.style.display = 'block'
      return
    }
    var creatediv = document.createElement('div') // 创建div
    creatediv.className = 'emalacca-model' // 添加class
    creatediv.setAttribute('id', 'EmalaccaModel') // 添加ID
    var contentHtml =
      '<div class="model_popup" style="">' +
      '<div class="popup-ts">' +
      title +
      '</div>' +
      '<div class="popup-text" id="alertContent">' +
      text +
      '</div>' +
      '<div class="popup-btn">' +
      '	<span class="sure alert_sure" id="sure-popup">确定</span>' +
      // +'	<span class="cancel" id="cancel-popup">取消</span>'
      '</div>' +
      '</div>'
    creatediv.innerHTML = contentHtml
    document.body.appendChild(creatediv)
    document.getElementById('sure-popup').addEventListener('click', function() {
      that.sureAlert()
    })
  }),
    /*
     *  关闭弹窗
     */
    (this.cancelAlert = function() {
      var model = document.getElementById('EmalaccaModel')
      model.style.display = 'none'
    }),
    /*
     * 确定弹窗
     */
    (this.sureAlert = function() {
      var model = document.getElementById('EmalaccaModel')
      model.style.display = 'none'
    }),
    /*
     * confirm弹窗title、text必传 fn可选
     */
    (this.confirm = function(title, text, fn) {
      var confirmModel = document.getElementById('confirmModel')
      if (confirmModel) {
        var content = document.getElementById('confirmContent')
        content.innerText = text
        confirmModel.style.display = 'block'
        return
      }
      var creatediv = document.createElement('div') // 创建div
      creatediv.className = 'emalacca-model' // 添加class
      creatediv.setAttribute('id', 'confirmModel') // 添加ID
      var contentHtml =
        '<div class="model_popup" style="">' +
        '<div class="popup-ts">' +
        title +
        '</div>' +
        '<div class="popup-text" id="confirmContent">' +
        text +
        '</div>' +
        '<div class="popup-btn">' +
        '	<span class="sure" id="sure">确定</span>' +
        '	<span class="cancel" id="cancel">取消</span>' +
        '</div>' +
        '</div>'
      creatediv.innerHTML = contentHtml
      document.body.appendChild(creatediv) // 将创建的div 加入 body
      document.getElementById('sure').addEventListener('click', function() {
        that.sureConfirm(fn)
      })
      document.getElementById('cancel').addEventListener('click', function() {
        that.cancelConfirm()
      })
    }),
    /*
     * 确定按钮 有回调执行回调
     */
    (this.sureConfirm = function(fn) {
      var confirmModel = document.getElementById('confirmModel')
      confirmModel.style.display = 'none'
      if (typeof fn === 'function') {
        fn.apply()
      } else {
        console.log(fn)
      }
    }),
    /*
     * 关闭confirm
     */
    (this.cancelConfirm = function() {
      var confirmModel = document.getElementById('confirmModel')
      confirmModel.style.display = 'none'
    }),
    /*
     * 可以传入图片的confirm 弹窗title、text、img 必传，fn可选
     */
    (this.imgConfirm = function(title, text, img, fn) {
      var confirmModel = document.getElementById('imgConfirm')
      if (confirmModel) {
        var content = document.getElementById('imgContent')
        var imgC = document.getElementById('imgC')
        content.innerText = text
        imgC.src = img
        confirmModel.style.display = 'block'
        return
      }
      var creatediv = document.createElement('div') // 创建div
      creatediv.className = 'emalacca-model' // 添加class
      creatediv.setAttribute('id', 'imgConfirm') // 添加ID
      var contentHtml =
        '<div class="model_popup" style="top: 30%">' +
        '<div class="popup-ts">' +
        title +
        '</div>' +
        '<div class="popup-text"><img id="imgC" src="' +
        img +
        '"/><p id="imgContent">' +
        text +
        '</p></div>' +
        '<div class="popup-btn">' +
        '	<span class="sure" id="sureImg">确定</span>' +
        '	<span class="cancel" id="cancelImg">取消</span>' +
        '</div>' +
        '</div>'
      creatediv.innerHTML = contentHtml
      document.body.appendChild(creatediv) // 将创建的div 加入 body
      document.getElementById('sureImg').addEventListener('click', function() {
        that.sureImg(fn)
      })
      document
        .getElementById('cancelImg')
        .addEventListener('click', function() {
          that.cancelImg()
        })
    }),
    /*
     * 确定按钮 有回调执行回调
     */
    (this.sureImg = function(fn) {
      var confirmModel = document.getElementById('imgConfirm')
      confirmModel.style.display = 'none'
      if (typeof fn === 'function') {
        fn.apply()
      } else {
        console.log(fn)
      }
    }),
    /*
     * 关闭confirm
     */
    (this.cancelImg = function() {
      var confirmModel = document.getElementById('imgConfirm')
      confirmModel.style.display = 'none'
    }),
    /*
     * 弱提示 toast
     */
    (this.toast = function(text, time) {
      var model = document.getElementById('toast-popup')
      if (model) {
        var content = document.getElementById('toast-content')
        content.innerText = text
        model.style.display = 'block'
        that.cancelToast(time)
        return
      }
      var creatediv = document.createElement('div') // 创建div
      creatediv.className = 'model_toast' // 添加class
      creatediv.setAttribute('id', 'toast-popup') // 添加ID
      var contentHtml =
        '<div class="popup-toast" id="toast-content">' + text + '</div>'
      creatediv.innerHTML = contentHtml
      document.body.appendChild(creatediv) // 将创建的div 加入 body
      that.cancelToast(time)
    }),
    /*
     * 弱提示关闭 默认2s
     */
    (this.cancelToast = function(time) {
      if (!time) {
        var time = 2 // 关闭时间默认在2s
      }
      setTimeout(function() {
        document.getElementById('toast-popup').style.display = 'none'
      }, time * 1000)
    })
}
