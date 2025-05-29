<template>
  <div>
    <button v-if="!isEditMode" @click="onOpen" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
      تاریخ جدید
    </button>

    <Modal :is-open="isOpen" @close="onClose">
      <template #body>
        <div>
          <h3 class="text-center text-lg font-semibold mb-4">{{ isEditMode ? 'ویرایش تاریخ' : 'تاریخ جدید' }}</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm">تاریخ</label>
              <client-only>
                <PersianDatePicker v-model="form.calendarDate" />
              </client-only>
            </div>
            <div>
              <label class="block mb-1 font-bold">تعطیل رسمی</label>
              <select v-model="form.isOff" class="border rounded p-2 w-full">
                <option :value="true">بله</option>
                <option :value="false">خیر</option>
              </select>
            </div>
            <div>
              <label class="block mb-1 font-bold">تعطیلات کاری</label>
              <select v-model="form.isVacation" class="border rounded p-2 w-full">
                <option :value="true">بله</option>
                <option :value="false">خیر</option>
              </select>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center gap-4">
          <button @click="handleSubmit" class="btn-primary w-24" :disabled="isLoading">
            ثبت
          </button>
          <button @click="onClose" class="btn-secondary w-24">
            انصراف
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineExpose } from 'vue';
import type { Calendar } from '@/services/administration/calendarService';
import PersianDatePicker from "@/components/form/DatePickerPersian.vue";
import Modal from '@/components/Modal.vue';
import { useNotify } from '@/helpers/hooks/useNotify';

const emit = defineEmits(['submit']);
const notify = useNotify();

const isOpen = ref(false);
const isLoading = ref(false);
const isEditMode = ref(false);

const form = reactive({
  id: null,
  calendarDate: '',
  isOff: false,
  isVacation: false,
});

const onOpen = () => {
  isEditMode.value = false;
  isOpen.value = true;
  resetForm();
};

const openForEdit = (data: Calendar) => {
  isEditMode.value = true;
  isOpen.value = true;
  Object.assign(form, {
    id: data.id,
    calendarDate: data.calendarDate,
    isOff: data.isOff,
    isVacation: data.isVacation,
  });
};

const onClose = () => {
  isOpen.value = false;
  isEditMode.value = false;
  resetForm();
};

const resetForm = () => {
  Object.assign(form, {
    id: null,
    calendarDate: '',
    isOff: false,
    isVacation: false,
  });
};

const handleSubmit = () => {
  if (!form.calendarDate) {
    notify({ description: 'تاریخ را وارد کنید', status: 'error' });
    return;
  }
  isLoading.value = true;
  emit('submit', { ...form });
  isLoading.value = false;
  onClose();
};

defineExpose({ openForEdit });
</script>

<style scoped>
.btn-primary {
  @apply bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors;
}
</style>
