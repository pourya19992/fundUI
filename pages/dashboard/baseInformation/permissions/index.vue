<template>
  <div class="container mx-auto p-4" dir="rtl">
    <Notification
      :show="notification.show"
      :message="notification.message"
      :type="notification.type"
      @close="closeNotification"
    />

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold mb-6">مدیریت دسترسی‌ها</h2>

      <!-- Edit Permission Form -->
      <EditPermission
        :permission="selectedPermission"
        :is-loading="isLoading"
        class="mb-8"
        @submit="handleSubmit"
        @cancel="resetForm"
      />

      <!-- Permissions Table -->
      <PermissionTable
        :permissions="permissions"
        :is-loading="isLoadingList"
        :is-disabled="isLoading"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { createPermissionService } from '@/services/permissionService';
import Notification from '@/components/form/Notification.vue';
import EditPermission from './sections/EditPermission.vue';
import PermissionTable from './sections/PermissionTable.vue';

interface Permission {
  id?: number;
  name: string;
  url: string;
  isSensitive: boolean;
}

interface NotificationState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

const permissionService = createPermissionService(import.meta.env.VITE_API_URL);
const permissions = ref<Permission[]>([]);
const selectedPermission = ref<Permission | undefined>();
const isLoading = ref(false);
const isLoadingList = ref(false);

const notification = ref<NotificationState>({
  show: false,
  message: '',
  type: 'success'
});

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

const handleSubmit = async (formData: Permission) => {
  isLoading.value = true;
  try {
    if (formData.id) {
      await permissionService.updatePermission(formData);
      showNotification('دسترسی با موفقیت ویرایش شد', 'success');
    } else {
      await permissionService.addPermission(formData);
      showNotification('دسترسی با موفقیت اضافه شد', 'success');
    }
    resetForm();
    await loadPermissions();
  } catch (error) {
    console.error('Error saving permission:', error);
    showNotification('خطا در ذخیره‌سازی دسترسی', 'error');
  } finally {
    isLoading.value = false;
  }
};

const handleEdit = async (permission: Permission) => {
  try {
    const data = await permissionService.getPermissionById(permission.id!);
    selectedPermission.value = data;
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
