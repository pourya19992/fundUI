import axios from 'axios';
import { createBaseService } from '../baseService';
import { BASE_URL, ACCESS_TOKEN_NAME } from '../../utils/constants';
import { useUserStore } from '@/stores/user';

export interface OtpRequestDto {
  username: string;
  password: string;
  otpStrategyTypeId: number;
}

export interface LoginDto {
  username: string;
  password: string;
  otpStrategyTypeId: number;
  otpCode: string;
}

export interface AuthResponse {
  token: string;
  // Add other response fields as needed
}

export const createAuthService = () => {
  const { apiClient, handleError } = createBaseService(BASE_URL);

  return {
    async getOtpStrategies(): Promise<Record<string, string>> {
      try {
        const response = await apiClient.get('api/v1/getOtpStrategies');
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    },

    async sendOtpForLogin(request: OtpRequestDto): Promise<void> {
      try {
        await apiClient.post('/sendOtpForLogin', request);
      } catch (error) {
        return handleError(error);
      }
    },

    async login(loginDto: LoginDto): Promise<string> {
      try {
        const response = await apiClient.post<string>('/login', loginDto);
        const token = response.data;
        localStorage.setItem(ACCESS_TOKEN_NAME, token);

        return token;
      } catch (error) {
        return handleError(error);
      }
    },


    async logout(): Promise<void> {
        try {
          const userStore = useUserStore();
          await apiClient.post('/logout');
          console.log("token2:"+ localStorage.getItem(ACCESS_TOKEN_NAME));
          localStorage.removeItem(ACCESS_TOKEN_NAME)
          userStore.logout();
          window.location.href = '/auth/login';
        } catch (error) {
        console.log("error:"+ error);
          throw error;
        }
      },

    isAuthenticated(): boolean {
      return !!localStorage.getItem(ACCESS_TOKEN_NAME);
    },

    getToken(): string | null {
      return localStorage.getItem(ACCESS_TOKEN_NAME);
    },

  };
};