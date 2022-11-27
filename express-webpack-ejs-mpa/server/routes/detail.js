const express = require("express");
const router = express.Router();
const { render } = require("../common/utils");

const { getNewsTypeList, getNewsDetail } = require("../api/news");

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
				let currentTypeName = newsTypeList.records.find(
						(el) => el.id == type
				).typeName;

				await render(res, "detail", {
						title: articleDetail.title,
						currentTypeName: currentTypeName,
						currentTypeValue: articleDetail.type,
						article: articleDetail,
				});
		} catch (e) {
				next(e);
		}
});

module.exports = router;
