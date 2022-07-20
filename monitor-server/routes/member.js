const express = require("express");
const app = express();
const { sendJson, throwError } = require("../util/tool");
const { Member } = require("../db/mongo");
const log = require("../util/log");

function checkCurrentMemberExit(memberInfo) {
	let checkMember = {
		memberNO: memberInfo.memberNO,
		maAccount: memberInfo.maAccount,
	};

	return new Promise((resolve, reject) => {
		if (!checkMember.memberNO || !checkMember.maAccount) {
			reject(-1);
		}
		Member.findOne(checkMember, function (error, res) {
			checkMember.updateTime = Date.now();
			console.log("用户是否存在", res);
			if (!res) {
				const member = new Member(checkMember);
				member.save((error) => {
					if (error) {
						reject(-1);
					} else {
						console.log("成员新增成功");
						resolve(1);
					}
				});
			} else {
				Member.findOneAndUpdate(
					{ maAccount: checkMember.maAccount },
					// 更新最后记录时间
					{ $set: { updateTime: Date.now() } },
					function (updateError, updateRes) {
						if (!updateError) {
							console.log("更新成员信息", updateRes);
							resolve(1);
						}
					}
				);
			}
		});
	});
}

app.get("/page", (req, res) => {
	log(`请求参数:, ${JSON.stringify(req.query)}`);
	let { pageSize = 10, pageNo = 1 } = req.query;
	let condition = {
		//
	};
	Member.countDocuments(condition, (error, count) => {
		if (error) {
			res.send(throwError());
		} else {
			Member.find(condition)
				.skip((pageNo - 1) * pageSize)
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

module.exports = app;
module.exports.checkCurrentMemberExit = checkCurrentMemberExit;
