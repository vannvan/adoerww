declare module 'lodash'
declare module 'swiper/js/swiper.js'
declare module 'solarlunar'

// type TWebsite = {
//   name: string
//   icon: string
//   linkList: {
//     name: string
//     link: string
//     logo?: string | null
//   }[]
// }[]

type TWebsite = {
  name: string
  icon: string
  linkList: {
    name: string
    link: string
    logo?: string | null
  }[]
}

interface Window {
  dayjs: any
  Swiper: any
}
