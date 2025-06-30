import { a } from '@tanstack/vue-query/build/legacy/queryClient-C5JH3kKW';
import { createBaseService } from '../baseService';
import { log } from 'console';

const API_URL = '/api/v1/authentication/user';

export interface User {
  id: number;
  isActive: boolean;
  person: {
    id: number;
    isCompany: boolean;
    firstName: string;
    lastName: string;
    birthDate: string;
    nationalCode: string;
    postalCode: string;
    birthCertificationId: string;
    birthCertificationNumber: string;
    registrationNumber: string;
    issuingCity: string;
    fax: string;
    cellPhone: string;
    email: string;
    parent: string;
    phone: string;
    companyName: string;
    address: string;
    latinFirstName: string;
    latinLastName: string;
    isIranian: boolean;
    refId: number;
  };
  verificationCodeId: number;
  username: string;
  password: string;
}

export interface UserDto {
  id?: number;
  isActive: boolean;
  person?: {
    id?: number;
    isCompany: boolean;
    firstName: string;
    lastName: string;
    birthDate: string;
    nationalCode: string;
    postalCode?: string;
    birthCertificationId?: string;
    birthCertificationNumber?: string;
    registrationNumber?: string;
    issuingCity?: string;
    fax?: string;
    cellPhone?: string;
    email?: string;
    parent?: string;
    phone?: string;
    companyName?: string;
    address?: string;
    latinFirstName?: string;
    latinLastName?: string;
    isIranian?: boolean;
    refId?: number;
  };
  verificationCodeId?: number;
  username: string;
  password: string;
}

export interface UserGroupDto {
  id?: number;
  name: string;
}

export interface UserGroupDetailDto {
  userGroupId: number;
  userIds: number[];
}

export interface UserRoleDto {
  userId: number;
  roleIds: number[];
}

export interface UserPermissionDto {
  userId: number;
  permissionIds: number[];
}

interface ApiResponse {
  message: string;
  data?: any;
}

export const createUserService = (baseURL: string) => {
  const { apiClient, handleError } = createBaseService(baseURL);

  return {
    async getAllUsers() {
      try {
        const response = await apiClient.get(`${API_URL}`);
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    },

    async getUserById(id: number) {
      try {
        const response = await apiClient.get(`${API_URL}/${id}`);
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    },

    async addUser(user: UserDto): Promise<ApiResponse> {
      try {
        const response = await apiClient.post(`${API_URL}/add`, user);
        return {
          message: response.data.message || 'کاربر با موفقیت اضافه شد'
        }
      } catch (error) {
        return handleError(error);
      }
    },

    async updateUser(user: UserDto): Promise<ApiResponse> {
      try {
        const response = await apiClient.put(`${API_URL}/edit`, user);
        return {
          message: response.data.message || 'کاربر با موفقیت ویرایش شد'
        }
      } catch (error) {
        return handleError(error);
      }
    },

    async deleteUser(userId: number){
      try {
        const response = await apiClient.delete(`${API_URL}/remove/${userId}`);
          return {
            message: response.data.message || 'کاربر با موفقیت حذف شد'
          };
      } catch (error) {
        return handleError(error);
      }
    },

    // User group operations
    async addUserGroup(group: UserGroupDto): Promise<void> {
      try {
        await apiClient.post('/api/v1/authentication/userGroup/add', group);
      } catch (error) {
        throw error;
      }
    },

    async updateUserGroup(group: UserGroupDto): Promise<void> {
      try {
        await apiClient.put('/api/v1/authentication/userGroup/edit', group);
      } catch (error) {
        throw error;
      }
    },

    async deleteUserGroup(userGroupId: number): Promise<void> {
      try {
        await apiClient.delete('/api/v1/authentication/userGroup/remove', {
          params: { userGroupId }
        });
      } catch (error) {
        throw error;
      }
    },

    // User assignments
    async assignUserToGroup(assignments: UserGroupDetailDto[]): Promise<void> {
      try {
        await apiClient.post('/api/v1/authentication/user/assignUserToGroup', assignments);
      } catch (error) {
        throw error;
      }
    },

    async assignRoleToUser(assignments: UserRoleDto[]): Promise<void> {
      try {
        await apiClient.post('/api/v1/authentication/user/assignRoleToUser', assignments);
      } catch (error) {
        throw error;
      }
    },

    async assignPermissionToUser(assignments: UserPermissionDto[]): Promise<void> {
      try {
        await apiClient.post('/api/v1/authentication/user/assignPermissionToUser', assignments);
      } catch (error) {
        throw error;
      }
    },

    async logout(): Promise<void> {
      try {
        await apiClient.post('/logout');
        localStorage.removeItem('token');
      } catch (error) {
        throw error;
      }
    },

    async findUserRole (userId: number){
      try {
        const response = await apiClient.get(`${API_URL}/userRolePerUser/${userId}`);
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    },

    async addUserRole(userId: number, roleId: number) {
      try {
        await this.assignRoleToUser([{ userId, roleIds: [roleId] }]);
      } catch (error) {
        return handleError(error);
      }
    },

    async removeUserRole(userId: number, roleId: number) {
      try {

        const response = await apiClient.delete(`${API_URL}/removeRole/${userId}/${roleId}`);
        return response.data;
      } catch (error) {
        return handleError(error);
      }
    }
  };
};