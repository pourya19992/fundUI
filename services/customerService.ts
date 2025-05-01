import axios from 'axios';

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
  customerBankAccount: {
    id: number;
    customer: string;
    bankAccount: {
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
    };
  };
  comments: string;
  profitRate: number;
  vat: boolean;
  sejam: boolean;
  smsSend: boolean;
  profitIssue: boolean;
  epaymentCustomer: boolean;
}

export interface CustomerDto {
  id?: number;
  detailLedgerId?: number;
  customerStatusId: number;
  customerBankAccountId?: number;
  person?: {
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
  };
  comments?: string;
  profitRate?: number;
  epaymentCustomer?: boolean;
  sejam?: boolean;
  smsSend?: boolean;
  vat?: boolean;
  profitIssue?: boolean;
}

export interface CustomerBankAccountDto {
  id?: number;
  customerId: number;
  bankAccountId: number;
}

export const createCustomerService = (baseURL: string) => {
  const apiClient = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'X-TenantId': '90001'
    }
  });

  // Add request interceptor to add token to all requests
  apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return {
    // Get customer list
    async getCustomerList(customerId?: number): Promise<Customer[]> {
      try {
        const url = customerId 
          ? `/api/v1/baseInformation/customer/${customerId}`
          : '/api/v1/baseInformation/customer';
        const response = await apiClient.get(url);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // Add new customer
    async addCustomer(customer: CustomerDto): Promise<void> {
      try {
        await apiClient.post('/api/v1/baseInformation/customer/add', customer);
      } catch (error) {
        throw error;
      }
    },

    // Add multiple customers
    async addCustomers(customers: CustomerDto[]): Promise<void> {
      try {
        await apiClient.post('/api/v1/baseInformation/customer/batch/add', customers);
      } catch (error) {
        throw error;
      }
    },

    // Edit customer
    async editCustomer(customer: CustomerDto): Promise<void> {
      try {
        await apiClient.put('/api/v1/baseInformation/customer/edit', customer);
      } catch (error) {
        throw error;
      }
    },

    // Edit multiple customers
    async editCustomers(customers: CustomerDto[]): Promise<void> {
      try {
        await apiClient.put('/api/v1/baseInformation/customer/batch/edit', customers);
      } catch (error) {
        throw error;
      }
    },

    // Remove customer
    async removeCustomer(customerId: number): Promise<void> {
      try {
        await apiClient.delete(`/api/v1/baseInformation/customer/remove/${customerId}`);
      } catch (error) {
        throw error;
      }
    },

    // Add customer bank account
    async addCustomerBankAccount(bankAccount: CustomerBankAccountDto): Promise<void> {
      try {
        await apiClient.post('/api/v1/baseInformation/customer/bankAccount/add', bankAccount);
      } catch (error) {
        throw error;
      }
    },

    // Edit customer bank account
    async editCustomerBankAccount(bankAccount: CustomerBankAccountDto): Promise<void> {
      try {
        await apiClient.put('/api/v1/baseInformation/customer/bankAccount/edit', bankAccount);
      } catch (error) {
        throw error;
      }
    },

    // Remove customer bank account
    async removeCustomerBankAccount(accountId: number): Promise<void> {
      try {
        await apiClient.delete(`/api/v1/baseInformation/customer/bankAccount/remove/${accountId}`);
      } catch (error) {
        throw error;
      }
    },

    // Set default bank account
    async setDefaultBankAccount(customerId: number, accountId: number): Promise<void> {
      try {
        await apiClient.put(`/api/v1/baseInformation/customer/${customerId}/bankAccount/default/${accountId}`);
      } catch (error) {
        throw error;
      }
    }
  };
}; 