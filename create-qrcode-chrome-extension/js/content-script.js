//接收消息
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     console.log(request, '来自popup的消息');
//     console.log(sender.tab ?
//         "from a content script:" + sender.tab.url :
//         "from the extension");
//     sendResponse({ farewell: "goodbye" });
// });