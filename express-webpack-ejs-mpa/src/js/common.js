$(document).ready(function () {
	// 百度统计
	setTimeout(() => {
		//百度统计
		var _hmt = _hmt || [];
		(function () {
			//每次执行前，先移除上次插入的代码
			document.getElementById("baidu_tj") &&
				document.getElementById("baidu_tj").remove();
			var hm = document.createElement("script");
			hm.src =
				"https://hm.baidu.com/hm.js?72a2447b12c350b98d9d697d9f31c8c0";
			hm.id = "baidu_tj";
			var s = document.getElementsByTagName("script")[0];
			s.parentNode.insertBefore(hm, s);
		})();
	}, 0);

	// 头部导航定位
	[...$(".nav-item")].map((el) => {
		let elM = el.getAttribute("data-i");
		if (location.pathname == "/" && elM == "home") {
			$(el).addClass("active");
		}
		if (location.pathname.search(elM) >= 0) {
			$(el).addClass("active");
		}
	});
	

	// 全局注册按钮
	$(".register-button").click(function () {
		window.open(
			"https://erp.emalacca.com/auth/register?invitationCode=emalacca" //此标记用于erp侧用于判断如果是已登录用户直接进入overview
		);
	});

	// 插件下载按钮
	$(".download-plugin").click(() => {
		window.location.href =
			"https://sw-erp.oss-accelerate.aliyuncs.com/crawl-plugin/马六甲跨境助手.crx";
	});

	$(".erp-btn").click(() => {
		window.open("https://erp.emalacca.com/overview");
	});

	//回到顶部
	$("#BackTop").click(function () {
		let $page = $("html,body");
		let distance = $("html").scrollTop() + $("body").scrollTop();
		let totaltime = 500;
		let time = 50;
		let itemdistance = distance / (totaltime / time);

		let intervalId = setInterval(function () {
			distance -= itemdistance;
			if (distance <= 0) {
				distance = 0;
				clearInterval(intervalId);
			}
			$page.scrollTop(distance);
		}, time);
	});

	$(window).scroll(function () {
		if ($(window).scrollTop() > 200) {
			$("#BackTop").fadeIn(800);
		} else {
			$("#BackTop").fadeOut(800);
		}
	});
});

$(function () {
	let windowHeight = $(window).height(); //窗口高度
	let element;

	// 元素在可视区域，即刻开始动画
	let dataAnimateEl = $("[data-animate]");
	if (dataAnimateEl.length > 0 || dataAnimateEl.length == 0) {
		dataAnimateEl.each(function () {
			element = $(this);
			// 元素在可视区域，即刻开始动画
			animationStart(element);
		});
	}

	// 监听页面滚动，开始动画
	$(window).scroll(function (event) {
		let dataAnimateEl = $("[data-animate]");
		if (dataAnimateEl.length > 0 || dataAnimateEl.length == 0) {
			dataAnimateEl.each(function () {
				element = $(this);
				// 元素在可视区域，即刻开始动画
				animationStart(element);
			});
		}
	});

	//开始动画
	function animationStart(element) {
		let annimationVal = element.data("animate");

		if (viewingArea(element)) {
			element.removeClass(annimationVal).addClass(annimationVal);
		}
	}

	//函数作用：计算元素是否到达可视区域
	function viewingArea(element) {
		let objHeight = $(element).offset().top; //元素到顶部的高度
		let winPos = $(window).scrollTop(); //距离顶部滚动
		let val = objHeight - winPos;
		if (val < windowHeight && val > 0) {
			//可视区域
			return true;
		} else {
			//不可视区域
			return false;
		}
	}
});
