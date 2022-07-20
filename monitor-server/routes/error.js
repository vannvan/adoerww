const express = require("express");
const app = express();

app.get("/404", async (req, res, next) => {
	try {
		res.json({ error: 404, message: "接口不存在" });
	} catch (e) {
		next(e);
	}
});

app.get("/500", async (req, res, next) => {
	try {
		res.json({ error: 500, message: "接口错误" });
	} catch (e) {
		next(e);
	}
});

module.exports = app;
