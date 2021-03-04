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
}
