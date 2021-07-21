/*
 express.js: 引入 express 模块，设置路由
*/
const express = require("express");
const log = require("./util/log");
const app = express();
const session = require("express-session");
require("./db/mongo");


const port = 3000;

// 请求参数形式
app.use(express.json({ type: "application/json" }));

//设置跨域访问
app.all("*", function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header(
				"Access-Control-Allow-Headers",
				"Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With"
		);
		res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
		res.header("X-Powered-By", " 3.2.1");
		res.header("Content-Type", "application/json;charset=utf-8");
		next();
});

app.get("/", function(request, response) {
		// 路由
		response.send("hello world!"); // 传送HTTP响应
});

// 注意这边写了父级目录，在对应的 router 里就不要再写了，直接写根路由就可以，否则 404
let routes = require("require-dir")("./routes", { recurse: true });
Object.keys(routes).map(function(v) {
		if (/error/.test(v)) {
				app.use("/" + v, routes[v]);
		} else {
				app.use("/api/" + v, routes[v]);
		}
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
		res.redirect("/error/404");
});

// 错误处理
// 这边需要注意的是一定要写四个形参，否则 express 不会认为是一个错误处理函数
app.use(async function(err, req, res, next) {
		console.log("错误处理:", err);
		// 设置响应状态
		res.status(err.status || 500);
		// 开发环境输出错误，生产环境不用
		res.json({ error: err });
});

app.listen(port, () => {
		log(`【monitor-server】服务已启动: http://localhost:${port}`, {
				font: "green",
		});
});
