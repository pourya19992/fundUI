import { createBaseService } from '../baseService';

export interface Fund {
  id?: number;
  name: string;
  isETF: boolean;
}

export interface FundDto {
  id?: number;
  name: string;
  isETF: boolean;
}

interface ApiResponse {
  message: string;
  data?: any;
}

const API_URL = '/api/v1/administration/fund';
export const createFundService = (baseURL: string) => {

  const { apiClient, handleError } = createBaseService(baseURL);

  return {
    async getFund(fundId: number): Promise<Fund> {
      try {
        const response = await apiClient.get(`${API_URL}/${fundId}`);
        return response.data;
      } catch (error) {
        throw handleError(error);
      }
    },

    async getFundList(): Promise<Fund[]> {
      try {
        const response = await apiClient.get(API_URL);
        return response.data;
      } catch (error) {
        return handleError(error)
      }
    },

    async addFund(fund: FundDto): Promise<ApiResponse> {
      try {
        const response = await apiClient.post(API_URL, fund);
        return {
        message: response.data.message || 'صندوق با موفقیت اضافه شد'
        };
      } catch (error) {
        return handleError(error);
      }
    },

    async updateFund(fund: FundDto): Promise<ApiResponse> {
      try {
        const payload = {
          ...fund,
          id: typeof fund.id == 'string' ? parseInt(fund.id) : fund.id
        };
        const response = await apiClient.put(`${API_URL}/edit`, payload);
        return {
          message: response.data.message || 'صندوق با موفقیت ویرایش شد'
        };
      } catch (error) {
        return handleError(error);
      }
    },

    async deleteFund(fundId: number): Promise<void> {
      try {
        await apiClient.delete(`${API_URL}/remove/${fundId}`);
      } catch (error) {
        throw handleError(error);
      }
    },

  };

};