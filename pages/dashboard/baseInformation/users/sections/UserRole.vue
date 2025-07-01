<template>
<div>
    <BaseTooltip label="نقش ها">
    <div class="cursor-pointer" @click="openModal">
        <ProfileIcon />
    </div>
    </BaseTooltip>

    <BaseModal
    v-model="isModalOpen"
    :is-centered="true"
    :scroll-behavior="'inside'"
    @close="closeModal"
    >
    <template #header>
        <h3 class="text-primary">نقش های کاربر</h3>
    </template>
    <template #body>
        <div class="flex flex-col space-y-6 py-8">
            <BaseLoading v-if="isLoading" />
            <template v-else>
                <div
                    v-for="role in roles"
                    :key="role.id || role.name"
                    class="flex items-center"
                >
                    <input
                        type="checkbox"
                        :id="'role-' + role.id"
                        :value="role.id"
                        v-model="selectedRoleIds"
                        :disabled="isUpdating"
                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mx-4 md:mx-0"
                    />
                    <label :for="'role-' + role.id" class="mr-3 block text-sm font-medium text-gray-700">
                        {{ role.name }}
                    </label>
                </div>

                <!-- Show message if no roles -->
                <div v-if="roles.length === 0" class="p-4 bg-yellow-100 rounded">
                    <p>هیچ نقشی یافت نشد!</p>
                </div>
            </template>
        </div>
    </template>
    <template #footer>
        <div class="flex justify-center space-x-4 space-x-reverse">
            <button @click="assignRoles" :disabled="isUpdating" class="w-28 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-400">
                <span v-if="isUpdating">در حال ثبت...</span>
                <span v-else>ثبت</span>
            </button>
            <button @click="closeModal" class="w-28 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                انصراف
            </button>

        </div>
    </template>
    </BaseModal>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseTooltip from '@/components/base/BaseTooltip.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import BaseLoading from '@/components/base/BaseLoading.vue';
import ProfileIcon from '@/components/icons/ProfileIcon.vue';
import { useRoleStore } from '@/stores/roleStore';
import { createUserService } from '@/services/auth/userService';
import { useNotify } from '@/helpers/hooks/useNotify';
import type { User } from '@/services/auth/userService';
import type { Role } from '@/services/baseInformation/roleService';
import type { UserRole } from '@/types/userRole';

const props = defineProps<{
user: User;
}>();


const config = useRuntimeConfig();
const userService = createUserService(config.public.apiBase);

const roleStore = useRoleStore();
const notify = useNotify();

const isModalOpen = ref(false);
const isLoading = ref(false);
const isUpdating = ref(false);
const roles = ref<Role[]>([]);
const userRoles = ref<UserRole[]>([]);
const selectedRoleIds = ref<number[]>([]);

const loadData = async () => {
    isLoading.value = true;
    try {
        // Load roles first
        const rolesData = await roleStore.fetchRoles();
        roles.value = rolesData;

        // Load user roles second
        const userRolesData = await userService.findUserRole(props.user.id);

        // Handle the response format: {userId: number, roleIds: number[]}
        if (userRolesData && userRolesData.roleIds) {
            // Convert to UserRole format for consistency
            userRoles.value = userRolesData.roleIds.map((roleId: number) => ({
                id: roleId, // Use roleId as temporary id
                userId: props.user.id,
                roleId: roleId
            }));
            selectedRoleIds.value = [...userRolesData.roleIds];
        } else {
            userRoles.value = [];
            selectedRoleIds.value = [];
        }
    } catch (error) {
        notify({
            description: 'خطا در بارگذاری نقش ها',
            status: 'error'
        });
    } finally {
        isLoading.value = false;
    }
};

const assignRoles = async () => {
    isUpdating.value = true;
    try {
        await userService.assignRoleToUser([{
            userId: props.user.id,
            roleIds: selectedRoleIds.value
        }]);

        notify({
            description: 'نقش ها با موفقیت بروزرسانی شد',
            status: 'success'
        });
        closeModal();
    } catch (error) {
        notify({
            description: 'خطا در بروزرسانی نقش ها',
            status: 'error'
        });
    } finally {
        isUpdating.value = false;
    }
}

const openModal = () => {
    isModalOpen.value = true;
    loadData();
};

const closeModal = () => {
    isModalOpen.value = false;
};

onMounted(() => {
    // Component is ready
});
</script>