import React, { useEffect, useState } from 'react'
import {
  MinusCircleOutlined,
  PlusOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import { Button, Form, Input, Select, Space } from 'antd'

interface IBookForm {
  generateHandler: (bookList: TBookInfo[]) => void
}
const STORE_KEY = 'bookList'

const BookForm = (props: IBookForm) => {
  const { generateHandler } = props
  const [form] = Form.useForm()

  const [initialValue, setInitialValue] = useState<TBookInfo[]>(
    JSON.parse(localStorage.getItem(STORE_KEY) as any)
  )

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

  const handleChange = () => {
    form.setFieldsValue({ sights: [] })
  }

  return (
    <Form
      form={form}
      name="dynamic_form_complex"
      onFinish={onFinish}
      autoComplete="off">
      <Form.List name="books" initialValue={initialValue}>
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
                  rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Space>
                  <Form.Item
                    label="书籍名称"
                    name={[field.name, 'bookName']}
                    rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="书籍作者"
                    name={[field.name, 'bookAuthor']}
                    rules={[{ required: true }]}>
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
                onClick={() => add()}
                block
                icon={<PlusOutlined />}>
                添加书籍
              </Button>
            </Form.Item>
          </div>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          生成封面
        </Button>
      </Form.Item>
    </Form>
  )
}

export default BookForm
