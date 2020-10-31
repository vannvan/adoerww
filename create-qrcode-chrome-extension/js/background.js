chrome.contextMenus.create({
    title: '使用度娘翻译：%s', // %s表示选中的文字
    contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
    onclick: function(params) {
        // 注意不能使用location.href，因为location是属于background的window对象
        chrome.tabs.create({ url: 'https://fanyi.baidu.com/#zh/en/' + encodeURI(params.selectionText) });
    }
});





var MAIN = {
    FirstRun: {
        open: function(url, callback) {
            chrome.tabs.create({
                url: url
            }, callback && afterTabLoaded(callback));
        },
        finishInitialization: function() {
            MAIN.FirstRun.open(chrome.extension.getURL("index.html"));
        }
    }
}



chrome.contextMenus.create({
    title: '打开扩展页',
    onclick: function(params) {
        // 注意不能使用location.href，因为location是属于background的window对象
        MAIN.FirstRun.finishInitialization();
    }
});