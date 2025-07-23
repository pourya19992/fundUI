import { createBaseService } from '../baseService';

const API_URL = '/api/v1/baseInformation/customer';

export interface Bank {
    id?: number;
    name: string;
    isValid: boolean;
}

export interface BankAccountType {
    id?: number;
    name: string;
}

export const createBankService = (baseURL: string) => {
const { apiClient, handleError } = createBaseService(baseURL);

return {
    async getBank(bankId: number): Promise<Bank> {
    try {
        const response = await apiClient.get(`${API_URL}/bank/${bankId}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
    },

    async getBankList(): Promise<Bank[]> {
        try {
        const response = await apiClient.get(`${API_URL}/bank`);
        return response.data;
        } catch (error) {
        return handleError(error)
        }
    },

    async getBankAccountType(bankAccountTypeId: number): Promise<BankAccountType> {
        try {
            const response = await apiClient.get(`${API_URL}/bankAccountType/${bankAccountTypeId}`);
            return response.data;
        } catch (error) {
            return handleError(error)
        }
    },

    async getBankAccountTypeList(): Promise<BankAccountType> {
        try {
            const response = await apiClient.get(`${API_URL}/bankAccountType`);
            return response.data;
        } catch (error) {
            return handleError(error)
        }
    },

    };
};




