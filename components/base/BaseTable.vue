<template>
  <div class="overflow-x-auto">
    <div v-if="isLoading" class="text-center py-4">
      <div class="animate-spin h-8 w-8 mx-auto text-blue-600 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
      <p class="mt-2 text-gray-600">در حال بارگذاری...</p>
    </div>

    <table v-else class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr v-if="columns && columns.length">
          <th v-for="col in columns" :key="col.key" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            {{ col.label }}
          </th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
        </tr>
        <tr v-if="columns && columns.length">
          <th v-for="col in columns" :key="col.key + '-search'">
            <input
              v-model="searchValues[col.key]"
              :placeholder="`جستجو در ${col.label}`"
              class="text-[#b3b3b3] placeholder-[#b3b3b3] p-1 mt-2 text-xs md:text-sm w-full max-w-full border rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
              @input="onSearchChange"
            />
          </th>
          <th></th>
        </tr>
        <tr v-else>
          <!-- Slot for table headers (backward compatibility) -->
          <slot name="header-cells"></slot>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <template v-if="filteredItems && filteredItems.length > 0">
          <tr v-for="item in filteredItems" :key="item.id">
            <template v-if="columns && columns.length">
              <td v-for="col in columns" :key="col.key + '-cell'">
                {{ getCellValue(item, col.key) }}
              </td>
            </template>
            <template v-else>
              <!-- Slot for table data cells (backward compatibility) -->
              <slot name="data-cells" :item="item as TItem"></slot>
            </template>
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
    <div class="mt-4" v-if="totalPages > 1">
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
import { ref, computed, watch } from 'vue';
import EditIcon from "@/components/icons/EditIcon.vue";
import TrashIcon from "@/components/icons/TrashIcon.vue";
import Pagination from "@/components/form/Pagination.vue";

const props = defineProps({
  items: {
    type: Array as () => TItem[],
    default: () => [],
  },
  columns: {
    type: Array as () => { label: string; key: string }[],
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
    default: 0,
  },
  totalPages: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
});

const emit = defineEmits<{
  (e: 'edit', item: TItem): void;
  (e: 'delete', item: TItem): void;
  (e: 'pageChange', page: number): void;
  (e: 'pageSizeChange', size: number): void;
  (e: 'search', searchValues: Record<string, string>): void;
}>();

const searchValues = ref<Record<string, string>>({});

watch(
  () => props.columns,
  (cols) => {
    if (cols) {
      const obj: Record<string, string> = {};
      cols.forEach(col => { obj[col.key] = ''; });
      searchValues.value = obj;
    }
  },
  { immediate: true }
);

const getCellValue = (item: any, key: string) => {
  // Support nested keys like 'person.firstName'
  return key.split('.').reduce((acc, k) => acc && acc[k], item) ?? '';
};

const filteredItems = computed(() => {
  if (!props.columns || !props.columns.length) return props.items;
  return props.items.filter(item => {
    return props.columns.every(col => {
      const val = String(getCellValue(item, col.key) ?? '').toLowerCase();
      const search = (searchValues.value[col.key] || '').toLowerCase();
      return val.includes(search);
    });
  });
});

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

const onSearchChange = () => {
  emit('search', { ...searchValues.value });
};

const showPagination = computed(() => props.totalPages > 1 && props.pageSize > 0);
</script>

<style scoped>

</style>