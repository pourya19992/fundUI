<template>
  <div class="flex flex-col space-y-6 py-8">
    <BaseLoading v-if="isLoading" />
    <template v-else>
      <UserRoleItem
        v-for="role in roles"
        :key="role.id || role.name"
        :role="role"
        :user-role-id="getUserRoleId(role.id || 0)"
        :is-checked="isRoleAssigned(role.id || 0)"
        :user-id="userId"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseLoading from '@/components/base/BaseLoading.vue';
import UserRoleItem from './UserRoleItem.vue';
import { useRoleStore } from '@/stores/roleStore';
import { createUserService } from '@/services/auth/userService';
import type { Role } from '@/services/baseInformation/roleService';
import type { UserRole } from '@/types/userRole';

const props = defineProps<{
  userId: number;
}>();

const config = useRuntimeConfig();
const userService = createUserService(config.public.apiBase);

const roleStore = useRoleStore();
const isLoading = ref(true);
const roles = ref<Role[]>([]);
const userRoles = ref<UserRole[]>([]);

const loadData = async () => {
  isLoading.value = true;
  try {
    const [rolesData, userRolesData] = await Promise.all([
      roleStore.fetchRoles(),
      userService.findUserRole(props.userId)
    ]);
    roles.value = rolesData;
    userRoles.value = userRolesData.data || userRolesData;
  } catch (error) {
    console.error('Error loading roles:', error);
  } finally {
    isLoading.value = false;
  }
};

const isRoleAssigned = (roleId: number) => {
  return userRoles.value.some((ur: UserRole) => ur.roleId === roleId);
};

const getUserRoleId = (roleId: number) => {
  const userRole = userRoles.value.find((ur: UserRole) => ur.roleId === roleId);
  return userRole?.id;
};

onMounted(() => {
  loadData();
});
</script>