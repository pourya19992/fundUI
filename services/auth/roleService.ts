import axios from 'axios';

export interface Role {
  id: number;
  name: string;
}

export interface RoleDto {
  id?: number;
  name: string;
}

export interface Permission {
  id: number;
  name: string;
  url: string;
  isSensitive: boolean;
}

export interface PermissionDto {
  id?: number;
  name: string;
  url: string;
  isSensitive: boolean;
}

export interface RoleUserGroupDto {
  userGroupId: number;
  roleIds: number[];
}

export interface RolePermissionDto {
  roleId: number;
  permissionIds: number[];
}

export const createRoleService = (baseURL: string) => {
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
    // Role operations
    async addRole(role: RoleDto): Promise<void> {
      try {
        await apiClient.post('/api/v1/authentication/role/add', role);
      } catch (error) {
        throw error;
      }
    },

    async updateRole(role: RoleDto): Promise<void> {
      try {
        await apiClient.put('/api/v1/authentication/role/edit', role);
      } catch (error) {
        throw error;
      }
    },

    async deleteRole(roleId: number): Promise<void> {
      try {
        await apiClient.delete('/api/v1/authentication/role/remove', {
          params: { roleId }
        });
      } catch (error) {
        throw error;
      }
    },

    // Permission operations
    async addPermission(permission: PermissionDto): Promise<void> {
      try {
        await apiClient.post('/api/v1/authentication/permission/add', permission);
      } catch (error) {
        throw error;
      }
    },

    async updatePermission(permission: PermissionDto): Promise<void> {
      try {
        await apiClient.put('/api/v1/authentication/permission/edit', permission);
      } catch (error) {
        throw error;
      }
    },

    async deletePermission(permissionId: number): Promise<void> {
      try {
        await apiClient.delete('/api/v1/authentication/permission/remove', {
          params: { permissionId }
        });
      } catch (error) {
        throw error;
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

    async assignPermissionToRole(assignments: RolePermissionDto[]): Promise<void> {
      try {
        await apiClient.post('/api/v1/authentication/permission/assignPermissionToRole', assignments);
      } catch (error) {
        throw error;
      }
    }
  };
}; 