<template>
  <BaseTable
    :items="paramsWithLabels"
    :columns="columns"
    :is-loading="isLoading"
    :is-operation-disabled="isDisabled"
    :current-page="currentPage"
    :total-pages="totalPages"
    :page-size="pageSize"
    :colspan="7"
    @edit="handleEdit"
    @delete="handleDelete"
    @pageChange="handlePageChange"
    @pageSizeChange="handlePageSizeChange"
  />
</template>
<script setup lang="ts">
import { computed } from 'vue';
import BaseTable from '@/components/base/BaseTable.vue';
import { type Params } from '@/services/administration/paramService';

const props = defineProps<{
  params: Params[];
  isLoading: boolean;
  isDisabled: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}>();

const columns = [
  { label: 'نام', key: 'name' },
  { label: 'مقدار', key: 'value' },
  { label: 'تفصیل', key: 'detailLedger'},
  { label: 'معین', key: 'subsidiaryLedger'},
  { label: 'نوع پارامتر', key: 'paramsType' },
  { label: 'صندوق', key: 'fund' },
  { label: 'وضعیت', key: 'isActiveLabel' },
  { label: 'قابل ویرایش', key: 'isEditableLabel' },
];

const paramsWithLabels = computed(() =>
  props.params.map(p => ({
    ...p,
    paramsType: p.paramsType?.name || '-',
    fund: p.fund?.name || '-',
    subsidiaryLedger: p.subsidiaryLedger?.code || '-',
    detailLedger: p.detailLedger?.code || '-',
    isActiveLabel: p.isActive ? 'فعال' : 'غیرفعال',
    isEditableLabel: p.isEditable ? 'بله' : 'خیر',
  }))
);

const emit = defineEmits<{
  (e: 'edit', param: Params): void;
  (e: 'delete', param: Params): void;
  (e: 'pageChange', page: number): void;
  (e: 'pageSizeChange', size: number): void;
}>();

const handleEdit = (item: any) => {
  const originalItem = props.params.find(p => p.id === item.id);
  if (originalItem) {
    emit('edit', originalItem);
  }
};
const handleDelete = (item: any) => {
  const originalItem = props.params.find(p => p.id === item.id);
  if (originalItem) {
    emit('delete', originalItem);
  }
};
const handlePageChange = (page: number) => {
  emit('pageChange', page);
};
const handlePageSizeChange = (size: number) => {
  emit('pageSizeChange', size);
};
</script>

