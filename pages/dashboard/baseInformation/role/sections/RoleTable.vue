<template>
  <BaseTable
    :items="roles"
    :columns="columns"
    :is-loading="isLoading"
    :is-operation-disabled="isDisabled"
    :current-page="currentPage"
    :total-pages="totalPages"
    :page-size="pageSize"
    :colspan="1"
    @edit="handleEdit"
    @delete="handleDelete"
    @pageChange="handlePageChange"
    @pageSizeChange="handlePageSizeChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseTable from '@/components/base/BaseTable.vue';
import { type Role } from '@/services/baseInformation/roleService';

const props = defineProps<{
  roles: Role[];
  isLoading: boolean;
  isDisabled: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}>();

const columns = [
  { label: 'نام', key: 'name' },
];

const emit = defineEmits<{
  (e: 'edit', item: Role): void;
  (e: 'delete', item: Role): void;
  (e: 'pageChange', page: number): void;
  (e: 'pageSizeChange', size: number): void;
}>();

const handleEdit = (item: Role) => {
  emit('edit', item);
};

const handleDelete = (item: Role) => {
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