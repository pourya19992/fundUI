import { createBaseService } from '../baseService';
import type { PagedResponse } from '../baseService';

const API_URL = '/api/v1/accounting/detailLedger';

export interface DetailLedger {
  id: number;
  name: string;
  code: string;
  detailLedgerType?: DetailLedgerType;
  isActive: boolean;
}

export interface DetailLedgerType {
  id?: number;
    name: string;
    accountNature: {
      id: number;
      natureAccountName: string;
    };
};


export interface DetailLedgerDto {
  id?: number;
  name: string;
  code: string;
  detailLedgerTypeId: number;
  isActive: boolean;
}

interface ApiResponse {
  message: string;
  data?: any;
}


export const createDetailLedgerService = (baseURL: string) => {
  const { apiClient, handleError } = createBaseService(baseURL);

  return {
    async getDetailLedgerList() {
      try {
        const response = await apiClient.get(`${API_URL}`);
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    },

    async getDetailLedgerById(id: number) {
      try {
        const response = await apiClient.get(`${API_URL}/${id}`);
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    },


    async addDetailLedger(detailLedger: DetailLedgerDto): Promise<ApiResponse> {
      try {
        const response = await apiClient.post(`${API_URL}/add`, detailLedger);
        return {
          message: response.data.message || 'حساب تفصیلی با موفقیت اضافه شد'
        };
      } catch (error) {
        return handleError(error);
      }
    },

    async updateDetailLedger(detailLedger: DetailLedgerDto): Promise<ApiResponse> {
      try {
        const response = await apiClient.put(`${API_URL}/edit`, detailLedger);
        return {
          message: response.data.message || 'حساب تفصیلی با موفقیت ویرایش شد'
        };
      } catch (error) {
        return handleError(error);
      }
    },

    async deleteDetailLedger(detailLedgerId: number): Promise<void> {
      try {
        await apiClient.delete(`${API_URL}/remove/${detailLedgerId}`);
      } catch (error) {
        throw error;
      }
    },

    async getDetailLedgerTypeList() {
      try {
        const response = await apiClient.get(`${API_URL}/type`);
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    },

    async getDetailLedgerTypeById(id: number) {
      try {
        const response = await apiClient.get(`${API_URL}/type/${id}`);
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    },
  };
};