const express = require("express");
const router = express.Router();
const { render } = require("../common/utils");
const moment = require("moment");
const { newsList, advertisingList } = require("../api/home");
const { getCostomerList } = require("../api/customer");

router.get("/", async (req, res, next) => {
	try {
		const { data = [] } = await newsList({
			mainType: 1,
			current: 1,
			status: 1,
			size: 10,
		});

		const { data: adList } = await advertisingList({
			advertisingKey: "overview_banner",
			type: 2,
			status: true,
		});
		const newsListData = data.records || [];
		newsListData.forEach((item) => {
			item.updateTime = item.updateTime
				? moment(item.updateTime).format("MM/DD")
				: item.updateTime;
		});
		// console.log("新闻动态:", JSON.stringify(data));
		const activityList = newsListData.filter((item) => item.type === 3);
		const companyList = newsListData.filter((item) => item.type === 2);
		const businessList = newsListData.filter((item) => item.type === 1);

		let list = await getCostomerList();
		const customerList =
			list.data.length > 0 ? list.data.splice(0, 3) : list.data; //首页只取三条
		customerList.map((el) => {
			el.tagsArr = el.tags ? el.tags.split(",") : [];
		});
		// console.log("客户案例:", JSON.stringify(customerList));

		await render(res, "home", {
			title: "马六甲ERP-专注于Shopee、Lazada东南亚跨境电商",
			activityList,
			companyList,
			businessList,
			customerList,
			adList: adList.records,
		});
	} catch (e) {
		next(e);
	}
});

module.exports = router;
