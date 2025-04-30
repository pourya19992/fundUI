import { createBaseService } from './baseService';

interface ApiErrorResponse {
  code: string;
  message: string;
  uuid: string | null;
  time: string;
}

interface Branch {
  id: number;
  // سایر فیلدهای شعب
}

export const createBranchService = (baseURL: string) => {
  const { apiClient, handleError } = createBaseService(baseURL);

  return {
    async getBranch(id: number): Promise<Branch> {
      try {
        const response = await apiClient.get(`/administration/branch/${id}`);
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    },

    async getBranches(): Promise<Branch[]> {
      try {
        const response = await apiClient.get('/administration/branch');
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    }
  };
}; 