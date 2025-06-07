<template>
  <div class="overflow-x-auto">
    <div v-if="isLoading" class="text-center py-4">
      <Icon name="mdi:loading" class="animate-spin h-8 w-8 mx-auto text-blue-600" />
      <p class="mt-2 text-gray-600">در حال بارگذاری...</p>
    </div>

    <table v-else class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="role in roles" :key="role.id">
          <td class="px-6 py-4 whitespace-nowrap">{{ role.name }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-left">
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-left">
            <div class="flex items-center gap-2">
              <EditIcon @click="$emit('edit', role)" :disabled="isDisabled"
                class="disabled:opacity-50 cursor-pointer" />
              <TrashIcon @click="$emit('delete', role)" :disabled="isDisabled"
                class="disabled:opacity-50 cursor-pointer" />
            </div>
          </td>
        </tr>
        <tr v-if="roles.length === 0">
          <td colspan="4" class="px-6 py-4 text-center text-gray-500">
            هیچ نقش یافت نشد
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mt-4">
          <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          :page-size="pageSize"
          :on-page-change="onPageChange"
          :on-page-size-change="onPageSizeChange" />
      </div>
  </div>
</template>

<script setup lang="ts">
import EditIcon from "@/components/icons/EditIcon.vue";
import TrashIcon from "@/components/icons/TrashIcon.vue";
import { type Role } from '@/services/baseInformation/roleService';
import Pagination from '@/components/form/Pagination.vue';

defineProps<{
  roles: Role[];
  isLoading: boolean;
  isDisabled: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}>();

const emit = defineEmits<{
  (e: 'edit', role: Role): void;
  (e: 'delete', role: Role): void;
  (e: 'pageChange', page: number): void;
  (e: 'pageSizeChange', size: number): void;
}>();

const onPageChange = (page: number) => {
    emit('pageChange', page);
};

const onPageSizeChange = (size: number) => {
    emit('pageSizeChange', size);
};

</script>

<style scoped>
</style>