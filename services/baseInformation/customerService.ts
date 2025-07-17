import { createBaseService } from '../baseService';

const API_URL = '/api/v1/baseInformation/customer';

export interface Customer {
  id: number;
  detailLedger: {
    id: number;
    name: string;
    code: string;
    detailLedgerType: {
      id: number;
      name: string;
      accountNature: {
        id: number;
        natureAccountName: string;
      };
    };
    isActive: boolean;
  };
  customerStatus: {
    id: number;
    name: string;
  };
  person: {
    id: number;
    isCompany: boolean;
    firstName: string;
    lastName: string;
    birthDate: string;
    nationalCode: string;
    postalCode: string;
    birthCertificationId: string;
    birthCertificationNumber: string;
    registrationNumber: string;
    issuingCity: string;
    fax: string;
    cellPhone: string;
    email: string;
    parent: string;
    phone: string;
    companyName: string;
    address: string;
    latinFirstName: string;
    latinLastName: string;
    isIranian: boolean;
    refId: number;
  };
  customerBankAccount?: CustomerBankAccount;
  comments: string;
  profitRate: number;
  vat: boolean;
  sejam: boolean;
  smsSend: boolean;
  profitIssue: boolean;
  epaymentCustomer: boolean;
}

export interface CustomerBankAccount {
  id: number;
  customer: string;
  bankAccount?: BankAccount
}

export interface BankAccount {
  id: number;
  isActive: boolean;
  bankAccountType: {
    id: number;
    name: string;
  };
  bank: {
    id: number;
    name: string;
    isValid: boolean;
  };
  accountNumber: string;
  annualinterest: number;
  shabaNumber: string;
}

export interface PersonDto {
  id?: number;
  isCompany: boolean;
  firstName: string;
  lastName: string;
  birthDate: string;
  nationalCode: string;
  postalCode?: string;
  birthCertificationId?: string;
  birthCertificationNumber?: string;
  registrationNumber?: string;
  issuingCity?: string;
  fax?: string;
  cellPhone?: string;
  email?: string;
  parent?: string;
  phone?: string;
  companyName?: string;
  address?: string;
  latinFirstName?: string;
  latinLastName?: string;
  isIranian?: boolean;
  refId?: number;
}

export interface CustomerResponseDto {
  id: number;
  detailLedgerId: number;
  dlNumber?: string;
  customerStatusId: number;
  customerStatusName?: string;
  customerBankAccountId?: number;
  customerBankName?: string;
  accountNumber?: string;
  shabaNumber?: string;
  person?: PersonDto;
  comments?: string;
  isSmsSend: boolean;
  isSejam: boolean;
  profitRate: number;
  isProfitIssue: boolean;
  isVat: boolean;
  isEpaymentCustomer: boolean;
}

export interface CustomerRequestDto {
  id?: number;
  detailLedgerId?: number;
  customerStatusId: number;
  customerBankAccountId?: number;
  person?: PersonDto;
  comments?: string;
  isSmsSend: boolean;
  isSejam: boolean;
  profitRate: number;
  isProfitIssue: boolean;
  isVat: boolean;
  isEpaymentCustomer: boolean;
}

export interface CustomerBankAccountDto {
  id?: number;
  customerId: number;
  bankAccountId: number;
}

interface ApiResponse {
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

export const createCustomerService = (baseURL: string) => {
  const { apiClient, handleError } = createBaseService(baseURL);

  return {
    async getAllCustomers(page?: number, size?: number): Promise<PagedResponse<CustomerResponseDto>> {
      try {
        const params: Record<string, any> = {};
        if (page !== undefined) params.page = page;
        if (size !== undefined) params.size = size;
        const response = await apiClient.get(`${API_URL}`, { params });
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    },

   // Get customer list
    async getCustomer(id: number) {
      try {
        const response = await apiClient.get(`${API_URL}/${id}`);
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    },

    // Add new customer
    async addCustomer(customer: CustomerRequestDto): Promise<ApiResponse> {
      try {
        const response = await apiClient.post(`${API_URL}/add`, customer);
        return {
          message: response.data.message || 'مشتری با موفقیت اضافه شد'
        };
      } catch (error) {
        return handleError(error);
      }
    },

    // Add multiple customers
    async addCustomers(customers: CustomerRequestDto[]): Promise<void> {
      try {
        await apiClient.post('/api/v1/baseInformation/customer/batch/add', customers);
      } catch (error) {
        throw error;
      }
    },

    // Edit customer
    async editCustomer(customer: CustomerRequestDto): Promise<ApiResponse> {
      try {
        const response = await apiClient.put(`${API_URL}/edit`, customer);
        return {
          message: response.data.message || 'مشتری با موفقیت ویرایش شد'
        };
      } catch (error) {
        return handleError(error);
      }
    },

    // Edit multiple customers
    async editCustomers(customers: CustomerRequestDto[]): Promise<void> {
      try {
        await apiClient.put('/api/v1/baseInformation/customer/batch/edit', customers);
      } catch (error) {
        throw error;
      }
    },

    // Remove customer
    async removeCustomer(customerId: number): Promise<void> {
      try {
        await apiClient.delete(`${API_URL}/remove/${customerId}`);
      } catch (error) {
        handleError(error);
      }
    },

    // Add customer bank account
    async addCustomerBankAccount(bankAccount: CustomerBankAccountDto): Promise<ApiResponse> {
      try {
        const response = await apiClient.post(`${API_URL}/bankAccount/add`, bankAccount);
        return {
          message: response.data.message || 'حساب بانکی با موفقیت اضافه شد'
        };
      } catch (error) {
        return handleError(error);
      }
    },

    // Edit customer bank account
    async editCustomerBankAccount(bankAccount: CustomerBankAccountDto): Promise<ApiResponse> {
      try {
        const response = await apiClient.put(`${API_URL}/bankAccount/edit`, bankAccount);
        return {
          message: response.data.message || 'حساب بانکی با موفقیت ویرایش شد'
        };
      } catch (error) {
        return handleError(error);
      }
    },

    // Remove customer bank account
    async removeCustomerBankAccount(accountId: number): Promise<void> {
      try {
        await apiClient.delete(`${API_URL}/bankAccount/remove/${accountId}`);
      } catch (error) {
        throw error;
      }
    },

    // Set default bank account
    async setDefaultBankAccount(customerId: number, accountId: number): Promise<void> {
      try {
        await apiClient.put(`${API_URL}/${customerId}/bankAccount/default/${accountId}`);
      } catch (error) {
        throw error;
      }
    }
  };
};