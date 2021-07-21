/*
  mongoose.js ：建立数据库连接用 mongoose.Schema 插入数据
 */
const mongoose = require("mongoose"); // 引入 mongoose

const Schema = mongoose.Schema; //schema 都会映射到一个 MongoDB collection

let log = {
	name: String,
};

const logsSchema = Schema(log);
const Log = mongoose.model("logs", logsSchema); //将schema编译为model构造函数

const newLog = new Log({ name: "yyyyyyyyyyyyaaa" }); // Mongoose 会自动找到名称是 model 名字复数形式的 collection
newLog.save();
