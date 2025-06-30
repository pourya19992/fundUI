<template>
  <div class="overflow-x-auto">
    <div v-if="isLoading" class="text-center py-4">
      <div class="animate-spin h-8 w-8 mx-auto text-blue-600 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
      <p class="mt-2 text-gray-600">در حال بارگذاری...</p>
    </div>

    <table v-else class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <!-- Slot for table headers -->
          <slot name="header-cells"></slot>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <template v-if="items && items.length > 0">
          <tr v-for="item in items" :key="item.id">
            <!-- Slot for table data cells -->
            <slot name="data-cells" :item="item as TItem"></slot>
            <td class="px-6 py-4 whitespace-nowrap text-left">
              <div class="flex items-center gap-2">
                <slot name="additional-actions" :item="item"></slot>
                <EditIcon
                  @click="handleEditClick(item)"
                  :disabled="isOperationDisabled"
                  class="disabled:opacity-50 cursor-pointer"
                />
                <TrashIcon
                  @click="handleDeleteClick(item)"
                  :disabled="isOperationDisabled"
                  class="disabled:opacity-50 cursor-pointer"
                />
              </div>
            </td>
          </tr>
        </template>
        <tr v-else>
          <td :colspan="colspan" class="px-6 py-4 text-center text-gray-500">
            {{ emptyMessage }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="mt-4">
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :page-size="pageSize"
        :on-page-change="onPageChange"
        :on-page-size-change="onPageSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts" generic="TItem extends { id?: any }">
import EditIcon from "@/components/icons/EditIcon.vue";
import TrashIcon from "@/components/icons/TrashIcon.vue";
import Pagination from "@/components/form/Pagination.vue";

const props = defineProps({
  items: {
    type: Array as () => TItem[],
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  isOperationDisabled: {
    type: Boolean,
    default: false,
  },
  emptyMessage: {
    type: String,
    default: "هیچ موردی یافت نشد",
  },
  colspan: {
    type: Number,
    required: true,
  },

  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'edit', item: TItem): void;
  (e: 'delete', item: TItem): void;
  (e: 'pageChange', page: number): void;
  (e: 'pageSizeChange', size: number): void;
}>();

const onPageChange = (page: number) => {
  emit('pageChange', page);
};

const onPageSizeChange = (size: number) => {
  emit('pageSizeChange', size);
};

const handleEditClick = (item: TItem) => {
  emit('edit', item);
};

const handleDeleteClick = (item: TItem) => {
  emit('delete', item);
};
</script>

<style scoped>

</style>