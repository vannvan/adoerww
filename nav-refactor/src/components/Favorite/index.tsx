import { useState, useEffect } from 'react'
import { THEME_COLOR } from '../../config'
import { randomColor } from '../../utils'
import './index.less'

interface IFavorite {
  webInfo: any
  theme: 'light' | 'dark'
}

const Favorite = (props: IFavorite) => {
  const { webInfo, theme } = props
  const [webList, setWebList] = useState<TWebsite[]>()

  useEffect(() => {
    setWebList(webInfo.linkList)
  }, [])
  return (
    <>
      <div className="favorite-content">
        {webList &&
          webList.map((link: any, index: number) => (
            <div
              onClick={() => link.link && window.open(link.link)}
              key={link.name + index}
              style={{ background: THEME_COLOR[theme].rightLinkItemBgColor }}
              onMouseEnter={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                e.preventDefault()
                const targetStyle = theme === 'dark' ? 'light' : 'dark'
                const t = e.currentTarget
                t.style.background = THEME_COLOR[targetStyle].rightLinkItemBgColor
                t.style.color = THEME_COLOR[targetStyle].linkFontColor
              }}
              onMouseLeave={(e) => {
                e.preventDefault()
                const t = e.currentTarget
                t.style.background = THEME_COLOR[theme].rightLinkItemBgColor
                t.style.color = THEME_COLOR[theme].linkFontColor
              }}
              className={['link-item', !link.name ? 'empty' : ''].join(' ')}>
              {link.logo ? (
                <img src={link.logo} className="logo" />
              ) : (
                <div
                  className="logo random-logo"
                  style={{
                    background: randomColor(),
                  }}>
                  {link.name.charAt(0).toUpperCase()}
                </div>
              )}
              <p className="name" style={{ color: THEME_COLOR[theme].linkFontColor }}>
                {link.name}
              </p>
            </div>
          ))}
      </div>
    </>
  )
}

export default Favorite
