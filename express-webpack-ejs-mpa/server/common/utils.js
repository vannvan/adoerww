const axios = require("axios");
const ejs = require("ejs");
const CONFIG = require("../../build/config");
const isDev = process.env.NODE_ENV === "development";
const { advertisingList } = require("../api/home");

function getTemplateString(filename) {
	return new Promise((resolve, reject) => {
		axios
			.get(
				`http://localhost:${CONFIG.PORT}${CONFIG.PATH.PUBLIC_PATH}${CONFIG.DIR.VIEW}/${filename}`
			)
			.then((res) => {
				resolve(res.data);
			})
			.catch(reject);
	});
}

/**
 * 整合网站公共数据和页面数据
 *
 */
async function dispatchPageParams(pageParams) {
	let { data } = await advertisingList({ type: 1 });
	return Object.assign(
		{
			keywords:
				"马六甲,跨境,马六甲官网,虾皮ERP,虾皮免费ERP,虾皮上货,虾皮多店铺管理,虾皮代打包,虾皮贴面单,shopee采集软件",
			content:
				"特色免费功能：无限采集刊登、免费图片翻译，免费粉丝插件、免费商品置顶发布等帮助Shopee卖家上新更快，节省运营成本",
			partnersLink: data.records || [],
      logoImgUrl: 'https://z3.ax1x.com/2021/06/01/2uUceP.png'
		},
		pageParams
	);
}

/**
 * render 方法
 * @param res express 的 res 对象
 * @param filename 需要渲染的文件名
 * @param data ejs 渲染时需要用到的附加对象
 * @returns {Promise<*|undefined>}
 */
async function render(res, filename, data) {
	// 文件后缀
	const ext = ".ejs";
	filename = filename.indexOf(ext) > -1 ? filename.split(ext)[0] : filename;
	try {
		if (isDev) {
			const template = await getTemplateString(`${filename}.ejs`);
			let html = ejs.render(template, await dispatchPageParams(data));
			res.send(html);
		} else {
			console.log("加载模版", filename);
			res.render("views/" + filename, await dispatchPageParams(data));
		}
		return Promise.resolve();
	} catch (e) {
		console.log("渲染出错:", e);
		return Promise.reject(e);
	}
}

module.exports = {
	getTemplateString,
	render,
};
