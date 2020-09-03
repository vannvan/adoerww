console.log('你好，我是popup！');
let qrcode = new QRCode(document.getElementById("qrcode"), {
	width : 160,
	height : 160
});

function makeCode () {      
    var elText = document.getElementById("text");
    
    if (!elText.value) {
        elText.focus();
        return;
    }
    
    qrcode.makeCode(elText.value);
}
chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    console.log(tabs[0].url)
    document.getElementById('text').value = tabs[0].url || window.location.href
    makeCode();
});


function downloadIamge(selector, name) {
    // 通过选择器获取img元素
    var img = document.querySelector(selector)
    // 将图片的src属性作为URL地址
    var url = img.src
    var a = document.createElement('a')
    var event = new MouseEvent('click')
    a.download = name || '下载图片名称'
    a.href = url
    a.dispatchEvent(event)
}

$("#save-btn").click(function(){
    console.log('保存二维码');
    let url = document.getElementById("text") 
    if(!url) {
        console.log('false');
        return
    }
    downloadIamge('img',)
})

//生成二维码操作
$("#submit-btn").click(function(){
    console.log('生成二维码');
    let url = $("#text").val()
    console.log(url,'url');
    if(!url) {
        console.log('false');
        $('.error-area').show()
        return
    }
    makeCode()
})

//input获取焦点
$("#text").focus(function() {
    console.log('input 获取焦点');
    $('.error-area').hide()
})

//保存二维码
$("#save-btn").click(function(){
    let url = $("#text").val()
    if(!url) {
        console.log('false');
        $('.error-area').show()
        return false
    }
    downloadIamge('img','二维码')
})