import React, { useState } from 'react'
import './App.css'
import Button from './Button'

const App = () => {
  const [count, setCount] = useState(0)
  const incrementCount = (increment) => {
    setCount(count + increment)
  }
  return (
    <div className="App">
      <div>learn react</div>
      <Button increment={1} onClickFunction={incrementCount} />
    </div>
  )
}

export default App
