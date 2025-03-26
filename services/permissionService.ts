import axios from 'axios';

const API_URL = '/api/v1/authentication/permission';

interface Permission {
  id?: number;
  name: string;
  url: string;
  isSensitive: boolean;
}

export const usePermissionService = () => {
  const config = useRuntimeConfig();
  const tenantId = "90001"; // You might want to get this from your auth store

  const apiClient = axios.create({
    baseURL: config.public.apiBase,
    headers: {
      'X-TenantId': tenantId,
      'Content-Type': 'application/json'
    }
  });

  // Add request interceptor for Bearer token
  apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Get from your auth store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const getAllPermissions = async () => {
    const response = await apiClient.get(`${API_URL}/list`);
    return response.data;
  };

  const getPermissionById = async (id: number) => {
    const response = await apiClient.get(`${API_URL}/${id}`);
    return response.data;
  };

  const addPermission = async (permission: Permission) => {
    return await apiClient.post(`${API_URL}/add`, permission);
  };

  const updatePermission = async (permission: Permission) => {
    return await apiClient.put(`${API_URL}/edit`, permission);
  };

  const deletePermission = async (permissionId: number) => {
    return await apiClient.delete(`${API_URL}/remove`, {
      params: { permissionId }
    });
  };

  return {
    getAllPermissions,
    getPermissionById,
    addPermission,
    updatePermission,
    deletePermission
  };
}; 