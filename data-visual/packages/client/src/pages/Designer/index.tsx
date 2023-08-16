/*
 * Description:
 * Created: 2023-08-09 10:11:40
 * Author: van
 * Email : adoerww@gamil.com
 * -----
 * Last Modified: 2023-08-16 19:04:35
 * Modified By: van
 * -----
 * Copyright (c) 2023 https://github.com/vannvan
 */

import Moveable from 'react-moveable'
import { useEffect, useState } from 'react'
import Dragger, { Boundary } from '../../components/Dragger'
import { OnDrag, OnResize, OnScale } from 'moveable'

const Designer = () => {
  const [boundary, setBoundary] = useState<Boundary>()
  useEffect(() => {
    setBoundary({
      top: 49,
      bottom: document.documentElement.offsetHeight - 50,
      left: 300,
      right: document.documentElement.offsetWidth - 600,
    })
  }, [])

  return (
    <div id="content" style={{ height: 'fit-content' }}>
      <div style={{ height: 50, background: '#2f3542', borderBottom: '1px solid #ccc' }}></div>
      <div
        style={{ height: 'calc(100vh - 50px)', display: 'flex', justifyContent: 'space-between' }}
      >
        <div style={{ width: 300, background: '#2f3542', borderRight: '1px solid #ccc' }}></div>
        <div style={{ flex: 1, background: '#2d3436', position: 'relative', overflow: 'hidden' }}>
          <Dragger boundary={boundary as Boundary} />
        </div>
        <div style={{ width: 300, background: '#2f3542', borderLeft: '1px solid #ccc' }}></div>
      </div>
    </div>
  )
}

export default Designer
