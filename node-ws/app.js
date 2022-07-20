var ws = require("nodejs-websocket");
var fs = require('fs');
console.log("开始建立连接...")

var server = ws.createServer(function(conn) {
    conn.on("text", function(str) {
        console.log("接收到的数据:" + str)
        // if (typeof str != 'string') {
        let { params, data } = JSON.parse(str)
        writeFile(params, data)
        // }

        setInterval(() => {
            let fileName = Math.random().toString(36).substring(2)
            conn.sendText(JSON.stringify({ params: fileName }));
            console.log('发送的数据：', JSON.stringify({ params: fileName }))

        }, 3000);
        // conn.sendText("My name is Web Xiu!");
    })
    conn.on("close", function(code, reason) {
        console.log("关闭连接")
    });
    conn.on("error", function(code, reason) {
        console.log("异常关闭")
    });
}).listen(10201)




console.log("WebSocket建立完毕")



function writeFile(fileName, fileContent) {
    console.log('文件', fileContent)
    fs.mkdir('./list', function(err) {
        if (!err) {
            fs.writeFile(`./list/${fileName}.txt`, fileContent, function(err) {
                if (err) {
                    console.log('写入失败', err);
                } else {
                    console.log('写入成功');
                }
            })
        }

    })
}