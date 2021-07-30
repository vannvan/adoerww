const mongoose = require("mongoose"); // 引入 mongoose
const Schema = mongoose.Schema;

let project = {
	projectId: {
		type: String,
		required: true,
	},
	projectName: {
		type: String,
		required: true,
	},
	projectCode: {
		type: Number,
		required: true,
	},
	created: {
		type: Number,
		required: true,
	},
};

const projectSchema = Schema(project);
const Project = mongoose.model("projects", projectSchema); //将schema编译为model构造函数

module.exports = Project;
