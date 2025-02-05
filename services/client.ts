import axios from "axios";
import { useCookie } from "#app";
import { useRuntimeConfig, navigateTo } from "#imports";
import { ACCESS_TOKEN_NAME } from "~/utils/constants";

export interface ErrorData {
  errorMessage: string;
  errorCode: number;
  errorStatus: number;
  uuid: null;
}

// -------------------------Create an authenticated API instance----------------
export const createAuthenticatedAxiosInstance = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase;
  const token = useCookie(ACCESS_TOKEN_NAME);

  const instance = axios.create({ baseURL });

  instance.interceptors.request.use((config) => {
    if (token.value) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token.value}`;
    }
    return config;
  });

  instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if ([401, 403].includes(error.response?.status)) {
          token.value = null;
          navigateTo("/");
        }
        return Promise.reject(error);
      }
  );

  return instance;
};
//------------------ Create an unauthenticated API instance---------------------
export const createUnauthenticatedAxiosInstance = () => {
  const config = useRuntimeConfig();
  const baseURL: string = config.public.API_BASE_URL as string;

  const instance = axios.create({
    baseURL,
    headers: {
      clientId: config.public.CLIENT_ID as string
    }
  });

  return instance;
};