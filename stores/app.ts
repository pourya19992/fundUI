import { defineStore } from 'pinia'

interface AppState {
  isLoading: boolean
  theme: 'light' | 'dark'
  sidebarOpen: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    isLoading: false,
    theme: 'light',
    sidebarOpen: false
  }),

  getters: {
    isDarkTheme: (state) => state.theme === 'dark'
  },

  actions: {
    setLoading(loading: boolean) {
      this.isLoading = loading
    },

    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
    },

    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    }
  }
}) 