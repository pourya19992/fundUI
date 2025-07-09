import { createBaseService } from '../baseService';

const API_URL = '/api/v1/authentication/role';

export interface Role {
id?: number;
name: string;
}

export interface UserRoleDto {
    userId: number;
    roleIds: number[];
}

interface ApiResponse {
    message: string;
    data?: any;
}

export interface RoleUserGroupDto {
    userGroupId: number;
    roleIds: number[];
}

export interface RolePermission {
    roleId: number;
    permissionIds: number[];
}

interface RoleDto extends Partial<Role> {}

export const createRoleService = (baseURL: string) => {
const { apiClient, handleError } = createBaseService(baseURL);

return {
    async getAllRoles() {
    try {
        const response = await apiClient.get(`${API_URL}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
    },

    async getRoleById(id: number) {
    try {
        const response = await apiClient.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
    },

    async addRole(roleData: RoleDto): Promise<ApiResponse> {
    try {
        const response = await apiClient.post(`${API_URL}/add`, roleData);
        return {
            message: response.data.message || 'نقش با موفقیت اضافه شد'
        };
    } catch (error) {
        return handleError(error);
    }
    },

    async updateRole(id: number, roleData: RoleDto): Promise<ApiResponse> {
    try {
        const response = await apiClient.put(`${API_URL}/edit`, roleData);
        return {
            message: response.data.message || 'نقش با موفقیت ویرایش شد'
        };
    } catch (error) {
        return handleError(error);
    }
    },

    async deleteRole(id: number) {
    try {
        const response = await apiClient.delete(`${API_URL}/remove/${id}`);
        return {
            message: response.data.message || 'نقش با موفقیت حذف شد'
        };
    } catch (error) {
        return handleError(error);
    }
    },

    // Role assignments
    async assignRoleToUserGroup(assignments: RoleUserGroupDto[]): Promise<void> {
        try {
        await apiClient.post('/api/v1/authentication/permission/assignRoleToUserGroup', assignments);
        } catch (error) {
        throw error;
        }
    },

    async assignPermissionToRole(assignments: RolePermission[]): Promise<void> {
        try {
        await apiClient.post('/api/v1/authentication/permission/assignPermissionToRole', assignments);
        } catch (error) {
        throw error;
        }
    },

    async getRolePermissions(roleId: number) {
        try {
            const response = await apiClient.get(`${API_URL}/rolePermissionPerRoleId/${roleId}`);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

};
};
