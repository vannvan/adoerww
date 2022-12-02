import { useState, useEffect } from 'react'
import { randomColor } from '../../utils'
import './index.less'

interface IFavorite {
  webInfo: any
}

const Favorite = (props: IFavorite) => {
  const { webInfo } = props
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
              className={['link-item', !link.name ? 'empty' : ''].join(' ')}>
              {link.logo ? (
                <img src={link.logo} className="logo" />
              ) : (
                <div className="logo random-logo" style={{ background: randomColor() }}>
                  {link.name.charAt(0).toUpperCase()}
                </div>
              )}
              <p className="name">{link.name}</p>
            </div>
          ))}
      </div>
    </>
  )
}

export default Favorite
