const log = require("../util/log");
const mongoose = require("mongoose"); // 引入 mongoose
const url = "mongodb://localhost:27017/monitor"; // 本地数据库地址
mongoose.connect(url);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "【mongo】连接错误"));
db.once("open", function () {
	log("【mongo】服务已连接" + url, { font: "green" });
});

const User = require("./user");
const Monitor = require("./monitor");
const Member = require("./member");

module.exports = {
	mongoose,
	User,
	Monitor,
	Member,
};
