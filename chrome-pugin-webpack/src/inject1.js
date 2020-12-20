var contents = []
function getData(callback) {
    $.getJSON('http://pugjson.idot.site/list-data.json', function(json) {
        contents = json.content
        callback && callback(contents)
    })
}

getData()

function getSearchList(d) {
    var keyword = $('#keyword').val()
    var arr = []
    arr.push('<ul style="margin: 20px auto;width: 960px;" class="search-list">')
    d.filter(function(e) {return e.title.indexOf(keyword) > -1})
        .map(function(e) {
            arr.push('<li style="margin-bottom: 10px; border: 1px solid #C6D7E7; padding: 10px;"><a href="http://www.hao8v.net/'+ e.url + '" title="'+ e.title +'" target="_blank"><div class="title" style="display:inline-block;margin-bottom: 10px;font-size: 16px;">' + e.title +'</div></a>')
            arr.push('<div style="height:80px;overflow:hidden;">' + e.desc.replace('<br />', '')+ '</div></li>')
        })
    arr.push('</ul>')
    if(arr.length) {
        if($('.search-list').length) {
            arr.shift()
            arr.pop()
            $('.search-list').html(arr.join(''))
        } else {
            $(arr.join('')).insertBefore($('#main'))
        }
        $('#main, #main2').remove() 
    } else {
        location.href= 'http://www.hao8v.net/404.html'
    }     
}

$('.inputSub').click(function(e) {
    e.preventDefault()
    if(!contents.length) {
        getData(function(d) {
            getSearchList(d)
        })
    } else {
        getSearchList(contents)
    }
})

$('.tabbbb1,.tabbbb2').each(function(i) {
    $(this).siblings().each(function(idx) {
        if(idx != 0) {
            $(this).hide()
        } else {
            $(this).addClass('curr')
        }
    })

    $(this).find('li').first().addClass('curr')
})

function etabit(type, t) {
    if($(t).hasClass('curr')) {
        return
    }
    $(t).addClass('curr').siblings().removeClass('curr')
    $('#' + type).show().siblings(':gt(0)').hide()
}

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'UA-141513469-1');

var i = document.querySelectorAll('script')
document.body.removeChild(i.slice(0).pop())