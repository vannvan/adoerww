const app = require("./request");
const { http } = app;

function getCostomerList() {
	return http({
		url: "mgNwesExamaple/getList",
		method: "post",
		data: {
			mainType: 2,
			current: 1,
			status: 1,
			size: 100,
		},
	});
}

function getCostomerDes(id) {
	return http({
		url: "mgNwesExamaple/" + id,
		method: "post",
	});
}

module.exports = {
	getCostomerList,
	getCostomerDes,
};
