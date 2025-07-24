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
  >
    <template #additional-actions="slotProps">
      <slot name="additional-actions" v-bind="slotProps" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseTable from '@/components/base/BaseTable.vue';
import type { CustomerResponseDto } from '@/services/baseInformation/customerService';


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
  { label: 'نام خانوادگی/شرکت', key: 'lastNameDisplay' },
  { label: 'کد ملی', key: 'person.nationalCode' },
  { label: 'موبایل', key: 'person.cellPhone' },
  { label: 'وضعیت', key: 'customerStatus.name' },
  { label: 'کد تفصیلی', key: 'detailLedger.code' },
  { label: 'حساب بانکی', key: 'bankAccount.shabaNumber' },
  { label: 'سجامی', key: 'isSejamLabel' },
];

const customersWithLabels = computed(() =>
  props.customers.map(c => ({
    ...c,
    isSejamLabel: c.isSejam ? 'هست' : 'نیست',
    lastNameDisplay: c.person?.isCompany ? c.person.companyName : c.person?.lastName
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
