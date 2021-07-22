const express = require("express");
const ObjectID = require("mongodb").ObjectID;
const { sendJson, throwError } = require("../util/tool");
const { User } = require("../db/mongo");
const app = express();
const log = require("../util/log");

const { handlerLoginERPMG, getErpAllMenuList } = require("../util/server");

const checkUserExit = function (params) {
	return new Promise(function (resolve, reject) {
		User.findOne(params, function (error, res) {
			resolve(res);
		});
	});
};

//注册
app.post("/register", function (request, response) {
	let params = request.body;
	const user = new User(params);
	checkUserExit({
		name: params.name,
	}).then((res) => {
		if (res) {
			response.send(sendJson(0, "用户名已存在"));
		} else {
			user.save(function (error, res) {
				if (error) {
					response.send(throwError());
				} else {
					response.send(sendJson(1, "注册成功"));
				}
			});
		}
	});
});

//登录
app.post("/login", function (request, response) {
	let params = request.body;
	User.findOne(
		{
			name: params.name,
		},
		async function (error, res) {
			if (!res) {
				response.send(sendJson(0, "用户不存在"));
			} else {
				if (params.password != res.password) {
					response.send(sendJson(0, "用户名或密码错误"));
				} else {
					let token = await handlerLoginERPMG();
					let menuList = await getErpAllMenuList(token);
					response.send(
						sendJson(
							1,
							"用户验证成功",
							Object.assign(
								{ userInfo: { userName: params.name } },
								{ menuList: menuList }
							)
						)
					);
				}
			}
		}
	);
});

// 获取erp菜单信息

module.exports = app;
