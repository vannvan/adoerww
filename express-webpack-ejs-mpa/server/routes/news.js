const express = require("express");
const router = express.Router();
const { render } = require("../common/utils");

const { getNewsTypeList, getNewsList, getNewsDetail } = require("../api/news");

router.get("/", async (req, res, next) => {
	console.log("新闻请求参数:", req.query);
	let { p = 1, type = null } = req.query;
	try {
		// 新闻类型列表
		let { data: newsTypeList } = await getNewsTypeList();
		// 普通新闻列表
		let { data: newsList } = await getNewsList({
			type: type == 0 ? null : type,
			mainType: 1, //固定的
			current: p, //当前页
			size: 15,
		});
		// 热门新闻列表
		let { data: hotNewsList } = await getNewsList({
			sortReading: true,
			mainType: 1, //固定的
			size: 5,
		});

		console.log("新闻动态:", JSON.stringify(newsList));

		console.log("热门文章:", JSON.stringify(hotNewsList));

		console.log("文章分类:", JSON.stringify(newsTypeList));

		await render(res, "news", {
			title: "马六甲ERP-新闻动态",
			newsTypeList: newsTypeList.records,
			newsList: newsList.records,
			hotNewsList: hotNewsList.records,
			page: {
				total: newsList.total,
				current: newsList.current,
			},
		});
	} catch (e) {
		next(e);
	}
});

router.get("/:id", async (req, res, next) => {
	try {
		let articleId = req.params.id;
		console.log("文章ID:", articleId);
		// 文章类型
		let { data: newsTypeList } = await getNewsTypeList();
		console.log("文章类型:", JSON.stringify(newsTypeList));

		// 文章详情
		let { data: articleDetail } = await getNewsDetail(articleId);

		console.log("文章详情:", JSON.stringify(articleDetail));

		let { type } = articleDetail; // 当前文章type值
		let currentType = newsTypeList.records.find((el) => el.id == type);

		await render(res, "detail", {
			title: articleDetail.title,
			rootData: { name: "新闻动态", url: "/news" },
			currentTypeName: currentType.typeName || "",
			currentTypeValue: articleDetail.type,
			article: articleDetail,
		});
	} catch (e) {
		next(e);
	}
});

module.exports = router;
