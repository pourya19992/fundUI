import { createBaseService } from '../baseService';

const API_URL = '/api/v1/authentication/permission';

export interface Permission {
  id?: number;
  name: string;
  url: string;
  isSensitive: boolean;
}

interface ApiResponse {
  message: string;
  data?: any;
}

export const createPermissionService = (baseURL: string) => {
  const { apiClient, handleError } = createBaseService(baseURL);

  return {
    async getAllPermissions() {
      try {
        const response = await apiClient.get(`${API_URL}`);
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    },

    async getPermissionById(id: number) {
      try {
        const response = await apiClient.get(`${API_URL}/${id}`);
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    },

    async addPermission(permission: Permission): Promise<ApiResponse> {
      try {
        const response = await apiClient.post(`${API_URL}/add`, permission);
        return {
          message: response.data.message || 'دسترسی با موفقیت اضافه شد'
        };
      } catch (error) {
        return handleError(error);
      }
    },

    async updatePermission(permission: Permission): Promise<ApiResponse> {
      try {
        const response = await apiClient.put(`${API_URL}/edit`, permission);
        return {
          message: response.data.message || 'دسترسی با موفقیت ویرایش شد'
        };
      } catch (error) {
        return handleError(error);
      }
    },


    async deletePermission(permissionId: number): Promise<void> {
      try {
        await apiClient.delete(`${API_URL}/remove/${permissionId}`);
      } catch (error) {
        handleError(error);
      }
    }
  };
};