const shell = require("shelljs");
const path = require("path");

shell.mkdir(path.resolve("dist/public"));

shell.mv(path.resolve("dist/css"), path.resolve("dist/public"));
shell.mv(path.resolve("dist/imgs"), path.resolve("dist/public"));
shell.mv(path.resolve("dist/js"), path.resolve("dist/public"));
