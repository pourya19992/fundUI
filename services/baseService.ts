import axios from "axios";
import type { AxiosInstance } from "axios";
import { ACCESS_TOKEN_NAME, HTTP_HEADERS, DEFAULT_TENANT_ID } from "../utils/constants";
import { navigateTo } from 'nuxt/app';

export interface ApiErrorResponse {
  code: string;
  message: string;
  uuid: string | null;
  time: string;
}

export interface ApiResponse {
  message: string;
  data?: any;
}

export interface PagedResponse<T> {
  totalElements: number;
  totalPages: number;
  size: number;
  content: T[];
  number: number;
  sort: any;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  pageable: any;
  empty: boolean;
}

export const createBaseService = (baseURL: string) => {
  const apiClient: AxiosInstance = axios.create({
    baseURL,
    headers: {
      [HTTP_HEADERS.CONTENT_TYPE]: 'application/json',
      [HTTP_HEADERS.ACCEPT]: 'application/json',
      [HTTP_HEADERS.TENANT_ID]: DEFAULT_TENANT_ID
    }
  });

  // Add request interceptor to include token
  apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_NAME);
    if (token) {
      config.headers[HTTP_HEADERS.AUTHORIZATION] = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  // Add response interceptor to handle errors
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response) {
        // Handle 401 and 403 errors
        if ([401, 403].includes(error.response.status)) {
          localStorage.removeItem(ACCESS_TOKEN_NAME);
          // Store the current path to redirect back after login
          const currentPath = window.location.pathname;
          if (currentPath !== '/auth/login') {
            localStorage.setItem('redirectPath', currentPath);
          }

          let errorMessage = 'شما دسترسی لازم برای مشاهده این صفحه را ندارید';
          if (error.response.data?.message) {
            errorMessage = error.response.data.message;
          }

          await navigateTo(`/auth/unauthorized?message=${encodeURIComponent(errorMessage)}`);
        }
        return Promise.reject(error.response.data);
      }
      return Promise.reject(error);
    }
  );

  return {
    apiClient,
    handleError: (error: unknown) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
  };
};