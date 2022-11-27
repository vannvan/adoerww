const express = require("express");
const router = express.Router();
const { render } = require("../common/utils");
const { getCostomerList, getCostomerDes } = require("../api/customer");

function groups(array, getLength) {
		const newArray = []
		for (let i = 0; i < array.length; i + getLength) {
				newArray.push(array.slice(i, i += getLength))
		}
		return newArray
}


router.get("/", async (req, res, next) => {
		try {
				let { data } = await getCostomerList();
				const arr = data || [];
				arr.map((el) => {
						el.tagsArr = el.tags ? el.tags.split(",") : [];
				});
				const customerList = groups(arr, 6)
				console.log("客户案例:", arr.length, customerList.length);
				await render(res, "customer", {
						title: "马六甲ERP-客户案例",
						customerList,
				});
		} catch (e) {
				next(e);
		}
});

router.get("/:id", async (req, res, next) => {
		try {
				let articleId = req.params.id;
				console.log("文章ID:", articleId);
				// 文章详情
				let { data: articleDetail } = await getCostomerDes(articleId);
				console.log("文章详情:", JSON.stringify(articleDetail));
				articleDetail['tagsArr'] = articleDetail.tags ? articleDetail.tags.split(",") : [];
				await render(res, "detail", {
						title: articleDetail.title,
						rootData: { name: '客户案例', url: '/customer' },
						currentTypeName: "",
						currentTypeValue: null,
						article: articleDetail,
				});
		} catch (e) {
				next(e);
		}
});

module.exports = router;
