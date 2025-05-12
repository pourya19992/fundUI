import { createBaseService } from '../baseService';

export interface Fund {
  id: number;
  name: string;
  isETF: boolean;
}

export interface FundDto {
  id?: number;
  name: string;
  isETF: boolean;
}

interface ApiErrorResponse {
  code: string;
  message: string;
  uuid: string | null;
  time: string;
}

const API_URL = '/api/v1/administration/fund';
export const createFundService = (baseURL: string) => {

  const { apiClient, handleError } = createBaseService(baseURL);

  return {
    async getFundList(fundId?: number): Promise<Fund[]> {
      try {
        const url = fundId
          ? `${API_URL}/${fundId}`
          : API_URL;
        const response = await apiClient.get(url);
        return response.data;
      } catch (error) {
        throw handleError(error);
      }
    },

    async addFund(fund: FundDto): Promise<void> {
      try {
        await apiClient.post(API_URL, fund);
      } catch (error) {
        throw handleError(error);
      }
    },

    async updateFund(fund: FundDto): Promise<void> {
      try {
        await apiClient.put(`${API_URL}/edit`, fund);
      } catch (error) {
        throw handleError(error);
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