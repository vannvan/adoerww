module.exports = Lib = {
  guid: function () {
    // 形如 57cc6dc7-e1d6-41a0-8be4-b9f4a33cd0be
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      }
    )
  },
  /**粗略的比较两个对象是否相等，
    主要用于比较旧消息队列和新消息队列是否相同，减少通知提醒的频率
 **/
  compare: function (oldObj, newObj) {
    if (typeof oldObj == 'object' && typeof newObj == 'object') {
      return JSON.stringify(oldObj) == JSON.stringify(newObj)
    }
    return false
  },
}
