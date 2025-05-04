import axios from "axios";

import { ACCESS_TOKEN_NAME, BASE_URL } from "../utils/constants";

export interface ErrorData {
  errorMessage: string;
  errorCode: number;
  errorStatus: number;
  uuid: null;
}

// -------------------------Create an authenticated API instance----------------
export const createAuthenticatedAxiosInstance = () => {
  const token = localStorage.getItem(ACCESS_TOKEN_NAME);

  const instance = axios.create({ 
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_NAME);
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        // Server responded with error
        console.error('Server Error:', error.response.data);
        if ([401, 403].includes(error.response.status)) {
          localStorage.removeItem(ACCESS_TOKEN_NAME);
          window.location.href = '/auth/login';
        }
        return Promise.reject(error.response.data);
      } else if (error.request) {
        // Request was made but no response
        console.error('Network Error:', error.request);
        return Promise.reject({ message: 'خطا در برقراری ارتباط با سرور' });
      } else {
        // Something else happened
        console.error('Error:', error.message);
        return Promise.reject({ message: 'خطای غیرمنتظره رخ داد' });
      }
    }
  );

  return instance;
};

//------------------ Create an unauthenticated API instance---------------------
export const createUnauthenticatedAxiosInstance = () => {
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        console.error('Server Error:', error.response.data);
        return Promise.reject(error.response.data);
      } else if (error.request) {
        console.error('Network Error:', error.request);
        return Promise.reject({ message: 'خطا در برقراری ارتباط با سرور' });
      } else {
        console.error('Error:', error.message);
        return Promise.reject({ message: 'خطای غیرمنتظره رخ داد' });
      }
    }
  );

  return instance;
};