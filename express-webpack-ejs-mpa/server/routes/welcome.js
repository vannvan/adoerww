const express = require('express')
const router = express.Router()
const { render } = require('../common/utils')

router.get('/', async (req, res, next) => {
	try {
		await render(res, 'welcome', { title: '欢迎页' })
	} catch (e) {
		next(e)
	}
})

module.exports = router
