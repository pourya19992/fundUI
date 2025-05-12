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

const API_URL = '/api/v1/administration/branch';
export const createBranchService = (baseURL: string) => {
  const { apiClient, handleError } = createBaseService(baseURL);

  return {
    async getBranch(id: number): Promise<Branch> {
      try {
        const response = await apiClient.get(`${API_URL}/${id}`);
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    },

    async getBranches(): Promise<Branch[]> {
      try {
        const response = await apiClient.get(API_URL);
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    },

    async addBranch(branch: BranchDto): Promise<ApiResponse> {
      try {
        const response = await apiClient.post(API_URL, branch);
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

        const response = await apiClient.put(`${API_URL}/edit`, payload);
        return {
          message: response.data.message || 'شعبه با موفقیت ویرایش شد'
        };
      } catch (error) {
        return handleError(error);
      }
    },

    async deleteBranch(branchId: number): Promise<void> {
      try {
        await apiClient.delete(`${API_URL}/remove/${branchId}`);
      } catch (error) {
        handleError(error);
      }
    }
  };
};