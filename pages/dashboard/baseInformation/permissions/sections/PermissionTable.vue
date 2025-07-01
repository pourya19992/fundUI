<template>
  <BaseTable
    :items="permissionsWithLabels"
    :columns="columns"
    :is-loading="isLoading"
    :is-operation-disabled="isDisabled"
    :current-page="currentPage"
    :total-pages="totalPages"
    :page-size="pageSize"
    :colspan="3"
    @edit="handleEdit"
    @delete="handleDelete"
    @pageChange="handlePageChange"
    @pageSizeChange="handlePageSizeChange"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseTable from '@/components/base/BaseTable.vue';
import { type Permission } from '@/services/baseInformation/permissionService';

const props = defineProps<{
  permissions: Permission[];
  isLoading: boolean;
  isDisabled: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}>();

const columns = [
  { label: 'نام', key: 'name' },
  { label: 'URL', key: 'url' },
  { label: 'حساس', key: 'isSensitiveLabel' },
];

const permissionsWithLabels = computed(() =>
  props.permissions.map(p => ({
    ...p,
    isSensitiveLabel: p.isSensitive ? 'بله' : 'خیر',
  }))
);

const emit = defineEmits<{
  (e: 'edit', permission: Permission): void;
  (e: 'delete', permission: Permission): void;
  (e: 'pageChange', page: number): void;
  (e: 'pageSizeChange', size: number): void;
}>();

const handleEdit = (item: Permission) => {
  emit('edit', item);
};
const handleDelete = (item: Permission) => {
  emit('delete', item);
};
const handlePageChange = (page: number) => {
  emit('pageChange', page);
};
const handlePageSizeChange = (size: number) => {
  emit('pageSizeChange', size);
};
</script>
