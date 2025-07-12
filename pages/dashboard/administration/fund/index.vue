<template>
<div class="w-full bg-white rounded-lg shadow mr-8" dir="rtl">
    <Notification ref="notificationRef" />

    <div class="p-6">
        <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">مدیریت صندوق</h2>
        <FundForm
            ref="fundFormRef"
            @submit="loadFunds"
        />
        </div>

        <!-- funds Table -->
        <FundTable
        :funds="paginatedFunds"
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
import { createFundService } from "@/services/administration/fundService";
import type {Fund} from "@/services/administration/fundService";
import Notification from '@/components/Notification.vue';
import FundForm from './sections/FundForm.vue';
import FundTable from './sections/FundTable.vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../../../../stores/app';
import { BASE_URL } from '@/utils/constants';
import { useNotify, setNotificationComponent } from '@/helpers/hooks/useNotify';

const router = useRouter();
const appStore = useAppStore();
const fundService = createFundService(BASE_URL);
const funds = ref<Fund[]>([]);
const isLoading = ref(false);
const isLoadingList = ref(false);
const fundFormRef = ref(null);
const notificationRef = ref();
const notify = useNotify();

  // Pagination state
const currentPage = ref(0);
const pageSize = ref(10);

const totalPages = computed(() => Math.ceil(funds.value.length / pageSize.value));

const paginatedFunds = computed(() => {
    const start = currentPage.value * pageSize.value;
    const end = start + pageSize.value;
    return funds.value.slice(start, end);
});

const handlePageChange = (page: number) => {
    currentPage.value = page;
};

const handlePageSizeChange = (size: number) => {
    pageSize.value = size;
    currentPage.value = 0; // Reset to first page when changing page size
};

const loadFunds = async () => {
    isLoadingList.value = true;
    try {
    const data = await fundService.getFundList();
    funds.value = data;
    } catch (error: any) {
    console.error('Error loading funds:', error);
    notify({ description: error.message || 'خطا در بارگذاری صندوق', status: 'error' });
    } finally {
    isLoadingList.value = false;
    }
};

const handleEdit = async (fund: Fund) => {
    try {
    const data = await fundService.getFund(fund.id!);
    if (data && fundFormRef.value) {
        (fundFormRef.value as any).openForEdit(data);
    }
    } catch (error: any) {
    console.error('Error loading fund details:', error);
    notify({ description: error.message || 'خطا در بارگذاری اطلاعات صندوق', status: 'error' });
    }
};

const handleDelete = async (fund: Fund) => {
    if (!fund.id) return;

    if (confirm('آیا از حذف این صندوق اطمینان دارید؟')) {
    isLoading.value = true;
    try {
        await fundService.deleteFund(fund.id);
        notify({ description: 'صندوق با موفقیت حذف شد', status: 'success' });
        await loadFunds();
    } catch (error: any) {
        console.error('Error deleting fund:', error);
        notify({ description: error.message || 'خطا در حذف صندوق', status: 'error' });
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
    loadFunds();
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