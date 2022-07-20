const express = require("express");
const app = express();
const { sendJson, throwError } = require("../util/tool");
const { Project } = require("../db/mongo");
const log = require("../util/log");

app.post("/add", (req, res) => {
	log(`${req.baseUrl}请求参数:, ${JSON.stringify(req.body)}`);

	try {
		let params = req.body;
		params.created = Date.now();
		const project = new Project(params);
		project.save((error) => {
			if (error) {
				res.status(400);
				res.send(throwError());
			} else {
				res.send(sendJson(1, "操作成功"));
			}
		});
	} catch (err) {
		res.status(400);
		res.send(throwError(err));
	}
});

module.exports = app;
