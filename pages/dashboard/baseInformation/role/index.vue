<template>
<div class="w-full bg-white rounded-lg shadow mr-8" dir="rtl">
    <Notification
    :show="notification.show"
    :message="notification.message"
    :type="notification.type"
    @close="closeNotification"
    />

    <div class="p-6">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">مدیریت نقش‌ها</h2>
        <RoleForm
        ref="roleFormRef"
        @submit="loadRoles"
        />
    </div>

    <RoleTable
        :roles="paginatedRoles"
        :is-loading="isLoadingList"
        :is-disabled="isLoading"
        :current-page="currentPage"
        :total-pages="totalPages"
        :page-size="pageSize"
        @edit="handleEdit"
        @delete="handleDelete"
        @pageChange="handlePageChange"
        @pageSizeChange="handlePageSizeChange"
    >
        <template #additional-actions="{ item}">
            <RolePermissions :role="item" />
        </template>
</RoleTable>
    </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { createRoleService } from '@/services/baseInformation/roleService';
import Notification from '@/components/form/Notification.vue';
import RoleTable from './sections/RoleTable.vue';
import RoleForm from './sections/RoleForm.vue';
import { useRuntimeConfig } from "nuxt/app";
import type { Role } from "@/services/baseInformation/roleService";
import { useNotify } from '@/helpers/hooks/useNotify';
import RolePermissions from './sections/RolePermissions.vue';

interface NotificationState {
show: boolean;
message: string;
type: 'success' | 'error';
}

const notify = useNotify();
const roleService = createRoleService(BASE_URL);

const roles = ref<Role[]>([]);
const isLoading = ref(false);
const isLoadingList = ref(false);
const notification = ref<NotificationState>({
show: false,
message: '',
type: 'success'
});

const currentPage = ref(0);
const pageSize = ref(10);

const totalPages = computed(() => Math.ceil(roles.value.length / pageSize.value));

const paginatedRoles = computed(() => {
  const start = currentPage.value * pageSize.value;
const end = start + pageSize.value;
return roles.value.slice(start, end);
});

const roleFormRef = ref<InstanceType<typeof RoleForm> | null>(null);

const showNotification = (message: string, type: 'success' | 'error') => {
notification.value = {
    show: true,
    message,
    type
};
setTimeout(() => {
    closeNotification();
}, 3000);
};

const closeNotification = () => {
notification.value.show = false;
};

const loadRoles = async () => {
isLoadingList.value = true;
try {
    const data = await roleService.getAllRoles();
    roles.value = data;
} catch (error: any) {
    console.error('Error loading roles:', error);
    showNotification(`خطا در بارگذاری نقش‌ها: ${error.message}`, 'error');
} finally {
    isLoadingList.value = false;
}
};

const handleEdit = async (role: Role) => {
try {
    const data = await roleService.getRoleById(role.id!);
    if (data && roleFormRef.value) {
    roleFormRef.value.openForEdit(data);
    }
} catch (error: any) {
    console.error('Error loading role details:', error);
    showNotification(`خطا در بارگذاری اطلاعات نقش برای ویرایش: ${error.message}`, 'error');
}
};

const handleDelete = async (role: Role) => {
if (!role.id) return;

if (confirm(`آیا از حذف نقش "${role.name}" اطمینان دارید؟`)) {
    isLoading.value = true;
    try {
    await roleService.deleteRole(role.id);
    showNotification('نقش با موفقیت حذف شد', 'success');
    await loadRoles();
    } catch (error: any) {
    console.error('Error deleting role:', error);
    showNotification(`خطا در حذف نقش: ${error.message}`, 'error');
    } finally {
    isLoading.value = false;
    }
}
};

const handlePageChange = (page: number) => {
currentPage.value = page;
};

const handlePageSizeChange = (size: number) => {
pageSize.value = size;
  currentPage.value = 0; // Reset to first page when page size changes
};

onMounted(() => {
loadRoles();
});

definePageMeta({
layout: 'default'
});
</script>

<style scoped>
.container {
max-width: 1200px;
}
</style>