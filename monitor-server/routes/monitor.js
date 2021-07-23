const express = require("express");
const app = express();
const { sendJson, throwError } = require("../util/tool");
const { Monitor } = require("../db/mongo");
const log = require("../util/log");

// 过滤请求参数
const filterQueryParams = (params) => {
	Object.keys(params).forEach((key) => {
		if (!params[key]) {
			delete params[key];
		}
	});
	return params;
};

// 新增
app.post("/add", (req, res) => {
	log(`请求参数:, ${JSON.stringify(req.body)}`);

	let params = req.body;
	params.created = Date.now();
	const monitor = new Monitor(params);
	monitor.save((error, data) => {
		if (error) {
			res.status(400);
			res.send(throwError());
		} else {
			res.send(sendJson(1, "操作成功"));
		}
	});
});

// 批量新增
app.post("/add-batch", (req, res) => {
	log(`请求参数:, ${JSON.stringify(req.body)}`);
	try {
		let params = req.body;
		if (params && params.length) {
			params.map((el) => {
				el.created = Date.now();
				// let monitor = new Monitor(el);
			});
			Monitor.insertMany(params, (error, data) => {
				if (error) {
					console.log(error, "error");
					res.status(400);
					res.send(throwError(error.message));
				} else {
					res.send(sendJson(1, "操作成功"));
				}
			});
		}
	} catch (error) {
		res.status(400);
		res.send(throwError(error.message));
	}
});

// 获取分页列表
app.get("/page", (req, res) => {
	log(`请求参数:, ${JSON.stringify(req.query)}`);
	let {
		pageSize = 10,
		pageNo = 1,
		path = "",
		userAgent = "",
		dpiWidth = "",
		dpiHeight = "",
		pageEntryTime = 0,
		pageLeaveTime = 0,
		createdStartTime = 0,
		createEndTime = 0,
		maAccount = "",
		memberNO = "",
	} = req.query || {};
	let condition = {
		path: { $regex: path },
		"uaInfo.userAgent": { $regex: userAgent },
		"pageInfo.entryTime": {
			$gte: pageEntryTime ? Date.parse(pageEntryTime) : 0,
		},
		"pageInfo.leaveTime": {
			$lte: pageLeaveTime ? Date.parse(pageLeaveTime) : Date.now(),
		},
		created: {
			$lte: createEndTime ? Date.parse(createEndTime) : Date.now(),
			$gte: createdStartTime ? Date.parse(createdStartTime) : 0,
		},
		"userInfo.maAccount": { $regex: String(maAccount) },
		"userInfo.memberNO": { $regex: String(memberNO) },
		"uaInfo.dpiWidth": Number(dpiWidth),
		"uaInfo.dpiHeight": Number(dpiHeight),
	};
	console.log("查询条件:", filterQueryParams(condition));
	Monitor.countDocuments(filterQueryParams(condition), (error, count) => {
		if (error) {
			res.send(throwError());
		} else {
			Monitor.find(filterQueryParams(condition))
				.skip(1)
				.lean(true)
				.limit(parseInt(pageSize))
				.sort({ created: -1 })
				.exec((err, data) => {
					if (err) {
						res.status(400);
						res.send(throwError(err));
					} else {
						res.send(
							sendJson(1, null, data, {
								request: req.query,
								total: count,
								current: pageNo,
								pageSize: pageSize,
							})
						);
					}
				});
		}
	});
});

// 查询所有，不分页
// 这里用于前端页面直接查询某页面具体某一天的按钮点击量，可以查询某个人
// 所以页面需要全匹配路径，时间范围也是必填
app.get("/list", (req, res) => {
	log(`请求参数:, ${JSON.stringify(req.query)}`);
	let {
		path = "",
		userAgent = "",
		pageEntryTime = 0,
		pageLeaveTime = 0,
		createdStartTime = 0,
		createEndTime = 0,
		maAccount = "",
		memberNO = "",
	} = req.query || {};
	if (!createdStartTime && !createEndTime) {
		res.status(400);
		res.send(
			throwError(
				"开始时间(yyyy-MM-dd hh:ii:ss)和结束时间(yyyy-MM-dd hh:ii:ss)必传,"
			)
		);
		return false;
	}

	let condition = {
		path: { $regex: path },
		"uaInfo.userAgent": { $regex: userAgent },
		"pageInfo.entryTime": {
			$gte: pageEntryTime ? Date.parse(pageEntryTime) : 0,
		},
		"pageInfo.leaveTime": {
			$lte: pageLeaveTime ? Date.parse(pageLeaveTime) : Date.now(),
		},
		created: {
			$lte: createEndTime ? Date.parse(createEndTime) : Date.now(),
			$gte: createdStartTime ? Date.parse(createdStartTime) : 0,
		},
		"userInfo.maAccount": { $regex: String(maAccount) },
		"userInfo.memberNO": { $regex: String(memberNO) },
	};

	console.log("查询条件:", filterQueryParams(condition));
	Monitor.countDocuments({}, (error, count) => {
		if (error) {
			res.send(throwError(error));
		} else {
			Monitor.find(filterQueryParams(condition))
				.sort({ created: -1 })
				.exec((err, data) => {
					if (err) {
						res.status(400);
						res.send(throwError(err));
					} else {
						res.send(
							sendJson(1, null, data, {
								request: req.query,
								total: count,
							})
						);
					}
				});
		}
	});
});
module.exports = app;
