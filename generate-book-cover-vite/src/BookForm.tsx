import React, { useEffect, useRef, useState } from 'react'
import {
  MinusCircleOutlined,
  PlusOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import { Button, Form, Input, message, Select, Space } from 'antd'
import { fileToBase64 } from './utils'

interface IBookForm {
  generateHandler: (bookList: TBookInfo[]) => void
}
const STORE_KEY = 'bookList'

const BookForm = (props: IBookForm) => {
  const { generateHandler } = props

  const [form] = Form.useForm()

  const fileInput = useRef<HTMLInputElement>(null)

  const [currentUploadIndex, setCurrentUploadIndex] = useState<number>(0)

  useEffect(() => {
    const list = localStorage.getItem(STORE_KEY)
    if (list) {
      form.setFieldsValue({
        books: JSON.parse(list),
      })
    }
  }, [])

  const onFinish = (values: any) => {
    // console.log('Received values of form:', values)
    const bookList = [...values.books].map((el) => {
      return {
        ...el,
        id: Math.random().toString(36).substring(2),
      }
    })
    localStorage.setItem(STORE_KEY, JSON.stringify(bookList))
    typeof generateHandler === 'function' && generateHandler(bookList)
  }

  const fileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files
    if (file) {
      const { books } = await form.getFieldsValue()
      const _newBookList = [...books]
      fileToBase64(file[0], (base64: string) => {
        // console.log('base64', base64)
        if (currentUploadIndex > -1) {
          _newBookList[currentUploadIndex].coverLink = base64
          form.setFieldsValue({
            books: _newBookList,
          })
        }
      })
    }
  }

  const preUpload = (index: number) => {
    setCurrentUploadIndex(index)
    if (fileInput.current) {
      fileInput.current.value = ''
      fileInput.current.dispatchEvent(new MouseEvent('click'))
    }
  }

  const storeForm = async () => {
    localStorage.setItem(
      STORE_KEY,
      JSON.stringify(await form.getFieldsValue().books)
    )
  }

  return (
    <Form
      form={form}
      name="dynamic_form_complex"
      onFinish={onFinish}
      autoComplete="off">
      <input
        id="Import"
        type="file"
        accept=".jpg,jpeg,.png"
        style={{ display: 'none' }}
        ref={fileInput}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => fileChange(e)}
      />
      <Form.List name="books">
        {(fields, { add, remove }) => (
          <div>
            {fields.map((field, index) => (
              <div
                key={field.key}
                style={{
                  background: '#f5f5f5',
                  marginBottom: 20,
                  padding: 16,
                  position: 'relative',
                  borderRadius: 4,
                }}>
                <Form.Item
                  label="封面链接"
                  name={[field.name, 'coverLink']}
                  rules={[{ required: true, message: '请输入链接' }]}>
                  <Input style={{ width: '80%' }} />
                </Form.Item>
                <Button
                  onClick={() => preUpload(index)}
                  type="primary"
                  style={{ position: 'absolute', top: 16, right: 16 }}>
                  上传
                </Button>
                <Space>
                  <Form.Item
                    label="书籍名称"
                    name={[field.name, 'bookName']}
                    rules={[{ required: true, message: '请输入名称' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="书籍作者"
                    name={[field.name, 'bookAuthor']}
                    rules={[{ required: true, message: '请输入作者' }]}>
                    <Input />
                  </Form.Item>
                </Space>

                <CloseCircleOutlined
                  onClick={() => remove(field.name)}
                  style={{
                    position: 'absolute',
                    top: -8,
                    fontSize: 20,
                    color: '#ff7875',
                  }}
                />
              </div>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => {
                  form
                    .validateFields()
                    .then((values) => {
                      add()
                      storeForm()
                    })
                    .catch((error) => {
                      // message.error({
                      //   content: '请完善信息再添加',
                      // })
                    })
                }}
                block
                icon={<PlusOutlined />}>
                添加书籍
              </Button>
            </Form.Item>
          </div>
        )}
      </Form.List>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            生成封面
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default BookForm
