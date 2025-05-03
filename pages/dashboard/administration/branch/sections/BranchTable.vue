<template>
  <div class="overflow-x-auto">
    <div v-if="isLoading" class="text-center py-4">
      <Icon name="mdi:loading" class="animate-spin h-8 w-8 mx-auto text-blue-600" />
      <p class="mt-2 text-gray-600">در حال بارگذاری...</p>
    </div>
    
    <table v-else class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">کد</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مدیر</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تلفن</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="branch in branches" :key="branch.id">
          <td class="px-6 py-4 whitespace-nowrap">{{ branch.code }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ branch.name }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ branch.manager }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ branch.phone }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span :class="branch.isActive ? 'text-green-600' : 'text-red-600'">
              {{ branch.isActive ? 'فعال' : 'غیرفعال' }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-left">
            <div class="flex items-center gap-2">
              <EditIcon
                @click="updateBranch(branch)"
                :disabled="isDisabled"
                class="disabled:opacity-50 cursor-pointer"
              />
              <TrashIcon
                @click="deleteBranch(branch)"
                :disabled="isDisabled"
                class="disabled:opacity-50 cursor-pointer"
              />
            </div>
          </td>
        </tr>
        <tr v-if="branches.length === 0">
          <td colspan="6" class="px-6 py-4 text-center text-gray-500">
            هیچ شعبه‌ای یافت نشد
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import EditIcon from '@/components/icons/EditIcon.vue';
import TrashIcon from '@/components/icons/TrashIcon.vue';
import { createFundService } from '@/services/administration/fundService';
import { useRuntimeConfig } from 'nuxt/app';

const config = useRuntimeConfig();
const fundService = createFundService(config.public.apiBase);

const updateBranch = (branch: Branch) => {
  fundService.updateBranch(branch);
};

const deleteBranch = (branch: Branch) => {
  if (confirm('آیا از حذف این شعبه اطمینان دارید؟')) {
    fundService.deleteBranch(branch.id);
  }
};

interface Branch {
  id: number;
  isActive: boolean;
  code: string;
  name: string;
  manager: string;
  phone: string;
  fax: string;
  cellPhone: string;
  postalCode: string;
  address: string;
}

defineProps<{
  branches: Branch[];
  isLoading: boolean;
  isDisabled: boolean;
}>();

defineEmits<{
  (e: 'edit', branch: Branch): void;
  (e: 'delete', branch: Branch): void;
}>();
</script> 