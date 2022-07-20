const mongoose = require("mongoose"); // 引入 mongoose
const Schema = mongoose.Schema;

let member = {
	maAccount: {
		type: String,
		required: true,
	},
	memberNO: {
		type: String,
		required: true,
	},
	updateTime: {
		type: Number,
		required: true,
	},
};

const memberSchema = Schema(member);
const Member = mongoose.model("members", memberSchema); //将schema编译为model构造函数

module.exports = Member;
