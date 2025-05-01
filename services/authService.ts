import { useCookie } from 'nuxt/app';
import { createBaseService } from './baseService';

interface ApiErrorResponse {
  code: string;
  message: string;
  uuid: string | null;
  time: string;
}

export interface LoginResponse {
  token: string;
  // اضافه کردن سایر فیلدهای مورد نیاز از پاسخ API
}

export interface LoginRequest {
  username: string;
  password: string;
  otpStrategyTypeId?: number | null;
  otpCode?: string;
}

export interface OtpRequest {
  username: string;
  password: string;
  otpStrategyTypeId: number | null;
}

export const createAuthService = (baseURL: string) => {
  const { apiClient, handleError, setAuthToken: baseSetAuthToken, removeAuthToken: baseRemoveAuthToken } = createBaseService(baseURL);
  const token = useCookie('token');

  return {
    async login(data: LoginRequest): Promise<LoginResponse> {
      try {
        const response = await apiClient.post('/login', data);
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    },

    async getOtpStrategies() {
      try {
        const response = await apiClient.get('/getOtpStrategies');
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    },

    async sendOtpForLogin(data: OtpRequest) {
      try {
        const response = await apiClient.post('/sendOtpForLogin', data);
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    },

    setAuthToken(newToken: string) {
      if (!newToken) {
        console.error('Invalid token provided');
        return;
      }
      token.value = newToken;
      baseSetAuthToken(newToken);
    },

    getAuthToken(): string | null {
      return token.value ?? null;
    },

    removeAuthToken() {
      token.value = null;
      baseRemoveAuthToken();
    },

    isAuthenticated(): boolean {
      return !!this.getAuthToken();
    }
  };
}; 