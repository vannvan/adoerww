/*!
 * 组合消息弹窗
 */
;(function($) {
  $.fn.extend({
    message: function(options) {
      options.className = options.type || 'info'
      switch (options.type) {
        case 'warning':
          options.title = '系统信息：'
          break
        case 'success':
          options.title = '温馨提示：'
          break
        case 'danger':
          options.title = '错误提醒：'
          break
        case 'error':
          options.title = '错误提醒：'
          break
        case 'info':
          options.title = ''
      }
      options = $.extend(
        {
          //type : options.type,
          msg: options.msg,
          speed: options.speed || 300,
          //提示消息5秒后消失
          existTime: options.existTime || 3000
        },
        options
      )

      var div = $(
        '<div class="emalacca-plugin-toast ' +
          options.className +
          '" role="alert" >' +
          options.title +
          options.msg +
          '<span class="close" id="closeLoginMessage" type="button" data-dismiss="alert">×</span>' +
          '</div>'
      )
      $('body').append(div)
      div.show(options.speed)
      //隐藏对象
      setTimeout(function() {
        div.toggle(options.speed)
      }, options.existTime)
      //移除对象
      setTimeout(function() {
        div.remove()
      }, options.existTime + 5000)
      // 关闭弹窗
      $('#closeLoginMessage').click(function() {
        $(this)
          .closest('.emalacca-plugin-toast')
          .remove()
      })
    }
  })
  return this
})(jQuery)
