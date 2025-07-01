<template>
  <BaseTable
    :items="branchesWithLabels"
    :columns="columns"
    :is-loading="isLoading"
    :is-operation-disabled="isDisabled"
    :current-page="currentPage"
    :total-pages="totalPages"
    :page-size="pageSize"
    :colspan="5"
    @edit="handleEdit"
    @delete="handleDelete"
    @pageChange="handlePageChange"
    @pageSizeChange="handlePageSizeChange"
  />
</template>
<script setup lang="ts">
import { computed } from 'vue';
import BaseTable from '@/components/base/BaseTable.vue';
import { type Branch } from '@/services/administration/branchService';

const props = defineProps<{
  branches: Branch[];
  isLoading: boolean;
  isDisabled: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}>();

const columns = [
  { label: 'کد', key: 'code' },
  { label: 'نام', key: 'name' },
  { label: 'مدیر', key: 'manager' },
  { label: 'تلفن', key: 'phone' },
  { label: 'وضعیت', key: 'isActiveLabel' },
];

const branchesWithLabels = computed(() =>
  props.branches.map(b => ({
    ...b,
    isActiveLabel: b.isActive ? 'فعال' : 'غیرفعال',
  }))
);

const emit = defineEmits<{
  (e: 'edit', branch: Branch): void;
  (e: 'delete', branch: Branch): void;
  (e: 'pageChange', page: number): void;
  (e: 'pageSizeChange', size: number): void;
}>();

const handleEdit = (item: Branch) => {
  emit('edit', item);
};
const handleDelete = (item: Branch) => {
  emit('delete', item);
};
const handlePageChange = (page: number) => {
  emit('pageChange', page);
};
const handlePageSizeChange = (size: number) => {
  emit('pageSizeChange', size);
};
</script>