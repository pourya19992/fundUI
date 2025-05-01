import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';

export interface ApiErrorResponse {
  code: string;
  message: string;
  uuid: string | null;
  time: string;
}

export const createBaseService = (baseURL: string) => {
  const apiClient: AxiosInstance = axios.create({
    baseURL,
    headers: {
      "X-TenantId": "90001",
      "Content-Type": "application/json"
    }
  });

  const handleError = (error: unknown): never => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.data) {
        throw axiosError.response.data;
      }
    }
    throw error;
  };

  const setAuthToken = (token: string) => {
    if (!token) {
      console.error('Invalid token provided');
      return;
    }
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const removeAuthToken = () => {
    delete apiClient.defaults.headers.common['Authorization'];
  };

  return {
    apiClient,
    handleError,
    setAuthToken,
    removeAuthToken
  };
}; 