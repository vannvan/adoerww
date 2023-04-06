import { type } from 'os'

export interface IAccountInfo {
  userName: string
  password: string
}

export interface ILoginResponse {
  ok: boolean
  goto: string
  user: {
    id: string
    login: string
    name: string
    description: string
  }
}

export interface ICookies {
  expired: number
  data: string
}

export type TBookItem = {
  id: string
  slug: string
  name: string
  user: {
    name: string
  }
}

export type TBookStackItem = {
  books: TBookItem[]
  name: string
  id: number
}

export interface IBookStack {
  data: TBookStackItem[]
}
