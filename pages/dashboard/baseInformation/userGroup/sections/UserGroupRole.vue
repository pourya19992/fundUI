<template>
<div>
    <BaseTooltip label="نقش ها">
        <div class="cursor-pointer" @click="openModal">
            <ProfileIcon />
        </div>
    </BaseTooltip>

    <BaseFormModal
    v-model:modelValue="isModalOpen"
    :title="'نقش های گروه کاربری'"
    submit-button-text="ثبت"
    cancel-button-text="انصراف"
    :is-loading="isLoading"
    :is-submitting="isUpdating"
    @submit="assignRoles"
    @cancel="closeModal"
    >
    <template #form-fields>
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
    </BaseFormModal>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseTooltip from '@/components/base/BaseTooltip.vue';
import BaseFormModal from '@/components/base/BaseFormModal.vue';
import BaseLoading from '@/components/base/BaseLoading.vue';
import ProfileIcon from '@/components/icons/ProfileIcon.vue';
import { useRoleStore } from '@/stores/roleStore';
import { useNotify } from '@/helpers/hooks/useNotify';
import type { UserGroup } from "@/services/baseInformation/userGroupService";
import type { Role } from '@/services/baseInformation/roleService';
import { createUserGroupService } from "@/services/baseInformation/userGroupService";
import type { UserGroupRole } from "@/services/baseInformation/userGroupService";
import { createRoleService } from "@/services/baseInformation/roleService"

const props = defineProps<{
userGroup: UserGroup;
}>();


const config = useRuntimeConfig();
const userService = createUserGroupService(BASE_URL);
const roleService = createRoleService(BASE_URL);

const roleStore = useRoleStore();
const notify = useNotify();

const isModalOpen = ref(false);
const isLoading = ref(false);
const isUpdating = ref(false);
const roles = ref<Role[]>([]);
const userGroupRoles = ref<UserGroupRole[]>([]);
const selectedRoleIds = ref<number[]>([]);

const loadData = async () => {
    isLoading.value = true;
    try {
        // Load roles first
        const rolesData = await roleStore.fetchRoles();
        roles.value = rolesData;

        // Guard: Ensure userGroup.id exists
        if (!props.userGroup.id) {
            isLoading.value = false;
            return;
        }
        // Load user roles second
        const userGroupRolesData = await userService.findUserGroupRole(props.userGroup.id);

        // Handle the response format: {userId: number, roleIds: number[]}
        if (userGroupRolesData && userGroupRolesData.roleIds) {
            // Convert to UserRole format for consistency
            userGroupRoles.value = userGroupRolesData.roleIds.map((roleId: number) => ({
                id: roleId, // Use roleId as temporary id
                userId: props.userGroup.id,
                roleId: roleId
            }));
            selectedRoleIds.value = [...userGroupRolesData.roleIds];
        } else {
            userGroupRoles.value = [];
            selectedRoleIds.value = [];
        }
    } catch (error) {
        notify({
            description: 'خطا در بارگذاری گروه کاربری',
            status: 'error'
        });
    } finally {
        isLoading.value = false;
    }
};

const assignRoles = async () => {
    isUpdating.value = true;
    try {
        // Guard: Ensure userGroup.id exists
        if (!props.userGroup.id) {
            isUpdating.value = false;
            return;
        }
        await roleService.assignRoleToUserGroup([
            {
                userGroupId: props.userGroup.id,
                roleIds: selectedRoleIds.value
            }
        ]);

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