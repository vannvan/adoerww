const app = require("./request");
const { http } = app;
// 官网新闻列表
function newsList(data) {
	return http({
		url: "/mgNwesExamaple/getPage",
		method: "post",
		data,
	});
}
/** 分类列表
 * @param mainType 1、新闻分类，2、案例分类
 * @param sort 排序
 * @param typeName 子类名称
 */
function classifyList(data) {
	return http({
		url: "/file-type/getPage",
		method: "post",
		data,
	});
}
// 友情链接
function advertisingList(data) {
	return http({
		url: "/mg-advertising/getPage",
		method: "post",
		data: {
			type: 1,
			...data,
		},
	});
}
module.exports = {
	newsList,
	classifyList,
	advertisingList,
};
