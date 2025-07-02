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
        <h2 class="text-2xl font-bold">مدیریت گروه های کاربری</h2>
        <UserGroupForm
        ref="userGroupFormRef"
        @submit="loadUserGroups"
        />
    </div>

    <UserGroupTable
        :user-groups="paginatedUserGroups"
        :is-loading="isLoadingList"
        :is-disabled="isLoading"
        :current-page="currentPage"
        :total-pages="totalPages"
        :page-size="pageSize"
        @edit="handleEdit"
        @delete="handleDelete"
        @pageChange="handlePageChange"
        @pageSizeChange="handlePageSizeChange"
    />
    </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import UserGroupForm from './sections/UserGroupForm.vue';
import UserGroupTable from './sections/UserGroupTable.vue';
import Notification from '@/components/form/Notification.vue';
import { useRuntimeConfig } from "nuxt/app";
import type { UserGroup } from "@/services/baseInformation/userGroupService";
import { createUserGroupService } from "@/services/baseInformation/userGroupService";
import { useNotify } from '@/helpers/hooks/useNotify';

interface NotificationState {
show: boolean;
message: string;
type: 'success' | 'error';
}

const notify = useNotify();
const config = useRuntimeConfig();
const userGroupService = createUserGroupService(config.public.apiBase);

const userGroups = ref<UserGroup[]>([]);
const isLoading = ref(false);
const isLoadingList = ref(false);
const notification = ref<NotificationState>({
show: false,
message: '',
type: 'success'
});

const currentPage = ref(0);
const pageSize = ref(10);

const totalPages = computed(() => Math.ceil(userGroups.value.length / pageSize.value));

const paginatedUserGroups = computed(() => {
  const start = currentPage.value * pageSize.value;
const end = start + pageSize.value;
return userGroups.value.slice(start, end);
});

const userGroupFormRef = ref<InstanceType<typeof UserGroupForm> | null>(null);

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

const loadUserGroups = async () => {
isLoadingList.value = true;
try {
    const data = await userGroupService.getAllUserGroups();
    userGroups.value = data;
} catch (error: any) {
    console.error('Error loading roles:', error);
    showNotification(`خطا در بارگذاری گروه های کاربری: ${error.message}`, 'error');
} finally {
    isLoadingList.value = false;
}
};

const handleEdit = async (userGroup: UserGroup) => {
try {
    const data = await userGroupService.getUserGroupById(userGroup.id!);
    if (data && userGroupFormRef.value) {
        userGroupFormRef.value.openForEdit(data);
    }
} catch (error: any) {
    console.error('Error loading userGroup details:', error);
    showNotification(`خطا در بارگذاری اطلاعات گروه های کاربری برای ویرایش: ${error.message}`, 'error');
}
};

const handleDelete = async (userGroup: UserGroup) => {
if (!userGroup.id) return;

if (confirm(`آیا از حذف 'گروه کاربری' "${userGroup.name}" اطمینان دارید؟`)) {
    isLoading.value = true;
    try {
    await userGroupService.deleteUserGroup(userGroup.id);
    showNotification('گروه کاربری با موفقیت حذف شد', 'success');
    await loadUserGroups();
    } catch (error: any) {
    console.error('Error deleting userGroup:', error);
    showNotification(`خطا در حذف گروه کاربری: ${error.message}`, 'error');
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
loadUserGroups();
});

definePageMeta({
layout: 'default'
});
</script>
