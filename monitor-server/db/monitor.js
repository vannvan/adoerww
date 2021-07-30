const mongoose = require("mongoose"); // 引入 mongoose
const Schema = mongoose.Schema;

let monitor = {
	monitorId: {
		type: String, //多项目监控用于区分项目的唯一标识
	},
	created: {
		type: Number,
		required: true,
	},
	path: {
		type: String,
		required: true,
	},
	pageInfo: {
		type: Object,
		required: true,
	},
	userInfo: {
		type: Object,
		// required: true,
	},
	eventData: {
		type: Array,
		required: true,
	},
	uaInfo: {
		type: Object,
	},
};

const monitorSchema = Schema(monitor);
const Monitor = mongoose.model("monitor", monitorSchema);

module.exports = Monitor;
