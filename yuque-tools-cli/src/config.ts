import path from 'path'

export const config = {
  host: 'https://www.yuque.com',
  /**
   * 输出目录
   */
  outputDir: './docs',
  publicKey: `-----BEGIN PUBLIC KEY-----
  MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCfwyOyncSrUTmkaUPsXT6UUdXx
  TQ6a0wgPShvebfwq8XeNj575bUlXxVa/ExIn4nOUwx6iR7vJ2fvz5Ls750D051S7
  q70sevcmc8SsBNoaMQtyF/gETPBSsyWv3ccBJFrzZ5hxFdlVUfg6tXARtEI8rbIH
  su6TBkVjk+n1Pw/ihQIDAQAB
  -----END PUBLIC KEY-----`,

  /**
   * cookie存储地址
   */
  get cookieFile() {
    return path.join(config.outputDir, '.meta/cookies.json')
  },
  /**
   * 用户信息存储地址
   */
  get userInfoFile() {
    return path.join(config.outputDir, '.meta/userinfo.json')
  },
  /**
   * 信息数据元目录
   */
  get metaDir() {
    return path.join(config.outputDir, '.meta')
  },
}
