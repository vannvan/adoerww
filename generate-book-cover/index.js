import html2canvas from 'html2canvas'
import $ from 'jquery'

const dataURLtoFile = (dataurl, filename) => {
  //将base64转换为文件
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, {
    type: mime,
  })
}

class BookCover {
  constructor() {
    this.timer = null
  }

  init() {
    // $('.book-cover').attr('src', 'http://127.0.0.1:3001/images/上瘾-尼尔·埃亚尔.jpeg')
    // $('.book-title').html('苏菲的世界')
    // $('.book-author').html('作者啊哈')
    // this.getBooks()
  }

  getBooks() {
    $.ajax({
      method: 'get',
      url: 'http://127.0.0.1:3001/list',
      success: (res) => {
        const { code, data: bookList } = res
        if (code === 0) {
          let i = 0
          this.timer = setInterval(async () => {
            await this.setBook(bookList[i])
            i++
          }, 3000)
        }
      },
    })
  }

  async setBook(bookInfo) {
    if (!bookInfo) {
      clearInterval(this.timer)
      console.log('封面处理完毕')
      alert('封面处理完毕')
      return
    }
    console.log('bookInfo', bookInfo)
    const { bookName, bookAuthor, fileName } = bookInfo
    $('.book-cover').attr('src', fileName)
    $('.book-title').html(bookName)
    $('.book-author').html(bookAuthor)
    setTimeout(async () => {
      await this.createImage(bookInfo)
    }, 500)
  }

  async createImage(bookInfo) {
    html2canvas(document.querySelector('.content'), {
      useCORS: true,
    }).then((html) => {
      const { bookName, bookAuthor } = bookInfo
      const base64 = html.toDataURL('image/png', 1)
      const formData = new FormData()
      const fileName = `${bookName}-${bookAuthor}.png`
      formData.append('file', dataURLtoFile(base64, fileName))
      $.ajax({
        type: 'post',
        url: 'http://127.0.0.1:3001/upload',
        data: formData,
        contentType: false,
        processData: false,
        success: (res) => {
          console.log('res', res)
        },
      })
    })
  }
}

const B = new BookCover()
B.init()
