const JSONToString = function (json) {
	return JSON.stringify(json);
};
/**
 * @description 统一请求处理
 * @param {*} status 状态值1表示成功，0表示失败
 * @param {*} message 返回信息
 * @param {*} data 返回数据
 * @param {*} params 附加数据
 * @returns {*}
 */
function sendJson(status, message, data, params) {
	return JSONToString({
		status,
		message,
		data: data || null,
		...params,
	});
}
/**
 * @description 抛出异常
 * @param {*} params
 * @returns {*}
 */
function throwError(params) {
	return JSONToString({
		status: 0,
		message: params || "Service error",
	});
}

const getTime = function () {
	return new Date().getTime();
};

// 过滤请求参数
const filterQueryParams = (params) => {
	Object.keys(params).forEach((key) => {
		if (!params[key]) {
			delete params[key];
		}
	});
	return params;
};

module.exports = {
	sendJson,
	throwError,
	JSONToString,
	getTime,
	filterQueryParams,
};
