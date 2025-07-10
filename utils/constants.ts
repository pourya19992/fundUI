export const ACCESS_TOKEN_NAME = "access_token";

// export const BASE_URL = "http://172.30.23.136:8080";
export const BASE_URL = "http://localhost:8080";


export const PAGE_SIZE = 10;

export const NUMBER_REGEX = /^[a-zA-Z0-9]*$/;

export const APP_MAIN_PAGE = "/main";

export const X_Tenant_Id = "X-TenantId";

export const ds_code = 90001;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    SEND_OTP: '/sendOtpForLogin',
    GET_OTP_STRATEGIES: '/getOtpStrategies'
  }
};

// HTTP Headers
export const HTTP_HEADERS = {
  TENANT_ID: 'X-TenantId',
  AUTHORIZATION: 'Authorization',
  CONTENT_TYPE: 'Content-Type',
  ACCEPT: 'Accept'
};

// Default Values
export const DEFAULT_TENANT_ID = '90001';
