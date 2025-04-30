import axios from 'axios';

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

export const createUserService = (baseURL: string) => {
  const apiClient = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'X-TenantId': '90001'
    }
  });

  apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return {
    // User operations
    async addUser(user: UserDto): Promise<void> {
      try {
        await apiClient.post('/api/v1/authentication/user/add', user);
      } catch (error) {
        throw error;
      }
    },

    async updateUser(user: UserDto): Promise<void> {
      try {
        await apiClient.put('/api/v1/authentication/user/edit', user);
      } catch (error) {
        throw error;
      }
    },

    async deleteUser(userId: number): Promise<void> {
      try {
        await apiClient.delete('/api/v1/authentication/user/remove', {
          params: { userId }
        });
      } catch (error) {
        throw error;
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
    }
  };
}; 