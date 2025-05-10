<template>
    <div class="overflow-x-auto">
        <div v-if="isLoading" class="text-center py-4">
            <Icon name="mdi:loading" class="animate-spin h-8 w-8 mx-auto text-blue-600" />
            <p class="mt-2 text-gray-600">در حال بارگذاری...</p>
        </div>

        <table v-else class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">روز
                        تعطیل</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تعطیل کاری
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات
                    </th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="calendar in calendars" :key="calendar.id">
                    <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(calendar.calendarDate) }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span :class="calendar.isOff ? 'text-green-600' : 'text-red-600'">
                            {{ calendar.isOff ? 'بله' : 'خیر' }}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span :class="calendar.isVacation ? 'text-green-600' : 'text-red-600'">
                            {{ calendar.isVacation ? 'بله' : 'خیر' }}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-left">
                        <div class="flex items-center gap-2">
                            <EditIcon @click="updateCalendar(calendar)" :disabled="isDisabled"
                                class="disabled:opacity-50 cursor-pointer" />
                            <TrashIcon @click="deleteCalendar(calendar)" :disabled="isDisabled"
                                class="disabled:opacity-50 cursor-pointer" />
                        </div>
                    </td>
                </tr>
                <tr v-if="calendars.length === 0">
                    <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                        هیچ موردی یافت نشد
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Pagination -->
        <div class="mt-4">
            <Pagination :current-page="currentPage" :total-pages="totalPages" :page-size="pageSize"
                :on-page-change="onPageChange" :on-page-size-change="onPageSizeChange" />
        </div>
    </div>
</template>

<script setup lang="ts">
import EditIcon from '../../../../../components/icons/EditIcon.vue';
import TrashIcon from '../../../../../components/icons/TrashIcon.vue';
import Pagination from '@/components/form/Pagination.vue';
import { type Calendar } from '@/services/administration/calendarService';
import PersianDatePicker from 'vue3-persian-datetime-picker'
import dayjs from 'dayjs'
import jalaliday from 'jalaliday'
dayjs.extend(jalaliday)

const formatDate = (date: string) => {
    return dayjs(date).calendar('jalali').locale('fa').format('YYYY/MM/DD');
};

const updateCalendar = (calendar: Calendar) => {
    emit('edit', calendar);
};

const deleteCalendar = (calendar: Calendar) => {
    emit('delete', calendar);
};

defineProps<{
    calendars: Calendar[];
    isLoading: boolean;
    isDisabled: boolean;
    currentPage: number;
    totalPages: number;
    pageSize: number;
}>();

const emit = defineEmits<{
    (e: 'edit', calendar: Calendar): void;
    (e: 'delete', calendar: Calendar): void;
    (e: 'pageChange', page: number): void;
    (e: 'pageSizeChange', size: number): void;
}>();

const onPageChange = (page: number) => {
    emit('pageChange', page);
};

const onPageSizeChange = (size: number) => {
    emit('pageSizeChange', size);
};

const PersianDatePicker = (await import('vue3-persian-datetime-picker')).default;
</script>