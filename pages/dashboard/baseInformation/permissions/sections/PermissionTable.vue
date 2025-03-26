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
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">حساس</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="permission in permissions" :key="permission.id">
          <td class="px-6 py-4 whitespace-nowrap">{{ permission.name }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ permission.url }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span :class="permission.isSensitive ? 'text-red-600' : 'text-green-600'">
              {{ permission.isSensitive ? 'بله' : 'خیر' }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-left">
            <button
              @click="$emit('edit', permission)"
              :disabled="isDisabled"
              class="text-blue-600 hover:text-blue-900 ml-2 disabled:opacity-50"
            >
              ویرایش
            </button>
            <button
              @click="$emit('delete', permission)"
              :disabled="isDisabled"
              class="text-red-600 hover:text-red-900 disabled:opacity-50"
            >
              حذف
            </button>
          </td>
        </tr>
        <tr v-if="permissions.length === 0">
          <td colspan="4" class="px-6 py-4 text-center text-gray-500">
            هیچ دسترسی یافت نشد
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
interface Permission {
  id?: number;
  name: string;
  url: string;
  isSensitive: boolean;
}

defineProps<{
  permissions: Permission[];
  isLoading: boolean;
  isDisabled: boolean;
}>();

defineEmits<{
  (e: 'edit', permission: Permission): void;
  (e: 'delete', permission: Permission): void;
}>();
</script>
