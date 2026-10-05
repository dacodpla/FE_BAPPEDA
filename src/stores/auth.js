import { defineStore } from 'pinia'
import { authApi } from '@/api/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    /** null = not yet fetched, true/false = resolved */
    isReady: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    role: (state) => state.user?.role || null,
  },
  actions: {
    async fetchMe() {
      try {
        const { data } = await authApi.me()
        this.user = data.data
      } catch {
        this.user = null
      } finally {
        this.isReady = true
      }
      return this.user
    },

    async login(email, password) {
      const { data } = await authApi.login(email, password)
      this.user = data.data
      this.isReady = true
      return this.user
    },

    async logout() {
      try {
        await authApi.logout()
      } catch {
        // Ignore — we clear local state regardless so the user can't get stuck.
      }
      this.user = null
    },
  },
})
