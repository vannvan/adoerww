const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', chrome.extension.getURL('/js/ajaxhook.js'));
document.documentElement.appendChild(script);


// if ("WebSocket" in window) {
//     console.log("您的浏览器支持 WebSocket!");
//     var ws = new WebSocket("ws://192.168.50.223:8311/connect");
//     ws.onopen = function() {
//         // Web Socket 已连接上，使用 send() 方法发送数据
//         ws.send({ data: "aaa" });
//         console.log("数据发送中...");
//     };

//     ws.onmessage = function(evt) {
//         var received_msg = evt.data;
//         console.log("接收到的数据：", received_msg);
//     };

//     ws.onclose = function() {
//         // 关闭 websocket
//         console.log("连接已关闭...");
//     };

// }