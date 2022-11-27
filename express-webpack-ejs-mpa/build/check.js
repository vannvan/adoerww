var exec = require("child_process").exec;

check();

const serverName = "官网服务:node:3000";

function check() {
	var last = exec("lsof -i:3000");
	last.on("exit", function (code) {
		if (code != 0) {
			run();
			console.log(serverName + "主服务已关闭，马上重启");
		} else {
			console.log(serverName + "主服务活跃中");
		}
	});

	setTimeout(check, 1000 * 60);
}

function run() {
	var last = exec("npm run server");

	last.on("exit", function (code) {
		if (code == 0) {
			console.log(serverName + "主服务重启成功");
		} else {
			console.log(serverName + "主服务重启失败");
		}
	});
}
