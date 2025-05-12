<template>
  <form @submit.prevent="handleSubmit">
    <!-- Example fields, adjust as needed -->
    <label class="block text-sm">تاریخ</label>
    <div class="mb-4">
      <PersianDatePicker v-model="selectedDate" />
    </div>
    <div class="mb-4">
      <label class="block mb-1 font-bold">تعطیل رسمی</label>
      <select v-model="form.isOff" class="border rounded p-2 w-full">
        <option :value="true">بله</option>
        <option :value="false">خیر</option>
      </select>
    </div>
    <div class="mb-4">
      <label class="block mb-1 font-bold">>تعطیلات کاری</label>
      <select v-model="form.isVacation" class="border rounded p-2 w-full">
        <option :value="true">بله</option>
        <option :value="false">خیر</option>
      </select>
    </div>
    <!-- Add more fields as needed -->
    <div class="flex gap-2">
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">ذخیره</button>
      <button type="button" @click="resetForm" class="bg-gray-400 text-white px-4 py-2 rounded">انصراف</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, defineExpose } from 'vue';
import type { Calendar, CalendarDto } from '@/services/administration/calendarService';
import PersianDatePicker from "@/components/form/DatePickerPersian.vue";
import { useNotify } from '@/helpers/hooks/useNotify';
const emit = defineEmits(['submit']);
const notify = useNotify();

const form = ref<Partial<CalendarDto>>({
  calendarDate: '',
  isOff: false,
  isVacation: false,
});

const selectedDate = ref('');
function handleSubmit() {
  if (!form.value.calendarDate) {
    notify({ description: 'تاریخ را وارد کنید', status: 'error' });
    return;
  }
  emit('submit', { ...form.value });
  resetForm();
}

function openForEdit(data: Calendar) {
  form.value = { ...data };
}

function resetForm() {
  form.value = { calendarDate: '', isOff: false, isVacation: false };
}

defineExpose({ openForEdit });
</script>

<style scoped>
form {
  max-width: 400px;
}
</style>
