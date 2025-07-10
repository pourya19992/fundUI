import { createBaseService } from '../baseService';


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

export interface UserRole {
  id: number;
  userId: number;
  roleId: number;
  role?: {
    id: number;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface UserGroupDetail {
  id: number;
  userId: number;
  userGroupId: number;
  userGroup?: {
    id: number;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
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

export interface UserPermission {
  id: number;
  userId: number;
  permissionId: number;
  permission?: {
    id: number;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface UserGroupDetailDto {
  userId: number;
  userGroupIds: number[];
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

    async getUserPermissions(userId: number) {
      try {
          const response = await apiClient.get(`${API_URL}/userPermissionPerUserId/${userId}`);
          return response.data;
      } catch (error) {
          return handleError(error);
      }
  },

  async getUserGroupDetails(userId: number) {
      try{
        const response = await apiClient.get(`${API_URL}/userGroupPerUserId/${userId}`);
        return response.data;
      } catch (error) {
        return handleError(error);
      }
  },
  };
};

// Add a helper to map isActive to label for each user
export function mapUsersWithLabels(users: User[]): (User & { isActiveLabel: string })[] {
  return users.map((user: User) => ({
    ...user,
    isActiveLabel: user.isActive ? 'فعال' : 'غیرفعال',
  }));
}