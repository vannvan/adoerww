declare module 'lodash'
declare module 'swiper/js/swiper.js'

type TWebsite = {
  name: string
  icon: string
  linkList: {
    name: string
    link: string
    icon?: string
  }[]
}[]
