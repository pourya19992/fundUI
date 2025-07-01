<template>
  <div class="w-full bg-white rounded-lg shadow mr-8" dir="rtl">
    <Notification ref="notificationRef" />

    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">مدیریت شعب</h2>
        <BranchForm
          ref="branchFormRef"
          :refetch="loadBranches"
        />
      </div>

      <!-- Branches Table -->
      <BranchTable
        :branches="paginatedBranches"
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
import { createBranchService } from '../../../../services/administration/branchService';
import Notification from '@/components/Notification.vue';
import BranchForm from './sections/BranchForm.vue';
import BranchTable from './sections/BranchTable.vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../../../../stores/app';
import { BASE_URL } from '@/utils/constants';
import { useNotify, setNotificationComponent } from '@/helpers/hooks/useNotify';

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

const router = useRouter();
const appStore = useAppStore();
const branchService = createBranchService(BASE_URL);
const branches = ref<Branch[]>([]);
const isLoading = ref(false);
const isLoadingList = ref(false);
const branchFormRef = ref(null);
const notificationRef = ref();
const notify = useNotify();

// Pagination state
const currentPage = ref(0);
const pageSize = ref(10);

const totalPages = computed(() => Math.ceil(branches.value.length / pageSize.value));

const paginatedBranches = computed(() => {
  const start = currentPage.value * pageSize.value;
  const end = start + pageSize.value;
  return branches.value.slice(start, end);
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const handlePageSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 0; // Reset to first page when changing page size
};

const loadBranches = async () => {
  isLoadingList.value = true;
  try {
    const data = await branchService.getBranches();
    branches.value = data;
  } catch (error: any) {
    console.error('Error loading branches:', error);
    notify({ description: error.message || 'خطا در بارگذاری شعب', status: 'error' });
  } finally {
    isLoadingList.value = false;
  }
};

const handleEdit = async (branch: Branch) => {
  try {
    const data = await branchService.getBranch(branch.id);
    if (data && branchFormRef.value) {
      (branchFormRef.value as any).openForEdit(data);
    }
  } catch (error: any) {
    console.error('Error loading branch details:', error);
    notify({ description: error.message || 'خطا در بارگذاری اطلاعات شعبه', status: 'error' });
  }
};

const handleDelete = async (branch: Branch) => {
  if (!branch.id) return;

  if (confirm('آیا از حذف این شعبه اطمینان دارید؟')) {
    isLoading.value = true;
    try {
      await branchService.deleteBranch(branch.id);
      notify({ description: 'شعبه با موفقیت حذف شد', status: 'success' });
      await loadBranches();
    } catch (error: any) {
      console.error('Error deleting branch:', error);
      notify({ description: error.message || 'خطا در حذف شعبه', status: 'error' });
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
  setNotificationComponent(notificationRef.value);
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