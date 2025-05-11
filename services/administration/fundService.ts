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

export const createFundService = (baseURL: string) => {

  const { apiClient, handleError } = createBaseService(baseURL);

  return {
    async getFundList(fundId?: number): Promise<Fund[]> {
      try {
        const url = fundId
          ? `/api/v1/administration/fund/${fundId}`
          : '/api/v1/administration/fund';
        const response = await apiClient.get(url);
        return response.data;
      } catch (error) {
        throw handleError(error);
      }
    },

    async addFund(fund: FundDto): Promise<void> {
      try {
        await apiClient.post('/api/v1/administration/fund/add', fund);
      } catch (error) {
        throw handleError(error);
      }
    },

    async updateFund(fund: FundDto): Promise<void> {
      try {
        await apiClient.put('/api/v1/administration/fund/edit', fund);
      } catch (error) {
        throw handleError(error);
      }
    },

    async deleteFund(fundId: number): Promise<void> {
      try {
        await apiClient.delete(`/api/v1/administration/fund/remove/${fundId}`);
      } catch (error) {
        throw handleError(error);
      }
    },

  };

};