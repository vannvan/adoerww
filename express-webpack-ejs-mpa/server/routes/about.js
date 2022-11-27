const express = require("express");
const router = express.Router();
const { render } = require("../common/utils");

router.get("/", async (req, res, next) => {
	try {
		await render(res, "about", { title: "马六甲ERP-关于我们" });
	} catch (e) {
		next(e);
	}
});

module.exports = router;
