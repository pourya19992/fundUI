import { defineNuxtPlugin } from 'nuxt/app';
import { createAuthService } from '../services/auth/authService';

export default defineNuxtPlugin(() => {
  const auth = createAuthService();

  return {
    provide: {
      auth
    }
  };
}); 