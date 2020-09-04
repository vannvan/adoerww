// 获取所有图片资源
document.getElementById('get_all_images').addEventListener('click', function() {
    chrome.devtools.inspectedWindow.getResources(function(resources) {
        let imgList = resources.filter(item => item.type == 'image' && validateImage(item.url))
        $('.content').empty()
        imgList.map((el, index) => {
            $('#status').text('已渲染：' + (index + 1) + '/' + imgList.length);
            $('.content').append(`<img src="${el.url}" alt="Question">`);
        });
        $('#status').text('已完成')
    });
});

function validateImage(imgPath) {
    const imgExtens = ['.png', '.gif', '.jpg']
    return imgExtens.includes(imgPath.substring(imgPath.lastIndexOf("."))) || /data/.test(imgPath)
}

$('#download_all_images').click(function() {
    packageImages()
})



function packageImages() {
    $('#status').text('处理中。。。。。');
    var imgs = $('img');
    var imgBase64 = [];
    var imageSuffix = []; //图片后缀
    var zip = new JSZip();
    // zip.file("readme.txt", "案件详情资料\n");
    var img = zip.folder("images");

    for (var i = 0; i < imgs.length; i++) {
        var src = imgs[i].getAttribute("src");
        var suffix = src.substring(src.lastIndexOf("."));
        imageSuffix.push(suffix);
        if (/data/.test(imgs[i].getAttribute("src"))) {
            imgBase64.push(imgs[i].getAttribute("src").substring(22))
        } else {
            getBase64(imgs[i].getAttribute("src"))
                .then(function(base64) {
                    imgBase64.push(base64.substring(22));
                }, function(err) {
                    console.log(err); //打印异常信息
                });
        }

    }

    function tt() {
        setTimeout(function() {
            console.log(imgBase64.length);
            if (imgs.length == imgBase64.length) {
                for (var i = 0; i < imgs.length; i++) {
                    img.file(i + imageSuffix[i], imgBase64[i], { base64: true });
                }
                // console.log(img);
                zip.generateAsync({ type: "blob" }).then(function(content) {
                    saveAs(content, "images.zip");
                });
                $('#status').text('处理完成。。。。。');

            } else {
                $('#status').text('已完成：' + imgBase64.length + '/' + imgs.length);
                tt();
            }
        }, 100);

    }
    tt();
}

//传入图片路径，返回base64
function getBase64(img) {
    function getBase64Image(img, width, height) { //width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
        var canvas = document.createElement("canvas");
        canvas.width = width ? width : img.width;
        canvas.height = height ? height : img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        var dataURL = canvas.toDataURL();
        return dataURL;
    }
    var image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = img;
    var deferred = $.Deferred();
    if (img) {
        image.onload = function() {
            deferred.resolve(getBase64Image(image)); //将base64传给done上传处理
        }
        return deferred.promise(); //问题要让onload完成后再return sessionStorage['imgTest']
    }
}