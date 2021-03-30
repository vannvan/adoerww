/*!
 * 组合消息弹窗
 */
const jQuery = require('jquery')
;(function ($) {
  $.fn.extend({
    message: function (options) {
      options.className = options.type || 'info'
      options = $.extend(
        {
          //type : options.type,
          msg: options.msg,
          speed: options.speed || 300,
          //提示消息5秒后消失
          existTime: options.existTime || 3000,
        },
        options
      )

      var div = $(
        '<div class="emalacca-plugin-toast ' +
          options.className +
          '" role="alert" >' +
          options.msg +
          '</div>'
      )
      $('body').append(div)
      div.show(options.speed)
      //隐藏对象
      setTimeout(function () {
        div.toggle(options.speed)
      }, options.existTime)
      //移除对象
      setTimeout(function () {
        div.remove()
      }, options.existTime + 5000)
      // 关闭弹窗
      $('#closeLoginMessage').click(function () {
        $(this).closest('.emalacca-plugin-toast').remove()
      })
    },
  })
  return this
})(jQuery)
