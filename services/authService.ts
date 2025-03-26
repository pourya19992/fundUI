import axios from 'axios';
import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();
const tenantId = "90001";

const apiClient = axios.create({
  baseURL: config.public.apiBase,
  headers: {
    "X-TenantId": tenantId,
  },
});

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

class AuthService {
  private apiBase = config.public.apiBase;

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post(`${this.apiBase}/login`, data);
    return response.data;
  }

  async getOtpStrategies() {
    const response = await apiClient.get(`${this.apiBase}/getOtpStrategies`);
    return response.data;
  }

  async sendOtpForLogin(data: OtpRequest) {
    const response = await apiClient.post(`${this.apiBase}/sendOtpForLogin`, data);
    return response.data;
  }

  setAuthToken(token: string) {
    localStorage.setItem('token', token);
    // تنظیم توکن برای درخواست‌های بعدی
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  removeAuthToken() {
    localStorage.removeItem('token');
    delete apiClient.defaults.headers.common['Authorization'];
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const authService = new AuthService(); 