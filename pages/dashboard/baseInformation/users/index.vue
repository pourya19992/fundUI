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
        <h2 class="text-2xl font-bold">مدیریت کاربران</h2>
        <UserForm
        ref="userFormRef"
        @submit="loadUsers"
        />
    </div>

    <UserTable
        :users="paginatedUsers"
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
import { createUserService } from '@/services/auth/userService';
import Notification from '@/components/form/Notification.vue';
import UserTable from './sections/UserTable.vue';
import UserForm from './sections/UserForm.vue';
import type { User } from "@/services/auth/userService";
import { useNotify } from '@/helpers/hooks/useNotify';

interface NotificationState {
show: boolean;
message: string;
type: 'success' | 'error';
}

const userService = createUserService(BASE_URL);

const users = ref<User[]>([]);
const isLoading = ref(false);
const isLoadingList = ref(false);
const notification = ref<NotificationState>({
show: false,
message: '',
type: 'success'
});

const currentPage = ref(0);
const pageSize = ref(10);

const totalPages = computed(() => Math.ceil(users.value.length / pageSize.value));

const paginatedUsers = computed(() => {
const start = currentPage.value * pageSize.value;
const end = start + pageSize.value;
return users.value.slice(start, end);
});

const userFormRef = ref<InstanceType<typeof UserForm> | null>(null);

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

const loadUsers = async () => {
isLoadingList.value = true;
try {
    const data = await userService.getAllUsers();
    users.value = data;
} catch (error: any) {
    console.error('Error loading users:', error);
    showNotification(`خطا در بارگذاری کاربران: ${error.message}`, 'error');
} finally {
    isLoadingList.value = false;
}
};

const handleEdit = async (user: User) => {
try {
    const data = await userService.getUserById(user.id!);
    if (data && userFormRef.value) {
    userFormRef.value.openForEdit(data);
    }
} catch (error: any) {
    console.error('Error loading user details:', error);
    showNotification(`خطا در بارگذاری اطلاعات کاربر برای ویرایش: ${error.message}`, 'error');
}
};

const handleDelete = async (user: User) => {
if (!user.id) return;

if (confirm(`آیا از حذف کاربر "${user.username}" اطمینان دارید؟`)) {
    isLoading.value = true;
    try {
    await userService.deleteUser(user.id);
    showNotification('کاربر با موفقیت حذف شد', 'success');
    await loadUsers();
    } catch (error: any) {
    console.error('Error deleting user:', error);
    showNotification(`خطا در حذف کاربر: ${error.message}`, 'error');
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
loadUsers();
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
