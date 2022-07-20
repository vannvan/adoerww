import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Button from './Button'

test('哈哈哈', () => {
  let count = 1
  const incrementCount = (increment) => {
    count += increment
  }
  const { container } = render(<Button increment={1} onClickFunction={incrementCount} />)

  const button = container.firstChild
})
