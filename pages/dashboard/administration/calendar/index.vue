<template>
  <div class="w-full bg-white rounded-lg shadow mr-8" dir="rtl">
  <!-- <div class="w-full bg-white rounded-lg shadow mr-6" dir="rtl"> -->
    <Notification ref="notificationRef" />
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">مدیریت تقویم</h2>
        <CalendarForm
          ref="calendarFormRef"
          :refetch="fetchCalendars"
        />
      </div>

      <!-- Calendar Table -->
      <CalendarTable
        :calendars="paginatedCalendars"
        :isLoading="loading"
        :isDisabled="loading"
        :currentPage="currentPage"
        :totalPages="totalPages"
        :pageSize="pageSize"
        @edit="handleEdit"
        @delete="deleteCalendarEntry"
        @pageChange="handlePageChange"
        @pageSizeChange="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { createCalendarService, type Calendar, type CalendarDto } from '@/services/administration/calendarService';
import Notification from '@/components/Notification.vue';
import CalendarTable from './sections/CalendarTable.vue';
import { useNotify, setNotificationComponent } from '@/helpers/hooks/useNotify';
import CalendarForm from './sections/CalendarForm.vue';

const calendars = ref<Calendar[]>([]);
const loading = ref(false);
const calendarService = createCalendarService(BASE_URL);
const notificationRef = ref();
const calendarFormRef = ref(null);
const notify = useNotify();
const router = useRouter();
const appStore = useAppStore();

// Pagination state
const currentPage = ref(0);
const pageSize = ref(10);

const totalPages = computed(() => Math.ceil(calendars.value.length / pageSize.value));

const paginatedCalendars = computed(() => {
  const start = currentPage.value * pageSize.value;
  const end = start + pageSize.value;
  return calendars.value.slice(start, end);
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const handlePageSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 0;
};

const fetchCalendars = async () => {
  loading.value = true;
  try {
    calendars.value = await calendarService.getCalendarList();
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'خطا در دریافت اطلاعات';
    notify({
      description: errorMessage,
      status: 'error'
    });
    console.error('Error fetching calendars:', err);
  } finally {
    loading.value = false;
  }
};

const handleEdit = async (calendar: Calendar) => {
  try {
    const data = await calendarService.getCalendar(calendar.id);
    if (data && calendarFormRef.value) {
      (calendarFormRef.value as any).openForEdit(data);
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'خطا در دریافت اطلاعات';
    notify({
      description: errorMessage,
      status: 'error'
    });
    console.error('Error loading calendar details:', err);
  }
};

const deleteCalendarEntry = async (calendar: Calendar) => {
  if (confirm('آیا از حذف این مورد اطمینان دارید؟')) {
    loading.value = true;
    try {
      await calendarService.deleteCalendar(calendar.id);
      notify({
        description: 'مورد با موفقیت حذف شد',
        status: 'success'
      });
      await fetchCalendars();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطا در حذف مورد';
      notify({
        description: errorMessage,
        status: 'error'
      });
      console.error('Error deleting calendar entry:', err);
    } finally {
      loading.value = false;
    }
  }
};

const handleFormSubmit = async (data: CalendarDto) => {
  loading.value = true;
  try {
    if ('id' in data) {
      await calendarService.updateCalendar(data as Calendar);
      notify({
        description: 'اطلاعات با موفقیت بروزرسانی شد',
        status: 'success'
      });
    } else {
      await calendarService.addCalendar(data);
      notify({
        description: 'مورد جدید با موفقیت اضافه شد',
        status: 'success'
      });
    }
    await fetchCalendars();
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'خطا در ذخیره اطلاعات';
    notify({
      description: errorMessage,
      status: 'error'
    });
    console.error('Error saving calendar:', err);
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.back();
};

const toggleSidebar = () => {
  appStore.toggleSidebar();
};

// Set up notification component and load initial data
onMounted(() => {
  setNotificationComponent(notificationRef.value);
  fetchCalendars();
});

definePageMeta({
  layout: 'default'
});
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>