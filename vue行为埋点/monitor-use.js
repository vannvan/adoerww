// 在router管理模块进行使用

import Monitor from '@/monitor'

const monitor = new Monitor()
monitor.init({
		router: router,
		extentData: {
				userInfo: {
						me_account: 2837823
				}
		}
})


router.afterEach((to, from, next) => {
		console.log(JSON.stringify(monitor.get()))
})
