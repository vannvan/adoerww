const express = require("express");
const router = express.Router();
const { render, post } = require("../common/utils");
const { getTypeList, getHelpList, getHelpDetail } = require("../api/help");
//列表
router.get("/", async (req, res, next) => {
		try {
				let typeList = await getTypeList();
				console.log("分类列表:", JSON.stringify(typeList));
				let listParams = {};
				let typeData = typeList.data;
				typeData.sort((a, b) => {
						return b.sort - a.sort;
				});
				const query = req.query;
				let problemData = {
						typeName: "",
						typeId: null,
						total: 0,
						pageType: "list",
				};
				// 帮助分类类型
				if (query.type) {
						listParams["classifyId"] = Number(query.type);
						const initData = typeData.filter(
								(val) => val.classifyId == query.type
						);
						problemData.typeName = initData[0].name || "";
						problemData.typeId = query.type;
				} else if (!query.search) {
						listParams["classifyId"] = Number(typeData[0].classifyId);
						problemData.typeName = typeData[0].name;
						problemData.typeId = typeData[0].classifyId;
				}
				// 帮助数据当前页码
				if (query.current) {
						listParams["current"] = Number(query.current);
				} else {
						listParams["current"] = 1;
				}

				// 查询数据title
				if (query.search) {
						listParams["title"] = query.search;
				}
				let helpList = await getHelpList(listParams);
				const helpData = helpList.data;
				problemData.total = helpData.total;
				// console.log("分类详情:", JSON.stringify(helpData));
				let helpDetails = {};
				// 帮助数据当前id
				if (query.id) {
						problemData["id"] = query.id;
						helpDetails = helpData.records.filter(
								(val) => val.contentId == query.id
						)[0];
						problemData.typeName = helpDetails.classifyName;
						problemData.typeId = helpDetails.classifyId;
				}
				await render(res, "help", {
						title: "马六甲ERP-使用帮助",
						typeList: typeData,
						helpList: helpData.records,
						query,
						problemData,
						helpDetails,
				});
		} catch (e) {
				next(e);
		}
});

module.exports = router;
