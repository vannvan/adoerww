// 用户信息
export default {
  state: {
    userInfo: null,
    menuList: []
  },
  mutations: {
    setUserInfo(state, newVal) {
      state.userInfo = newVal
    },

    setMenuList(state, payload) {
      state.menuList = payload
    }
  }
}
