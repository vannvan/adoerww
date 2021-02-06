// 处理淘宝列表里的广告url
export const taobaoTranslationUrl = function ($a, url) {
	let id = $a.attr('data-nid') || '' // 获取商品ID
	let $parents = $a.parents('.item.J_MouserOnverReq.item-ad') // 获取商品的祖父级
	let isTM = false
	if ($parents.length > 0) {
		let divTM = $parents.find('.icon-service-tianmao') // 判断祖父级里是否有天猫图标
		isTM = divTM.length > 0
	}
	let newUrl = ''
	// 列表内的广告
	if (isTM && id) {
		newUrl = 'https://detail.tmall.com/item.htm?id=' + id
	} else if (!isTM && id) {
		newUrl = 'https://item.taobao.com/item.htm?id=' + id
	} else {
		/*
		    g_page_config：  p4pdata
		    RESOURCEID 有值，URL不一定有值
		    
		    // 右侧广告栏(父级没有id, 参数都在g_page_config)
		    var headObj = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
		    var headString = headObj.textContent;
		    // 获取g_page_config值
		    var startNum = headString.indexOf('g_page_config');
		    var endNum = headString.indexOf('g_srp_loadCss');
		    var configString = headString.slice(startNum, endNum);  // g_page_config参数
		    var itemsArr = configString.match(/"RESOURCEID.*?CUSTOMERID/g, '');
		    console.log(itemsArr, 'itemsArr')
		    var codeArr = url.split('&e='); // 广告url处理
		    var code = codeArr[codeArr.length - 1]; // 获取url中的code
		    var re = new RegExp(code+ '.*?"CUSTOMERID','ig'); // 动态正则的code
		    // 获取对应的url参数
		    var urlCodeString = ''
		    configString.replace(re,function(items, item){    //configString全参数找出对应的参数
		        urlCodeString = items;
		    });
		    urlCodeString.replace(/(http|https):.*?u003d\d+/,function(items, item){    //正则匹配出url
		         // 处理编译后的url
		        var urlCode = items.replace(/\\/g, '');
		        newUrl = urlCode.replace('u003d', '=');
		    });
		    */
	}
	return newUrl
}

// 处理1688列表里的广告url
export const albbTranslationUrl = function ($a) {
	let id = ''
	let $parents = $a.parents('.ad-item')
	if ($parents.length > 0) {
		let string = $parents.attr('data-aplus-report')
		let arrId = string.match(/object_id@\w.+?\^/gi, '')
		if (arrId.length > 0) {
			id = arrId[0].replace(/\D/gi, '')
		}
	}
	let url = ''
	if (id) {
		url = 'https://detail.1688.com/offer/' + id + '.html'
	}
	return url
}

