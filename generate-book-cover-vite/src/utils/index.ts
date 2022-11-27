/**
 * 获取文件的Base64
 * @param file      {File}      文件
 * @param callback  {Function}  回调函数，参数为获取到的base64
 */
export const fileToBase64 = (file: any, callback: Function) => {
  const fileReader = new FileReader()
  fileReader.readAsDataURL(file)
  fileReader.onload = function () {
    callback(this.result)
  }
}
