const shell = require("shelljs");
const path = require("path");
const moment = require("moment");

const Time = moment().format("MM-DD-hh");

shell.mkdir(path.resolve("dist/public"));

shell.mv(path.resolve("dist/css"), path.resolve("dist/public"));
shell.mv(path.resolve("dist/imgs"), path.resolve("dist/public"));
shell.mv(path.resolve("dist/js"), path.resolve("dist/public"));
shell.exec("mkdir bak", (err, stdout, stderr) => {
		// continue
		console.log(err);
		//备份旧服务;
		shell.cp("-R", path.resolve("prod/"), path.resolve(`bak/${Time}`));

		// 迁移到生产目录
		// shell.cp('-f', path.resolve("dist/*"), path.resolve("prod/"));
		shell.exec('cp -rfv dist/ prod')

		// 杀掉进程;
		// shell.exec("node build/kill.sh");

		shell.exec(
				"npx pm2 start server/bin/www.js -i 4  --name website",
				(err) => {
						// 说明没有
						if (err == 0) {
								console.log("官网服务启动成功");
						} else {
								shell.exec("npx pm2 reload all", (err, stdout, stderr) => {
										console.log("官网服务重启成功");
										console.log("查看日志:npx pm2 logs");
								});
						}
				}
		);
});
