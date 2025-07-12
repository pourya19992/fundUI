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
        <h2 class="text-2xl font-bold">مدیریت دسترسی‌ها</h2>
        <PermissionForm
          ref="permissionFormRef"
          @submit="loadPermissions"
        />
      </div>

      <PermissionTable
        :permissions="paginatedPermissions"
        :is-loading="isLoadingList"
        :is-disabled="isLoading"
        :currentPage="currentPage"
        :totalPages="totalPages"
        :pageSize="pageSize"
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
import { createPermissionService, type Permission } from '@/services/baseInformation/permissionService';
import Notification from '@/components/form/Notification.vue';
import PermissionTable from './sections/PermissionTable.vue';
import PermissionForm from './sections/PermissionForm.vue';
import { BASE_URL } from '@/utils/constants';

interface NotificationState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

const permissionService = createPermissionService(BASE_URL);
const permissions = ref<Permission[]>([]);
const selectedPermission = ref<Permission | undefined>();
const isLoading = ref(false);
const isLoadingList = ref(false);
const notification = ref<NotificationState>({
  show: false,
  message: '',
  type: 'success'
});

const currentPage = ref(0);
const pageSize = ref(10);

const totalPages = computed(() => Math.ceil(permissions.value.length / pageSize.value));

const paginatedPermissions = computed(() => {
  const start = currentPage.value * pageSize.value;
  const end = start + pageSize.value;
  return permissions.value.slice(start, end);
});

const permissionFormRef = ref<InstanceType<typeof PermissionForm> | null>(null);

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

const resetForm = () => {
  selectedPermission.value = undefined;
};

const loadPermissions = async () => {
  isLoadingList.value = true;
  try {
    const data = await permissionService.getAllPermissions();
    permissions.value = data;
  } catch (error) {
    console.error('Error loading permissions:', error);
    showNotification('خطا در بارگذاری دسترسی‌ها', 'error');
  } finally {
    isLoadingList.value = false;
  }
};

const handleEdit = async (permission: Permission) => {
  try {
    const data = await permissionService.getPermissionById(permission.id!);
    if (data && permissionFormRef.value) {
      permissionFormRef.value.openForEdit(data);
    }
  } catch (error) {
    console.error('Error loading permission details:', error);
    showNotification('خطا در بارگذاری اطلاعات دسترسی', 'error');
  }
};

const handleDelete = async (permission: Permission) => {
  if (!permission.id) return;

  if (confirm('آیا از حذف این دسترسی اطمینان دارید؟')) {
    isLoading.value = true;
    try {
      await permissionService.deletePermission(permission.id);
      showNotification('دسترسی با موفقیت حذف شد', 'success');
      await loadPermissions();
    } catch (error) {
      console.error('Error deleting permission:', error);
      showNotification('خطا در حذف دسترسی', 'error');
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
  currentPage.value = 0;
};


onMounted(() => {
  loadPermissions();
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
