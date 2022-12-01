import { useCallback, useEffect, useRef, useState } from 'react'
import WEBSITE from './website'
import { GITHUB_SITE, HOVER_CLASS, THEME_COLOR, WEEK } from './config'
import Swiper from 'swiper/js/swiper.js' // 引入js
import logo from './assets/logo.png'
import 'swiper/css/swiper.min.css' // 引入样式
import { getBackground, getLunarInfo, getTodayTextString } from './api'
import { getStoreData, randomColor, storeIsExpire, storeToLocal } from './utils'
import Favorite from './components/Favorite'
import './hover.css'
import './App.less'
import _ from 'lodash'
import dayjs from 'dayjs'
import solarLunar from 'solarlunar'

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const [backgroundImage, setBackgroundImage] = useState<string>(
    'https://tva3.sinaimg.cn/large/9bd9b167gy1g2rkyjhn3vj21hc0u0tjq.jpg'
  )

  const swiper = useRef(null)

  const timer: any = useRef(null)

  // 导航列表
  const [websiteList, setWebsiteList] = useState<TWebsite>()

  // 今天的话
  const [todayText, setTodayText] = useState<string>('')

  // 时间
  const [timeString, setTimeString] = useState<string>(
    new Date().toLocaleString().split(' ')[1].substr(0, 5)
  )

  // 农历
  const [lunarText, setLunarText] = useState<string>('')

  useEffect(() => {
    // 加工一下列表
    const _list = [...WEBSITE].map((el) => {
      const len = el.linkList.length
      const row = 8
      if (len % row != 0) {
        const add = Array.from({ length: row - (len % row) }, (v, k) => {
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

    // console.log('_list', _list)

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
        initialSlide: 0,
        runCallbacksOnInit: true,
        mousewheel: true,
        on: {
          slideChange: function () {
            const _this = this as any
            setCurrentIndex(_this.realIndex)
          },
        },
      })
    }, 1000)

    // 页面数据
    initPageData()

    timer.current = setInterval(() => {
      setTimeString(new Date().toLocaleString().split(' ')[1].substr(0, 5))
    }, 1000)

    return () => {
      clearInterval(timer.current)
    }
  }, [])

  /**
   * 调第三方接口
   */
  const initPageData = async () => {
    // 农历
    const solar2lunarData = solarLunar.solar2lunar(
      dayjs().year(),
      dayjs().month() + 1,
      dayjs().date()
    )
    const { gzYear, dayCn, monthCn } = solar2lunarData
    setLunarText(gzYear + monthCn + dayCn)

    // 背景
    if (storeIsExpire('background')) {
      initBackground(1)
    } else {
      const { imgurl } = getStoreData('background')
      setBackgroundImage(imgurl)
    }

    // 今天的话
    if (storeIsExpire('todayText')) {
      const text = await getTodayTextString()
      text && setTodayText(text)
      storeToLocal('todayText', { text })
    } else {
      const { text } = getStoreData('todayText')
      setTodayText(text)
    }
  }

  // 背景
  const initBackground = async (source: 1 | 2) => {
    const imgurl = await getBackground(source, 'fengjing')
    if (imgurl) {
      setBackgroundImage(imgurl as string)
      storeToLocal('background', { imgurl })
    }
  }

  /**
   * 定位到指定swiper
   * @param index
   */
  const locationTo = (index: number) => {
    setCurrentIndex(index)
    swiper.current && (swiper.current as any).slideTo(index + 1, 0)
  }

  /**
   * 更换主题
   */
  const changeTheme = useCallback(() => {
    const targetTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(targetTheme)
    storeToLocal('theme', targetTheme)
  }, [theme])

  /**
   * 随机hover样式
   * @returns
   */
  const getRandomHover = () => {
    let className = HOVER_CLASS[Math.floor(Math.random() * HOVER_CLASS.length)] //随机
    return className
  }

  //判断图片是否存在
  const checkImgExists = (imgurl: string) => {
    return new Promise(function (resolve, reject) {
      var ImgObj = new Image()
      ImgObj.src = imgurl
      ImgObj.onload = function (res) {
        resolve(res)
      }
      ImgObj.onerror = function (err) {
        reject(err)
      }
    })
  }

  return (
    <div className="content" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="left" style={{ background: THEME_COLOR[theme].leftBarBgColor }}>
        <div className="logo" onClick={() => window.open(GITHUB_SITE)}>
          <img src={logo} />
        </div>
        <div className="menu-content" style={{ color: THEME_COLOR[theme].linkFontColor }}>
          {WEBSITE.map((el, index) => (
            <div
              key={Math.random()}
              className="menu-item"
              onClick={() => locationTo(index)}
              style={{
                background:
                  currentIndex == index
                    ? THEME_COLOR[theme].activeBgColor
                    : THEME_COLOR[theme].leftBarBgColor,
              }}>
              <span className={['iconfont', el.icon].join(' ')}></span>
              {/* <p className="name">{el.name}</p> */}
              <div className="tooltip">{el.name}</div>
            </div>
          ))}
        </div>
        <div className="extend-tool">
          <div
            className="tool-item background-icon"
            style={{ color: THEME_COLOR[theme].linkFontColor }}>
            <span className="iconfont icon-fengche"></span>
            <div className="source-list">
              <li onClick={() => initBackground(1)}>资源一</li>
              <li onClick={() => initBackground(2)}>资源二</li>
            </div>
          </div>
          <div
            className="tool-item theme-icon"
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
        <div className="time-wrap" style={{ color: THEME_COLOR[theme].timeColor }}>
          <p className="time">{timeString}</p>
          <p className="date">
            {dayjs().format('MM月DD日')} {WEEK[(dayjs().format('d') as any) - 1]} {lunarText}
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
        </div>
        <div className="web-content">
          <div className="swiper-container">
            <div className="swiper-wrapper">
              {websiteList ? (
                websiteList.map((el, index) => (
                  <div
                    className={['web-p-content', 'swiper-slide', 'web-p-content' + index].join(' ')}
                    key={el.name + index}>
                    {index > 0 ? (
                      <div className="link-content" key={el.name + index}>
                        {el.linkList.map((link, subIndex) => (
                          <div
                            onClick={() => link.link && window.open(link.link)}
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
                            {link.logo ? (
                              <img src={link.logo} className="logo" />
                            ) : (
                              <div
                                className="logo random-logo"
                                style={{ background: randomColor() }}>
                                {link.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="name">{link.name}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div key={el.name + Math.random()}>
                        <Favorite webInfo={el} />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>
          </div>
          {/* <div className="swiper-pagination"></div> */}
        </div>
        <div className="today-text">「{todayText}」</div>
      </div>
    </div>
  )
}

export default App
