import axios from "axios";
// styles
import "less/customer.less";
import "./common";

const isDev = process.env.NODE_ENV === "development";

// 在开发环境下，使用 raw-loader 引入 ejs 模板文件，强制 webpack 将其视为需要热更新的一部分 bundle
if (isDev) {
		require("raw-loader!../views/customer.ejs");
}
$(document).ready(function() {
		const length = $('.swiper-container').attr('data-list')
		if (length > 1) {
				new Swiper('.swiper-container', {
						loop: true,
						autoplay: false,
						pagination: {
								el: '.swiper-pagination',
								clickable: true,
								bulletClass: 'case-swiper-pagination',
								bulletActiveClass: 'case-swiper-pagination-active'
						},
				})
		}

		$('.case-item').click(function() {
				console.log(this)
				const href = window.location.pathname;
				window.location = $(this).attr('data-src');
		})
})
if (module.hot) {
		module.hot.accept();
		/**
		 * 监听 hot module 完成事件，重新从服务端获取模板，替换掉原来的 document
		 * 这种热更新方式需要注意：
		 * 1. 如果你在元素上之前绑定了事件，那么热更新之后，这些事件可能会失效
		 * 2. 如果事件在模块卸载之前未销毁，可能会导致内存泄漏
		 * 3. 上述两个问题的解决方式，可以在 document.body 内容替换之前，将事件手动解绑。
		 */
		module.hot.dispose(() => {
				const href = window.location.href;
				axios
						.get(href)
						.then((res) => {
								const template = res.data;
								document.body.innerHTML = template;
						})
						.catch((e) => {
								console.error(e);
						});
		});
}
