import { isNil } from '@/lib/utils'
const locationBtn = ($a,  $crawlPanel) => {
	console.log($a, '$a2')
	let locationHref = location.href
	let top, left, width, height = ''
	let $firstImg = $a.find('img:first-child')
	let $childImg = $a.find('img')
	// 淘宝
	if (locationHref.indexOf('taobao.com') !== -1) {
		// a标签里有img标签的商品
		if (!isNil($firstImg) && $firstImg.length > 0) {
			top = $firstImg.offset().top,
			left = $firstImg.offset().left,
			width = $firstImg.width(),
			height = $firstImg.height()
		}
	}
	// 天猫
	if (locationHref.indexOf('tmall.com') !== -1) {
		// a标签里有img标签的商品
		console.log($firstImg, '$firstImg')
		if (!isNil($firstImg) && $firstImg.length > 0) {
			top = $firstImg.offset().top,
			left = $firstImg.offset().left,
			width = $firstImg.width(),
			height = $firstImg.height()
		} else if (!isNil($childImg) && $childImg.length > 0){
			top = $childImg.offset().top,
			left = $childImg.offset().left,
			width = $childImg.width(),
			height = $childImg.height()
		}
		console.log($childImg,isNil($childImg), '$childImg')
		console.log($childImg.offset(), $childImg.width(), '$childImg')
	}
	if (!isNil(top)) {
		$crawlPanel.css({
			top: top + parseInt(height / 2),
			left: left + parseInt(width / 2),
			transform: 'translateY(-50%) translateX(-50%)',
			display: 'block'
		})
	}
}



export default locationBtn