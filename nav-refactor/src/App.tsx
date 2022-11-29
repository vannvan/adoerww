import { useCallback, useEffect, useRef, useState } from 'react'
import WEBSITE from './website'
import { HOVER_CLASS, THEME_COLOR } from './config'
import './App.less'
import Swiper from 'swiper/js/swiper.js' // 引入js
import logo from './assets/logo.png'

import 'swiper/css/swiper.min.css' // 引入样式
import './hover.css'

const WEEK = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const [backgroundImage, setBackgroundImage] = useState<string>(
    'https://tva3.sinaimg.cn/large/9bd9b167gy1g2rkyjhn3vj21hc0u0tjq.jpg'
  )

  const STORE_BACK_KEY = 'background'

  const LIMIT_TIME = 1000 * 60 * 60 * 2

  const swiper = useRef(null)

  const timer: any = useRef(null)

  const [websiteList, setWebsiteList] = useState<TWebsite>()

  const [todayText, setTodayText] = useState<string>('')

  const [timeString, setTimeString] = useState<string>(
    new Date().toLocaleString().split(' ')[1].substr(0, 5)
  )

  // https://api.vvhan.com/api/en?type=sj

  useEffect(() => {
    // 加工一下列表

    const _list = [...WEBSITE].map((el) => {
      const len = el.linkList.length
      if (len % 5 != 0) {
        const add = Array.from({ length: 5 - (len % 5) }, (v, k) => {
          return {
            name: '',
            link: '',
          }
        })
        el.linkList = [...el.linkList, ...add]
      }
      return el
    })
    setWebsiteList(_list)

    // 背景
    const storeBg = localStorage.getItem(STORE_BACK_KEY)
    if (storeBg) {
      const { time, url } = JSON.parse(storeBg)
      // 如果过期了再换
      if (new Date().getTime() - time > LIMIT_TIME) {
        initBackground()
      }
    }

    // 键盘
    document.onkeydown = function (event) {
      let inputValue = (document.getElementById('input') as any).value
      let baiduWord = 'https://www.baidu.com/s?wd='
      let baiduTranslate = 'https://fanyi.baidu.com/#zh/en/'
      let youdaoTranslate = 'http://dict.youdao.com/w/'

      if ((event.ctrlKey || event.metaKey) && event.keyCode == 13) {
        window.open(baiduTranslate + inputValue)
        return
      }
      if (event.altKey && event.keyCode == 13) {
        window.open(youdaoTranslate + inputValue)
        return
      }
      if (event.keyCode == 13 && inputValue) {
        window.open(baiduWord + inputValue)
      }
    }

    // 主题
    let currentHour = new Date().getHours()
    let theme =
      currentHour < 19 || window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark'
    setTheme(theme as any)
    // swiper
    setTimeout(() => {
      swiper.current = new Swiper('.swiper-container', {
        direction: 'vertical',
        loop: true,
        // observer: true, //开启动态检查器，监测swiper和slide
        // speed: 800,
        runCallbacksOnInit: true,
        mousewheel: true,
        on: {
          slideChange: function () {
            const _this = this as any
            setCurrentIndex(_this.realIndex)
            // console.log(_this.realIndex, _this.activeIndex)
            // if (_this.activeIndex > WEBSITE.length) {
            //   setCurrentIndex(0)
            // } else {
            //   setCurrentIndex(_this.activeIndex - 1)
            // }
          },
        },
      })
    }, 1000)

    // 今天的话
    getTodayText()

    //
    timer.current = setInterval(() => {
      setTimeString(new Date().toLocaleString().split(' ')[1].substr(0, 5))
    }, 60)

    return () => {
      clearInterval(timer.current)
    }
  }, [])

  // 背景
  const initBackground = () => {
    fetch('https://api.btstu.cn/sjbz/api.php?lx=fengjing&format=json').then(async (res) => {
      if (res) {
        const { imgurl } = await res.json()
        setBackgroundImage(imgurl)
        localStorage.setItem(
          STORE_BACK_KEY,
          JSON.stringify({
            time: new Date().getTime(),
            url: imgurl,
          })
        )
      }
    })
  }

  const locationTo = (index: number) => {
    setCurrentIndex(index)
    swiper.current && (swiper.current as any).slideTo(index + 1, 0)
  }

  const changeTheme = useCallback(() => {
    const targetTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(targetTheme)
  }, [theme])

  const openPage = (link: string) => {
    window.open(link)
  }

  const getRandomHover = () => {
    let className = HOVER_CLASS[Math.floor(Math.random() * HOVER_CLASS.length)] //随机
    return className
  }

  // 今日励志
  const getTodayText = () => {
    fetch('https://api.vvhan.com/api/en?type=sj').then(async (res) => {
      const { data } = await res.json()
      if (data) {
        setTodayText(data.zh)
      }
    })
  }

  return (
    <div className="content" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="left" style={{ background: THEME_COLOR[theme].leftBarBgColor }}>
        <div className="logo">
          <img src={logo} />
        </div>

        <div className="menu-content" style={{ color: THEME_COLOR[theme].linkFontColor }}>
          {WEBSITE.map((el, index) => (
            <div
              key={el.name}
              className="menu-item"
              onClick={() => locationTo(index)}
              style={{
                background:
                  currentIndex == index
                    ? THEME_COLOR[theme].activeBgColor
                    : THEME_COLOR[theme].leftBarBgColor,
              }}>
              <span className={['iconfont', el.icon].join(' ')}></span>
              <div className="tooltip">{el.name}</div>
            </div>
          ))}
        </div>
        <div className="extend-tool">
          <div
            className="tool-item"
            onClick={() => initBackground()}
            style={{ color: THEME_COLOR[theme].linkFontColor }}>
            <span className="iconfont icon-fengche"></span>
          </div>
          <div
            className="tool-item"
            onClick={() => changeTheme()}
            style={{ color: THEME_COLOR[theme].linkFontColor }}>
            <span
              className={[
                'iconfont',
                'theme-icon',
                theme === 'light' ? 'icon-taiyang' : 'icon-yueliang',
              ].join(' ')}></span>
          </div>
        </div>
      </div>
      <div className="right">
        <div className="time-wrap">
          <p className="time">{timeString}</p>
          <p className="date">
            {window.dayjs().format('MM月DD日')} {WEEK[window.dayjs().format('d') - 1]}
          </p>
        </div>
        <div id="SearchWrap" className="search-wrap">
          <span
            className="iconfont icon-linggan prefix"
            style={{ color: THEME_COLOR[theme].inputColor }}></span>
          <input
            type="text"
            id="input"
            placeholder="⏎百度搜索 | ⌘ + ⏎百度翻译 | ⎇ + ⏎有道翻译"
            style={{
              color: THEME_COLOR[theme].inputColor,
              background: THEME_COLOR[theme].inputBgColor,
              borderColor: THEME_COLOR[theme].inputColor,
            }}
          />
          <span
            className="iconfont icon-sousuo search-icon"
            style={{ color: THEME_COLOR[theme].inputColor }}></span>
          {/* <button style={{ background: THEME_COLOR[theme].inputColor }}>灵感来了</button> */}
        </div>
        <div className="web-content">
          <div className="swiper-container">
            <div className="swiper-wrapper" style={{ color: '#fff' }}>
              {websiteList ? (
                websiteList.map((el, index) => (
                  <div
                    className={['web-p-content', 'swiper-slide', 'web-p-content' + index].join(' ')}
                    key={el.name}>
                    <div className="link-content">
                      {el.linkList.map((link, subIndex) => (
                        <div
                          onClick={() => link.link && openPage(link.link)}
                          className={[
                            'link-item',
                            link.name && getRandomHover(),
                            !link.name ? 'empty' : '',
                          ].join(' ')}
                          key={link.name + subIndex}
                          style={{
                            background: THEME_COLOR[theme].rightLinkItemBgColor,
                            color: THEME_COLOR[theme].linkFontColor,
                          }}>
                          {link.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="swiper-pagination"></div>
        </div>
        <div className="today-text">「{todayText}」</div>
      </div>
    </div>
  )
}

export default App
