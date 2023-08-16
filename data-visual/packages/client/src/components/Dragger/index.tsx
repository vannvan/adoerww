import { useEffect, useRef, useState } from 'react'

type DragData = {
  left: number
  top: number
  width: number
  height: number
}

export type Boundary = {
  top: number
  bottom: number
  left: number
  right: number
}

interface Dragger {
  boundary: Boundary
}

const Dragger = (props: Dragger) => {
  const { boundary } = props

  // 是否按下鼠标
  const isMousedown = useRef(false)

  const [dragData, setDragData] = useState<DragData>()

  const calcStyle = {
    top: dragData?.top + 'px',
    left: dragData?.left + 'px',
  }

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // console.log(e.target)
    // console.log('onMouseDown', e)
    // https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/button
    // 只有一个鼠标按键时才能触发
    if (e.buttons !== 1) return
    isMousedown.current = true
    const el = e.target as HTMLElement
    const downX = e.clientX
    const downY = e.clientY

    const { left, top } = boundary

    const elRect = el.getBoundingClientRect()
    const mouseX = downX - elRect.left
    const mouseY = downY - elRect.top
    const onMousemove = (e: MouseEvent) => {
      const moveX = e.clientX - mouseX
      const moveY = e.clientY - mouseY

      setDragData({
        ...dragData,
        left: moveX - left,
        top: moveY - top,
      } as DragData)
    }

    const onMouseup = () => {
      isMousedown.current = false
      console.log('onMouseup')
      document.removeEventListener('mousemove', onMousemove)
      document.removeEventListener('mouseup', onMouseup)
    }
    document.addEventListener('mousemove', onMousemove)
    document.addEventListener('mouseup', onMouseup)
  }

  return (
    <div
      onMouseDown={(e) => onMouseDown(e)}
      style={{
        width: 200,
        height: 200,
        border: '1px solid #f00',
        position: 'absolute',
        color: '#fff',
        ...calcStyle,
      }}
    >
      啊啊啊
    </div>
  )
}

export default Dragger
