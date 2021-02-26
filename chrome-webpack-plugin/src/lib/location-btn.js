import { isEmpty, isNil } from '@/lib/utils'

const locationBtn = ($a, $crawlPanel) => {
  console.log($a, '$a2')
  let locationHref = location.href
  let top,
    left,
    width,
    height = ''
  let $firstImg = $a.find('img:first-child')
  let $childImg = $a.find('img')
  // a标签里有img标签的商品
  if (!isEmpty($firstImg) && $firstImg.length > 0) {
    top = $firstImg.offset().top
    left = $firstImg.offset().left
    width = $firstImg.width()
    height = $firstImg.height()
  }
  // a标签的坐标，还有全部属性attributes
  let { offsetLeft = 0, offsetTop = 0, offsetWidth = 0, offsetHeight = 0, attributes = {} } = $a[0]
  // 天猫
  if (locationHref.indexOf('tmall.com') !== -1) {
    let $divImg = $a.find('div:first-child')
    let divImgString = $divImg.length > 0 ? $divImg.css('backgbround') : ''
    //attributes是个类数组对象，当为null时，也是为object；只能用isNil判断是否为null
    let $aStyle = attributes.getNamedItem('style')
    let textContent = !isNil($aStyle) ? $aStyle.value : ''
    if (!isEmpty($childImg) && $childImg.length > 0) {
      // a标签里有img标签的商品（子级或者孙级节点）
      top = $childImg.offset().top
      left = $childImg.offset().left
      width = $childImg.width()
      height = $childImg.height()
    } else if (
      !isEmpty($divImg) &&
      $divImg.length > 0 &&
      !isEmpty(divImgString) &&
      divImgString.indexOf('//img.') > 0
    ) {
      // a标签里有div标签的商品（图片由backgbround展示）
      top = !isEmpty($divImg.offset()) ? $divImg.offset().top : offsetTop
      left = !isEmpty($divImg.offset()) ? $divImg.offset().left : offsetLeft
      width = $divImg.width()
      height = $divImg.height()
    } else if (!isEmpty(textContent) && textContent.indexOf('//gdp.alicdn.com') > 0) {
      // a标签里没有下一级的商品（图片由backgbround展示）
      top = $a.offset().top
      left = $a.offset().left
      width = $a.width()
      height = $a.height()
    }
  }
  // 1688
  if (locationHref.indexOf('1688.com') !== -1) {
    let $divImg = $a.find('.img')
    let $divImgString = $divImg.css('background-image') || ''
    if (!isEmpty($divImg) && $divImgString.indexOf('alicdn.com/img') > 0) {
      // a标签里有div标签的商品（图片由backgbround展示）
      top = !isEmpty($divImg.offset()) ? $divImg.offset().top : offsetTop
      left = !isEmpty($divImg.offset()) ? $divImg.offset().left : offsetLeft
    	width = $divImg.width()
      height = $divImg.height()
    }
  }

  // 虾皮
  if (/(shopee\.)|(xiapibuy\.)/.test(locationHref)) {
		// 商品列表&详情--优化加价商品
    let $divImg = $a.find('.V1Fpl5')	
		// 商品详情--热门商品
		let $divImg2 = $a.find('.lazy-image__image')	
		if ($divImg.length > 0) {
			left = $divImg.offset().left
			top = $divImg.offset().top
			width = $divImg.width() || $divImg[0].clientWidth
			height = $divImg.height() || $divImg[0].clientHeight
		} else if ($divImg2.length > 0) {
			left = $divImg2.offset().left
			top = $divImg2.offset().top
			width = $divImg2.width() || $divImg2[0].clientWidth
			height = $divImg2.height() || $divImg2[0].clientHeight
		}
	}
	
  // width>36 1688的商品有视频按钮，按钮的宽度为37
  if (!isEmpty(top) && width > 36) {
    $crawlPanel.css({
      top: top + parseInt(height / 2),
      left: left + parseInt(width / 2),
      transform: 'translateY(-50%) translateX(-50%)',
      display: 'block'
    })
  }
}

export default locationBtn
