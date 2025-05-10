import axios, { AxiosError } from 'axios';
import { useCookie } from 'nuxt/app';

export interface Fund {
  id: number;
  name: string;
  isETF: boolean;
}

export interface FundDto {
  id?: number;
  name: string;
  isETF: boolean;
}

export interface Calendar {
  id: number;
  calendarDate: string;
  isOff: boolean;
  isVacation: boolean;
}

export interface CalendarDto {
  id?: number;
  calendarDate: string;
  isOff: boolean;
  isVacation: boolean;
}

export interface FundBranch {
  id: number;
  isActive: boolean;
  code: string;
  name: string;
  manager: string;
  phone: string;
  fax: string;
  cellPhone: string;
  postalCode: string;
  address: string;
}

export interface FundBranchDto {
  id?: number;
  isActive: boolean;
  code: string;
  name: string;
  manager?: string;
  phone?: string;
  fax?: string;
  cellPhone?: string;
  postalCode?: string;
  address?: string;
}

interface ApiErrorResponse {
  code: string;
  message: string;
  uuid: string | null;
  time: string;
}

export const createFundService = (baseURL: string) => {
  const apiClient = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'X-TenantId': '90001'
    }
  });

  const token = useCookie('token');

  apiClient.interceptors.request.use((config) => {
    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`;
    }
    return config;
  });

  const handleError = (error: unknown): never => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data;
        throw errorData;
      }
    }
    throw error;
  };

  return {
    // Fund operations
    async getFundList(fundId?: number): Promise<Fund[]> {
      try {
        const url = fundId
          ? `/api/v1/administration/fund/${fundId}`
          : '/api/v1/administration/fund';
        const response = await apiClient.get(url);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async addFund(fund: FundDto): Promise<void> {
      try {
        await apiClient.post('/api/v1/administration/fund/add', fund);
      } catch (error) {
        throw error;
      }
    },

    async updateFund(fund: FundDto): Promise<void> {
      try {
        await apiClient.put('/api/v1/administration/fund/edit', fund);
      } catch (error) {
        throw error;
      }
    },

    async deleteFund(fundId: number): Promise<void> {
      try {
        await apiClient.delete(`/api/v1/administration/fund/remove/${fundId}`);
      } catch (error) {
        throw error;
      }
    },

    // Calendar operations
    async getCalendarList(calendarId?: number): Promise<Calendar[]> {
      try {
        const url = calendarId
          ? `/api/v1/administration/calendar/${calendarId}`
          : '/api/v1/administration/calendar';
        const response = await apiClient.get(url);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  };
}; 