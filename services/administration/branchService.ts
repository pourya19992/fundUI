import { createBaseService } from '../baseService';

export interface FundBranch {
  id: number;
  isActive: boolean;
  code: string;
  name: string;
  manager: string;
  phone: string;
  fax: string;
  cellPhone: string;
  postalCode: string;
  address: string;
}

export interface FundBranchDto {
  id?: number;
  isActive: boolean;
  code: string;
  name: string;
  manager?: string;
  phone?: string;
  fax?: string;
  cellPhone?: string;
  postalCode?: string;
  address?: string;
}

interface ApiErrorResponse {
  code: string;
  message: string;
  uuid: string | null;
  time: string;
}

export const createBranchService = (baseURL: string) => {
  const { apiClient, handleError } = createBaseService(baseURL);

  return {
    async getBranch(id: number): Promise<FundBranch> {
      try {
        const response = await apiClient.get(`/api/v1/administration/branch/${id}`);
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    },

    async getBranches(): Promise<FundBranch[]> {
      try {
        const response = await apiClient.get('/api/v1/administration/branch');
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    },

    async addBranch(branch: FundBranchDto): Promise<void> {
      try {
        await apiClient.post('/api/v1/administration/branch/add', branch);
      } catch (error) {
        handleError(error);
      }
    },

    async updateBranch(branch: FundBranchDto): Promise<void> {
      try {
        await apiClient.put('/api/v1/administration/branch/edit', branch);
      } catch (error) {
        handleError(error);
      }
    },

    async deleteBranch(branchId: number): Promise<void> {
      try {
        await apiClient.delete(`/api/v1/administration/branch/remove/${branchId}`);
      } catch (error) {
        handleError(error);
      }
    }
  };
}; 