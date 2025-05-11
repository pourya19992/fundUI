import { createBaseService } from '../baseService';

export interface Branch {
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

export interface BranchDto {
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

interface ApiResponse {
  message: string;
  data?: any;
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
    async getBranch(id: number): Promise<Branch> {
      try {
        const response = await apiClient.get(`/api/v1/administration/branch/${id}`);
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    },

    async getBranches(): Promise<Branch[]> {
      try {
        const response = await apiClient.get('/api/v1/administration/branch');
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    },

    async addBranch(branch: BranchDto): Promise<ApiResponse> {
      try {
        const response = await apiClient.post('/api/v1/administration/branch/add', branch);
        return {
          message: response.data.message || 'شعبه با موفقیت اضافه شد'
        };
      } catch (error) {
        return handleError(error);
      }
    },

    async updateBranch(branch: BranchDto): Promise<ApiResponse> {
      try {
        const payload = {
          ...branch,
          id: typeof branch.id === 'string' ? parseInt(branch.id) : branch.id
        };
        
        const response = await apiClient.put('/api/v1/administration/branch/edit', payload);
        return {
          message: response.data.message || 'شعبه با موفقیت ویرایش شد'
        };
      } catch (error) {
        return handleError(error);
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