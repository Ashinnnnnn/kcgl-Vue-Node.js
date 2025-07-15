import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  // 要保存的数据
  state: () => ({
    token: null,
    user: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  // 定义操作数据的方法
  actions: {
    setToken(token) {
      this.token = token
    },
    setUser(user) {
      this.user = user
    },
    clearToken() {
      this.token = null
    },
    logout() {
      this.clearToken()
      this.user = null
    },
  },
  // 这个store中的数据会持久化保存. 可以查看 localStorage
  persist: true,
})
