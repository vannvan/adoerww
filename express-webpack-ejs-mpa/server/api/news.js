const app = require("./request");
const { http } = app;

/**
 * 获取新闻类型
 * @return {*}
 */
function getNewsTypeList() {
	return http({
		url: "/file-type/getPage",
		method: "post",
		data: {
			mainType: 1,
		},
	});
}
/**
 * 获取新闻列表
 * @param mainType 1、教程分类，2、新闻分类，3、案例分类
 * @param type 无值为全部 有值为对应新闻类型对应的id
 * @param {*} data
 * @return {*}
 */
function getNewsList(data) {
	return http({
		url: "/mgNwesExamaple/getPage",
		method: "post",
		data: Object.assign({ size: 10, status: 1 }, data),
	});
}

function getNewsDetail(articleId) {
	return http({
		url: "/mgNwesExamaple/" + articleId,
		method: "post",
	});
}

module.exports = {
	getNewsTypeList,
	getNewsList,
	getNewsDetail,
};
