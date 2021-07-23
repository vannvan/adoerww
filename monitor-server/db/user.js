const mongoose = require("mongoose"); // 引入 mongoose
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

module.exports = User;
