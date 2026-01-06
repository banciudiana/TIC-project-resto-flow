import { defineStore } from 'pinia';
import { authService } from '../services/authService';

export const useAuthStore = defineStore('auth', {
  
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),

  
  actions: {
    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        
        const userData = await authService.login(email, password);
        this.user = userData;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      await authService.logout();
      this.user = null; 
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.user 
  }
});