import { createBaseService } from '../baseService';

const API_URL = '/api/v1/authentication/userGroup';

export interface UserGroup {
    id?: number;
    name: string;
}

export interface UserGroupRole {
    id: number;
    userGroupId: number;
    roleId: number;
    role?: {
    id: number;
    name: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

interface ApiResponse {
    message: string;
    data?: any;
}

export interface UserGroupDto {
    userGroupId?: number;
    name: string;
}

export interface UserGroupRoleDto {
    userGroupId: number;
    roleIds: number[];
}

export const createUserGroupService = (baseURL: string) => {
    const { apiClient, handleError } = createBaseService(baseURL);
    return {
        async getAllUserGroups() {
            try {
                const response = await apiClient.get(`${API_URL}`);
                return response.data;
            } catch (error) {
                return handleError(error);
            }
            },

            async getUserGroupById(id: number) {
            try {
                const response = await apiClient.get(`${API_URL}/${id}`);
                return response.data;
            } catch (error) {
                return handleError(error);
            }
            },

            async addUserGroup(userGroup: UserGroupDto): Promise<ApiResponse> {
                try {
                const response = await apiClient.post(`${API_URL}/add`, userGroup);
                return {
                    message: response.data.message || 'کاربر با موفقیت اضافه شد'
                }
                } catch (error) {
                return handleError(error);
                }
            },

            async updateUserGroup(id: number, userGroup: UserGroupDto): Promise<ApiResponse> {
                try {
                const response = await apiClient.put(`${API_URL}/edit`, userGroup);
                return {
                    message: response.data.message || 'کاربر با موفقیت ویرایش شد'
                }
                } catch (error) {
                return handleError(error);
                }
            },

            async deleteUserGroup(userGroupId: number){
                try {
                const response = await apiClient.delete(`${API_URL}/remove/${userGroupId}`);
                    return {
                    message: response.data.message || 'کاربر با موفقیت حذف شد'
                    };
                } catch (error) {
                return handleError(error);
                }
            },

            async findUserGroupRole (userGroupId: number){
                try {
                const response = await apiClient.get(`${API_URL}/userGroupRolePerUserGroup/${userGroupId}`);
                return response.data;
                } catch (error) {
                return handleError(error);
                }
            }

    }
}
