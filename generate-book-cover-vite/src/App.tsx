import { useCallback, useState } from 'react'
import DEFAULT_IMG from './assets/default.jpg'
import './App.less'
import { Button, Card, Col, FloatButton, message, Popconfirm, Row } from 'antd'
import html2canvas from 'html2canvas'
import BookForm from './BookForm'
import { DownloadOutlined } from '@ant-design/icons'

function App() {
  const [bookList, setBookList] = useState<TBookInfo[]>([])

  const handleGenBookCover = (_bookList: TBookInfo[]) => {
    const _bookList_b = [..._bookList]
    setBookList(_bookList_b)
    setTimeout(() => {
      convertImage(_bookList_b)
    }, 500)
  }

  const convertImage = useCallback(
    (_bookList: TBookInfo[]) => {
      const list = document.querySelectorAll('.book-cover-content')
      const _newBookList: any = [...(_bookList as any)]
      if (list.length) {
        list.forEach((book: any) => {
          // console.log('book', book)
          html2canvas(book, {
            useCORS: true,
          }).then((html) => {
            const base64 = html.toDataURL('image/png', 1)
            const index = _newBookList?.findIndex(
              (el: any) => el.id === book.id
            )
            if (index > -1) {
              _newBookList[index].base64 = base64
              setBookList(_newBookList)
            }
          })
        })
      }
    },
    [bookList]
  )

  const downLoadImg = (imgsrc: string, name: string) => {
    if (imgsrc && name) {
      let a = document.createElement('a') //创建a元素
      let event = new MouseEvent('click') //  创建单击事件
      a.download = name || 'defaultName' // 设置图片名称
      a.href = imgsrc
      a.dispatchEvent(event) // 触发单击事件
    } else {
      message.error('无效链接')
    }
  }

  /**
   * 批量下载
   */
  const batchDownload = () => {
    bookList.map((el) => {
      downLoadImg(el.base64, `${el.bookName}-${el.bookAuthor}.png`)
    })
  }

  const imgUrlToBase64 = (imgUrl: String) => {
    return new Promise((resolve, reject) => {
      let img: any = new Image()
      img.src = imgUrl
      img.setAttribute('crossOrigin', 'anonymous')
      img.onload = function () {
        let canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        let ctx: any = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        let dataURL = canvas.toDataURL('image/png')
        resolve(dataURL)
        // resolve(dataURL.replace(/^data:image/(png|jpg);base64,/, ""));
      }
      img.onerror = function () {
        reject('The image could not be loaded.')
      }
    })
  }

  return (
    <div className="content">
      <div className="left">
        <BookForm
          generateHandler={(bookList: TBookInfo[]) =>
            handleGenBookCover(bookList)
          }
        />
      </div>
      <div className="right">
        <Row gutter={24}>
          {bookList?.map((el) => (
            <Col span={12} key={el.bookName}>
              <Card
                title={el.bookName}
                extra={
                  <a
                    href="#"
                    onClick={() =>
                      downLoadImg(
                        el.base64,
                        `${el.bookName}-${el.bookAuthor}.png`
                      )
                    }>
                    下载封面
                  </a>
                }>
                <div className="book-cover-content" id={el.id}>
                  <div className="cover-left">
                    <img
                      className="book-cover"
                      src={el.coverLink || DEFAULT_IMG}
                      alt="书籍封面"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <div className="cover-right">
                    <div className="book-title">{el.bookName}</div>
                    <div className="book-author">{el.bookAuthor}</div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      {bookList.length ? (
        <Popconfirm
          title="确认要下载全部?"
          onConfirm={() => batchDownload()}
          okText="Yes"
          placement="left"
          cancelText="No">
          <FloatButton icon={<DownloadOutlined />} type="primary"></FloatButton>
        </Popconfirm>
      ) : (
        <></>
      )}
    </div>
  )
}

export default App
