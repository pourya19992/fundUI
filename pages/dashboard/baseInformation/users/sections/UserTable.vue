<template>
  <BaseTable
    :items="users"
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
    <template #header-cells>
      <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام کاربری</th>
      <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام</th>
      <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام خانوادگی</th>
      <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
    </template>
    <template #data-cells="{ item }">
      <td class="px-6 py-4 whitespace-nowrap">{{ item.username }}</td>
      <td class="px-6 py-4 whitespace-nowrap">{{ item.person.firstName }}</td>
      <td class="px-6 py-4 whitespace-nowrap">{{ item.person.lastName }}</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span :class="item.isActive ? 'text-green-600' : 'text-red-600'">
          {{ item.isActive ? 'فعال' : 'غیرفعال' }}
        </span>
      </td>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import BaseTable from '@/components/base/BaseTable.vue';
import { type User } from '@/services/auth/userService';

const props = defineProps<{
  users: User[];
  isLoading: boolean;
  isDisabled: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}>();

const emit = defineEmits<{
  (e: 'edit', item: User): void;
  (e: 'delete', item: User): void;
  (e: 'pageChange', page: number): void;
  (e: 'pageSizeChange', size: number): void;
}>();

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