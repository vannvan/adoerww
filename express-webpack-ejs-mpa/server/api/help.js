const app = require("./request");
const { http } = app;

/**
 * 获取新闻类型
 * @return {*}
 * // 主类 1、教程 2、新闻，3、案例
 */
function getTypeList() {
	return http({
		url: "/mg/content-classify/list?module=1&size=99&current=1",
		method: "get"
	});
}
/**
 * 获取新闻列表
 * @param mainType 1、教程分类，2、新闻分类，3、案例分类
 * @param type 无值为全部 有值为对应新闻类型对应的id
 * @param {*} data
 * @return {*}
 */
function getHelpList(data) {
  let obj = Object.assign({ module: 1, size: 15 }, data)
  let str = ''
  for (let key in obj) {
    if (key == 'title') {
      obj[key] = encodeURIComponent(obj[key])
      console.log(obj[key], 'obj[key]')
    }
    str = str + '&' + key + '=' + obj[key]
  }
  console.log(str, 'str')
	return http({
		url: "/mg/content-info/page?" + str,
		method: "get"
	});
}

function getHelpDetail(articleId) {
	return http({
		url: "/mgTutorial/" + articleId,
		method: "post",
	});
}

module.exports = {
	getTypeList,
	getHelpList,
	getHelpDetail,
};
