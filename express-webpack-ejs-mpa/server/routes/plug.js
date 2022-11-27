const express = require("express");
const router = express.Router();
const { render } = require("../common/utils");

router.get("/", async (req, res, next) => {
	try {
		await render(res, "plug", { title: "马六甲ERP" });
	} catch (e) {
		next(e);
	}
});

module.exports = router;
