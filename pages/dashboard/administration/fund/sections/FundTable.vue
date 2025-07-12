<template>
<BaseTable
    :items="fundsWithLabels"
    :columns="columns"
    :is-loading="isLoading"
    :is-operation-disabled="isDisabled"
    :current-page="currentPage"
    :total-pages="totalPages"
    :page-size="pageSize"
    :colspan="5"
    @edit="handleEdit"
    @delete="handleDelete"
    @pageChange="handlePageChange"
    @pageSizeChange="handlePageSizeChange"
    />
</template>
<script setup lang="ts">
import { computed } from 'vue';
import BaseTable from '@/components/base/BaseTable.vue';
import type { Fund } from '@/services/administration/fundService';

const props = defineProps<{
    funds: Fund[];
    isLoading: boolean;
    isDisabled: boolean;
    currentPage: number;
    totalPages: number;
    pageSize: number;
}>();

const columns = [
    { label: 'نام', key: 'name' },
    { label: 'ETF', key: 'isETFLabel' },
];

const fundsWithLabels = computed(() =>
    props.funds.map(b => ({
    ...b,
    isETFLabel: b.isETF ? 'ETF' : 'غیر ETF',
    }))
);

const emit = defineEmits<{
    (e: 'edit', fund: Fund): void;
    (e: 'delete', fund: Fund): void;
    (e: 'pageChange', page: number): void;
    (e: 'pageSizeChange', size: number): void;
}>();

const handleEdit = (item: Fund) => {
    emit('edit', item);
};
const handleDelete = (item: Fund) => {
    emit('delete', item);
};
const handlePageChange = (page: number) => {
    emit('pageChange', page);
};
const handlePageSizeChange = (size: number) => {
    emit('pageSizeChange', size);
};
</script>