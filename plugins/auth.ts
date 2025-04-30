import { createAuthService } from '../services/authService';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const auth = createAuthService(config.public.apiBase);

  return {
    provide: {
      auth
    }
  };
}); 