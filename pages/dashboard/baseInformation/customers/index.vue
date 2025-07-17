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
        <h2 class="text-2xl font-bold">مدیریت مشتریان</h2>
        <CustomerForm
        ref="customerFormRef"
        @submit="loadCustomers"
    />
    </div>

    <CustomerTable
        :customers="customers"
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
import { createCustomerService } from '@/services/baseInformation/customerService';
import Notification from '@/components/form/Notification.vue';
import CustomerTable from './sections/CustomerTable.vue';
import CustomerForm from './sections/CustomerForm.vue';
import type { CustomerResponseDto, CustomerRequestDto } from '@/services/baseInformation/customerService';
import { BASE_URL } from '@/utils/constants';

interface NotificationState {
show: boolean;
message: string;
type: 'success' | 'error';
}

const customerService = createCustomerService(BASE_URL);

const customers = ref<CustomerResponseDto[]>([]);
const isLoading = ref(false);
const isLoadingList = ref(false);

// ویرایش
const handleEdit = async (customer: CustomerResponseDto) => {
  try {
    // گرفتن اطلاعات کامل مشتری (اگر لازم است)
    const data: CustomerRequestDto = await customerService.getCustomer(customer.id!);
    if (data && customerFormRef.value) {
      customerFormRef.value.openForEdit(data); // فرم شما باید با CustomerRequestDto کار کند
    }
  } catch (error: any) {
    console.error('Error loading customer details:', error);
    showNotification(`خطا در بارگذاری اطلاعات مشتری برای ویرایش: ${error.message}`, 'error');
  }
};

// حذف
const handleDelete = async (customer: CustomerResponseDto) => {
  if (!customer.id) return;
  if (confirm(`آیا از حذف مشتری "${customer.person?.firstName} ${customer.person?.lastName}" اطمینان دارید؟`)) {
    isLoading.value = true;
    try {
      // حذف با id مشتری
      await customerService.removeCustomer(customer.id);
      showNotification('مشتری با موفقیت حذف شد', 'success');
      await loadCustomers();
    } catch (error: any) {
      console.error('Error deleting customer:', error);
      showNotification(`خطا در حذف مشتری: ${error.message}`, 'error');
    } finally {
      isLoading.value = false;
    }
  }
};

// افزودن یا ویرایش (در فرم)
const submitCustomer = async (customer: CustomerRequestDto) => {
  if (customer.id) {
    await customerService.editCustomer(customer);
  } else {
    await customerService.addCustomer(customer);
  }
  await loadCustomers();
};

const notification = ref<NotificationState>({
show: false,
message: '',
type: 'success'
});

const currentPage = ref(0);
const pageSize = ref(10);
const totalPages = ref(0);
const totalElements = ref(0);

const paginatedCustomers = computed(() => {
const start = currentPage.value * pageSize.value;
const end = start + pageSize.value;
return customers.value.slice(start, end);
});

const customerFormRef = ref<InstanceType<typeof CustomerForm> | null>(null);

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

const loadCustomers = async (page = currentPage.value, size = pageSize.value) => {
  isLoadingList.value = true;
  try {
    const data = await customerService.getAllCustomers(page, size);
    customers.value = data.content;
    totalPages.value = data.totalPages;
    totalElements.value = data.totalElements;
  } catch (error: any) {
    console.error('Error loading customers:', error);
    showNotification(`خطا در بارگذاری مشتریان: ${error.message}`, 'error');
  } finally {
    isLoadingList.value = false;
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  loadCustomers(page, pageSize.value);
};

const handlePageSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 0;
  loadCustomers(0, size);
};

onMounted(() => {
  loadCustomers();
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
