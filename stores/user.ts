import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface UserState {
  user: User | null
  isAuthenticated: boolean
  token: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    isAuthenticated: false,
    token: null
  }),

  getters: {
    userRole: (state) => state.user?.role,
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    setUser(user: User | null) {
      this.user = user
      this.isAuthenticated = !!user
    },

    setToken(token: string | null) {
      this.token = token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
      this.setToken(null)
      localStorage.removeItem('token')
    }
  }
}) 