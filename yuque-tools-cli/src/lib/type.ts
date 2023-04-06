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
