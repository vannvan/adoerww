const log = require("../util/log");
const mongoose = require("mongoose"); // 引入 mongoose
const url = "mongodb://localhost:27017/monitor"; // 本地数据库地址
mongoose.connect(url);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "【mongo】连接错误"));
db.once("open", function () {
	log("【mongo】服务已连接" + url, { font: "green" });
});

const Schema = mongoose.Schema;

let user = {
	name: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	account: {
		type: String,
		required: true,
	},
};

const userSchema = Schema(user);
const User = mongoose.model("users", userSchema); //将schema编译为model构造函数

let monitor = {
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

module.exports = {
	mongoose,
	User,
	Monitor,
};
