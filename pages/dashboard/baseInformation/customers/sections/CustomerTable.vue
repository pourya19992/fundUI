<template>
  <BaseTable
    :items="customersWithLabels"
    :columns="columns"
    :is-loading="isLoading"
    :is-operation-disabled="isDisabled"
    :current-page="currentPage"
    :total-pages="totalPages"
    :page-size="pageSize"
    :colspan="8"
    @edit="handleEdit"
    @delete="handleDelete"
    @pageChange="handlePageChange"
    @pageSizeChange="handlePageSizeChange"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseTable from '@/components/base/BaseTable.vue';
import type { Customer, CustomerRequestDto, CustomerResponseDto } from '@/services/baseInformation/customerService';


const props = defineProps<{
  customers: CustomerResponseDto[];
  isLoading: boolean;
  isDisabled: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}>();

const columns = [
  { label: 'نام', key: 'person.firstName' },
  { label: 'نام خانوادگی', key: 'person.lastName' },
  { label: 'کد ملی', key: 'person.nationalCode' },
  { label: 'موبایل', key: 'person.cellPhone' },
  { label: 'وضعیت', key: 'customerStatus.name' },
  { label: 'دفتر کل تفصیلی', key: 'detailLedger.name' },
  { label: 'حساب بانکی', key: 'customerBankAccount.bankAccount.accountNumber' },
  { label: 'سود پرداختی', key: 'profitIssueLabel' },
];

const customersWithLabels = computed(() =>
  props.customers.map(c => ({
    ...c,
    profitIssueLabel: c.isProfitIssue ? 'دارد' : 'ندارد',
  }))
);

const emit = defineEmits<{
  (e: 'edit', item: CustomerResponseDto): void;
  (e: 'delete', item: CustomerResponseDto): void;
  (e: 'pageChange', page: number): void;
  (e: 'pageSizeChange', size: number): void;
}>();

const handleEdit = (item: CustomerResponseDto) => {
  emit('edit', item);
};

const handleDelete = (item: CustomerResponseDto) => {
  emit('delete', item);
};

const handlePageChange = (page: number) => {
  emit('pageChange', page);
};

const handlePageSizeChange = (size: number) => {
  emit('pageSizeChange', size);
};
</script>

<style scoped></style>
