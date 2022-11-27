const path = require("path");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const express = require("express");
const logger = require("morgan");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const { render } = require("./common/utils");
const fs = require("fs");

const CONFIG = require("../build/config");
const isDev = process.env.NODE_ENV === "development";
const app = express();

let webpackConfig = require("../build/webpack.dev.config");
let compiler = webpack(webpackConfig);
// var accessLogStream = fs.createWriteStream(__dirname + "/access.log", {
// 	flags: "a",
// }); //创建一个写入流
// app.use(logger("combined", { stream: accessLogStream })); //将日志写入文件

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (isDev) {
	// 用 webpack-dev-middleware 启动 webpack 编译
	app.use(
		webpackDevMiddleware(compiler, {
			publicPath: webpackConfig.output.publicPath,
		})
	);

	// 使用 webpack-hot-middleware 支持热更新
	app.use(
		webpackHotMiddleware(compiler, {
			publicPath: webpackConfig.output.publicPath,
			noInfo: true,
		})
	);

	// 指定开发环境下的静态资源目录
	app.use(
		webpackConfig.output.publicPath,
		express.static(path.join(__dirname, "../src"))
	);
} else {
	app.set("views", path.join(__dirname, `../${CONFIG.DIR.PROD}`)); // 生产环境目录
	app.set("view engine", "ejs");
	app.use(express.static(path.join(__dirname, `../${CONFIG.DIR.PROD}`))); // 生产环境目录
}

// 注意这边写了父级目录，在对应的 router 里就不要再写了，直接写根路由就可以，否则 404
let routes = require("require-dir")("./routes", { recurse: true });
Object.keys(routes).map(function (v) {
	if (v == "home") {
		app.use("/", routes[v]);
	}
	app.use("/" + v, routes[v]);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
	res.redirect("/error/404");
});

// 错误处理
// 这边需要注意的是一定要写四个形参，否则 express 不会认为是一个错误处理函数
app.use(async function (err, req, res, next) {
	console.log("错误处理:", err);
	// 设置响应状态
	res.status(err.status || 500);
	// 开发环境输出错误，生产环境不用
	await render(res, "500", {
		title: "服务器错误",
		error: isDev ? err : null,
	});
});

module.exports = app;
