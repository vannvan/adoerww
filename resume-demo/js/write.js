/*
 *项目名: 个人简历
 *创建者: Edit
 *创建时间:2020.2.15 20:40:41
 *联系方式:15622749328(微信同号)
 *描述: 酷炫个人简历
 */

// Array[Object], ance: 当前children列表.
let parentList = []
let List = [] // Array[Object], ance: 当前children列表. current: 当前子元素遍历下标. 遍历方式从深处开始遍历,"树"的数据结构
function writeText(item, childArr = [], childIndex, parent = document.querySelector('.text-wrap')) {
  let data = {}
  if (childArr.length > 0) {
    data = childArr[childIndex]
  } else {
    data = item
  }
  let num = 0
  let text = data.text ? data.text : ''
  let dom = document.createElement(data.name)
  dom.setAttribute('class', data.class || '')
  parent.appendChild(dom)
  let timer = setInterval(() => {
    if (num <= text.length) {
      dom.innerHTML = text.substr(0, num)
      resume.scrollTop = 100000
      num++
    } else {
      clearInterval(timer)
      if (data.children) {
        List.push({
          ance: data.children,
          current: 0,
          length: data.children.length,
        })
        parentList.push(dom)
        writeText('', data.children, 0, dom)
      } else if (childArr.length > 0) {
        if (childArr.length - 1 > childIndex) {
          writeText('', childArr, ++childIndex, parentList[parentList.length - 1])
          List[List.length - 1].current = List[List.length - 1].current + 1
        } else {
          parentList.pop()
          filterLength()
        }
      } else if (textArr.length - 1 > currentIndex_) {
        //
        writeText(textArr[++currentIndex_])
        parentList = []
      }
    }
  }, 55)
}
function filterLength() {
  for (let i = List.length - 1; i >= 0; i--) {
    if (List[i].length - 1 == List[i].current) {
      List.pop()
    } else {
      List[List.length - 1].current = List[List.length - 1].current + 1
      break
    }
  }
  if (List.length > 0) {
    writeText(
      '',
      List[List.length - 1].ance,
      List[List.length - 1].current,
      parentList[parentList.length - 1]
    )
  } else if (textArr.length - 1 > currentIndex_) {
    writeText(textArr[++currentIndex_])
    parentList = []
  }
}
