import { useCallback, useEffect, useState } from 'react'
import WEBSITE from './website'
import { THEME_COLOR } from './config'
import './App.less'
import { debounce } from 'lodash'

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const [contentHeight, setContentHeight] = useState<number>(0)

  let scrollTop = 0
  let topValue = 0

  let scrollFlag = true

  let _currentIndex = 0
  const bindHandleScroll = () => {
    const content = document.querySelector('.web-content') as any
    const _contentHeight = 400

    scrollTop = content.scrollTop
    if (scrollFlag) {
      if (scrollTop <= topValue) {
        console.log('向上')
        _currentIndex -= 1
        setCurrentIndex(_currentIndex + 1)
        // setIsShow(false)
      } else {
        console.log('向下')
        _currentIndex += 1
        setCurrentIndex(_currentIndex - 1)
        // setIsShow(true)
      }

      setTimeout(() => {
        console.log('_currentIndex', _currentIndex)
        const target = (_currentIndex + 1 + 1) * _contentHeight
        console.log(document.querySelector('.web-p-content' + currentIndex))
        // document.querySelector('.web-p-content' + currentIndex).style.transform = translateY(${target}px)`
        // document.querySelector('.web-p-content')[
        //   _currentIndex
        // ].style.transform = `translateY(${target})`
        // content.scroll(0, (_currentIndex + 1 + 1) * _contentHeight)
        scrollFlag = true
        topValue = scrollTop
      }, 600)
      scrollFlag = false
    }
  }

  useEffect(() => {
    const content = document.querySelector('.web-content') as any
    setTimeout(() => {
      const height = (document.querySelector('.web-p-content') as any).offsetHeight
      setContentHeight(height)
    }, 500)
    content.addEventListener('scroll', debounce(bindHandleScroll, 600))
    return () => {
      content.removeEventListener('scroll', bindHandleScroll)
    }
  }, [])

  return (
    <div className="content">
      <div className="left" style={{ background: THEME_COLOR[theme].leftBarBgColor }}>
        <div className="logo">logo</div>
        <div className="menu-content" style={{ color: THEME_COLOR[theme].linkFontColor }}>
          {WEBSITE.map((el) => (
            <div key={el.name} className="menu-item">
              <span className={['iconfont', el.icon].join(' ')}></span>
              <span className="name">{el.name}</span>
            </div>
          ))}
          <div className="count">已收录{WEBSITE.map((el) => el.linkList).flat().length}</div>
        </div>
      </div>
      <div className="right">
        <div id="SearchWrap" className="search-wrap">
          <input
            type="text"
            id="input"
            placeholder="⏎百度搜索 | ⌘ + ⏎百度翻译 | ⎇ + ⏎有道翻译"
            style={{
              color: THEME_COLOR[theme].inputColor,
              borderColor: THEME_COLOR[theme].inputColor,
            }}
          />
          <button style={{ background: THEME_COLOR[theme].inputColor }}>灵感来了</button>
        </div>
        <div className="web-content">
          {WEBSITE.map((el, index) => (
            <div
              className={['web-p-content', 'web-p-content' + index].join(' ')}
              style={{ opacity: currentIndex == index ? 1 : 0 }}
              key={el.name}>
              <div className="p-name">{el.name}</div>
              <div className="link-content">
                {el.linkList.map((link, subIndex) => (
                  <div className="link-item" key={link.name + subIndex}>
                    {link.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
