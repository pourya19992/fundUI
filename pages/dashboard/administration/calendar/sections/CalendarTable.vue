<template>
<BaseTable
    :items="calendarsWithLabels"
    :columns="columns"
    :is-loading="isLoading"
    :is-operation-disabled="isDisabled"
    :current-page="currentPage"
    :total-pages="totalPages"
    :page-size="pageSize"
    :colspan="3"
    @edit="handleEdit"
    @delete="handleDelete"
    @pageChange="handlePageChange"
    @pageSizeChange="handlePageSizeChange"
/>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseTable from '@/components/base/BaseTable.vue';
import { type Calendar } from '@/services/administration/calendarService';

const props = defineProps<{
calendars: Calendar[];
isLoading: boolean;
isDisabled: boolean;
currentPage: number;
totalPages: number;
pageSize: number;
}>();

const columns = [
{ label: 'تاریخ', key: 'calendarDate' },
{ label: 'روز تعطیل', key: 'isOffLabel' },
{ label: 'تعطیل کاری', key: 'isVacationLabel' },
];

const calendarsWithLabels = computed(() =>
props.calendars.map(c => ({
    ...c,
    isOffLabel: c.isOff ? 'بله' : 'خیر',
    isVacationLabel: c.isVacation ? 'بله' : 'خیر',
}))
);

const emit = defineEmits<{
(e: 'edit', calendar: Calendar): void;
(e: 'delete', calendar: Calendar): void;
(e: 'pageChange', page: number): void;
(e: 'pageSizeChange', size: number): void;
}>();

const handleEdit = (item: Calendar) => {
emit('edit', item);
};
const handleDelete = (item: Calendar) => {
emit('delete', item);
};
const handlePageChange = (page: number) => {
emit('pageChange', page);
};
const handlePageSizeChange = (size: number) => {
emit('pageSizeChange', size);
};
</script>
