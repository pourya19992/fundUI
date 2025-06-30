<template>
  <div class="flex items-center">
    <input
      type="checkbox"
      :id="'role-' + role.id"
      :checked="isChecked"
      @change="handleChange"
      :disabled="isLoading"
      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mx-4 md:mx-0"
    />
    <label :for="'role-' + role.id" class="mr-3 block text-sm font-medium text-gray-700">
      {{ role.name }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { useRoleStore } from '@/stores/roleStore';
import { createUserService } from '@/services/auth/userService';
import type { Role } from '@/services/baseInformation/roleService';
import { useNotify } from '@/helpers/hooks/useNotify';

const props = defineProps<{
role: Role;
userRoleId: number | undefined;
isChecked: boolean;
userId: number;
}>();

const notify = useNotify();
const config = useRuntimeConfig();
const userService = createUserService(config.public.apiBase);

const roleStore = useRoleStore();
// const userRoleStore = useUserRoleStore();

const isChecked = ref(props.isChecked);
const isLoading = ref(false);

const handleChange = async () => {
  if (!props.role.id) return;

  isLoading.value = true;
  try {
    if (isChecked.value) {
      await userService.removeUserRole(props.userId, props.role.id);
      isChecked.value = false;
    } else {
      await userService.addUserRole(props.userId, props.role.id);
      isChecked.value = true;
    }
    notify({
      description: 'عملیات با موفقیت انجام شد.',
      status: 'success'
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    notify({
      description: 'خطا در انجام عملیات',
      status: 'error'
    });
  } finally {
    isLoading.value = false;
  }
};
</script>