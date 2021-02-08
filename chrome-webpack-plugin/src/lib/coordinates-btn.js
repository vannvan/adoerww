import { isEmpty } from '@/lib/utils'
const coordinatesBtn = ($a) => {
	let $firstImg = $a.find('img:first-child'),
		href = '',
		crawlTop,
		crawlLeft,
		firstImgTop,
		firstImgLeft,
		top,
		left
	if (status == 'hy') $firstImg = $a
	href = $a.attr('href')
	crawlTop = $crawl.offset().top
	crawlLeft = $crawl.offset().left
	if ($firstImg.length > 0) {
		firstImgTop = $firstImg.offset().top
		firstImgLeft = $firstImg.offset().left
	} else {
		firstImgTop = $a.offset().top
		firstImgLeft = $a.offset().left
	}
	firstImgLeft ? (left = firstImgLeft) : (left = crawlLeft)
	firstImgTop ? (top = firstImgTop) : (top = crawlTop)
	
	let $firstImg = $a.find('img:first-child')
	let crawlTop, crawlLeft, contentWidth, contentHeight
	if (!isEmpty($a.offset().top)) {
		crawlTop = $a.offset().top
		crawlLeft = $a.offset().left
		contentWidth = $a.innerWidth()
		contentHeight = $a.innerHeight()
	}
}



export default coordinatesBtn