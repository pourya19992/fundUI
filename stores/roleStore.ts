import { defineStore } from 'pinia';
import type { Role } from '@/services/baseInformation/roleService';
import { createRoleService } from '@/services/baseInformation/roleService';

const config = useRuntimeConfig();
const roleService = createRoleService(BASE_URL);


export const useRoleStore = defineStore('role', {
state: () => ({
    roles: [] as Role[],
    isLoading: false,
    error: null as string | null,
}),

actions: {
    async fetchRoles() {
    this.isLoading = true;
    try {
        const response = await roleService.getAllRoles();
        // Handle both array and object responses
        this.roles = Array.isArray(response) ? response : (response.data || response);
        return this.roles;
    } catch (error) {
        this.error = 'Failed to fetch roles';
        throw error;
    } finally {
        this.isLoading = false;
    }
    },
},
});