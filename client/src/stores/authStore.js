import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    role: null,
    isLoggedIn: false
  }),
  actions: {
    
    setUser(userData, userRole) {
      this.user = userData
      this.role = userRole
      this.isLoggedIn = true
    },
    logout() {
      this.user = null
      this.role = null
      this.isLoggedIn = false
    }
  },
  getters: {
    isPatron: (state) => state.role === 'patron'
  }
})