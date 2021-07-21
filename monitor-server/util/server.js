const { post, get } = require("./axios");
const axios = require("axios");

// 登录erp后台拿token
function handlerLoginERPMG() {
	return new Promise((resolve, reject) => {
		let params = { account: "18792401991", password: "lz530826541", type: 2 };
		post("api/mg/mg-account/login", params)
			.then((res) => {
				let { token } = res.data;
				resolve(token);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

// 获取erp菜单列表
function getErpAllMenuList(token) {
	axios.defaults.headers.common["Authorization"] = "Bearer " + token;
	return new Promise((resolve, reject) => {
		get("api/member/menu/all/list")
			.then((res) => {
				resolve(res.data);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

module.exports = {
	handlerLoginERPMG,
	getErpAllMenuList,
};
