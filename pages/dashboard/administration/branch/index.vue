<template>
  <div class="container mx-auto p-4" dir="rtl">
    <Notification
      :show="notification.show"
      :message="notification.message"
      :type="notification.type"
      @close="closeNotification"
    />
    
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">مدیریت شعب</h2>
      </div>

      <!-- Add Branch Button -->
      <div class="mb-6">
        <AddBranch @refetch="loadBranches" />
      </div>

      <!-- Branches Table -->
      <BranchTable
        :branches="branches"
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
import { createFundService } from '@/services/administration/fundService';
import Notification from '@/components/form/Notification.vue';
import AddBranch from '@/pages/dashboard/administration/branch/sections/AddBranch.vue';
import BranchTable from '@/pages/dashboard/administration/branch/sections/BranchTable.vue';
import { useRuntimeConfig } from 'nuxt/app';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app';

interface Branch {
  id: number;
  isActive: boolean;
  code: string;
  name: string;
  manager: string;
  phone: string;
  fax: string;
  cellPhone: string;
  postalCode: string;
  address: string;
}

interface NotificationState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

const router = useRouter();
const appStore = useAppStore();
const config = useRuntimeConfig();
const fundService = createFundService(config.public.apiBase);
const branches = ref<Branch[]>([]);
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

const loadBranches = async () => {
  isLoadingList.value = true;
  try {
    const data = await fundService.getBranchList();
    branches.value = data;
  } catch (error: any) {
    console.error('Error loading branches:', error);
    if (error.message) {
      showNotification(error.message, 'error');
    } else {
      showNotification('خطا در بارگذاری شعب', 'error');
    }
  } finally {
    isLoadingList.value = false;
  }
};

const handleEdit = async (branch: Branch) => {
  try {
    const data = await fundService.getBranchList(branch.id);
    if (data && data.length > 0) {
      // Handle edit logic
    }
  } catch (error: any) {
    console.error('Error loading branch details:', error);
    if (error.message) {
      showNotification(error.message, 'error');
    } else {
      showNotification('خطا در بارگذاری اطلاعات شعبه', 'error');
    }
  }
};

const handleDelete = async (branch: Branch) => {
  if (!branch.id) return;
  
  if (confirm('آیا از حذف این شعبه اطمینان دارید؟')) {
    isLoading.value = true;
    try {
      await fundService.deleteBranch(branch.id);
      showNotification('شعبه با موفقیت حذف شد', 'success');
      await loadBranches();
    } catch (error: any) {
      console.error('Error deleting branch:', error);
      if (error.message) {
        showNotification(error.message, 'error');
      } else {
        showNotification('خطا در حذف شعبه', 'error');
      }
    } finally {
      isLoading.value = false;
    }
  }
};

const goBack = () => {
  router.back();
};

const toggleSidebar = () => {
  appStore.toggleSidebar();
};

onMounted(() => {
  loadBranches();
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