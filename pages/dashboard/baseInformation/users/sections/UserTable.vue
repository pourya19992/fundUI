<template>
  <BaseTable
    :items="usersWithLabels"
    :columns="columns"
    :is-loading="isLoading"
    :is-operation-disabled="isDisabled"
    :current-page="currentPage"
    :total-pages="totalPages"
    :page-size="pageSize"
    :colspan="4"
    @edit="handleEdit"
    @delete="handleDelete"
    @pageChange="handlePageChange"
    @pageSizeChange="handlePageSizeChange"
  >
    <template #additional-actions="{ item }">
      <UserRole :user="item" />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseTable from '@/components/base/BaseTable.vue';
import UserRole from './UserRole.vue';
import { type User, mapUsersWithLabels } from '@/services/auth/userService';

const props = defineProps<{
  users: User[];
  isLoading: boolean;
  isDisabled: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}>();

const columns = [
  { label: 'نام کاربری', key: 'username' },
  { label: 'نام', key: 'person.firstName' },
  { label: 'نام خانوادگی', key: 'person.lastName' },
  { label: 'وضعیت', key: 'isActiveLabel' },
];

const emit = defineEmits<{
  (e: 'edit', item: User): void;
  (e: 'delete', item: User): void;
  (e: 'pageChange', page: number): void;
  (e: 'pageSizeChange', size: number): void;
}>();

const usersWithLabels = computed(() => mapUsersWithLabels(props.users));

const handleEdit = (item: User) => {
  emit('edit', item);
};

const handleDelete = (item: User) => {
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