<template>
<BaseTable
    :items="userGroups"
    :columns="columns"
    :is-loading="isLoading"
    :is-operation-disabled="isDisabled"
    :current-page="currentPage"
    :total-pages="totalPages"
    :page-size="pageSize"
    :colspan="1"
    @edit="handleEdit"
    @delete="handleDelete"
    @pageChange="handlePageChange"
    @pageSizeChange="handlePageSizeChange"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseTable from '@/components/base/BaseTable.vue';
import type { UserGroup} from '@/services/baseInformation/userGroupService'

const props = defineProps<{
userGroups: UserGroup[];
isLoading: boolean;
isDisabled: boolean;
currentPage: number;
totalPages: number;
pageSize: number;
}>();

const columns = [
{ label: 'نام', key: 'name' },
];

const emit = defineEmits<{
(e: 'edit', item: UserGroup): void;
(e: 'delete', item: UserGroup): void;
(e: 'pageChange', page: number): void;
(e: 'pageSizeChange', size: number): void;
}>();

const handleEdit = (item: UserGroup) => {
    emit('edit', item);
};

const handleDelete = (item: UserGroup) => {
    emit('delete', item);
};

const handlePageChange = (page: number) => {
    emit('pageChange', page);
};

const handlePageSizeChange = (size: number) => {
    emit('pageSizeChange', size);
};
</script>