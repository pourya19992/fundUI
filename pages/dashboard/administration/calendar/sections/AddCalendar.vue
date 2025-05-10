<template>
<div>
    <button @click="onOpen" class="bg-primary text-white px-4 py-2 rounded">
    تقویم جدید
    </button>

    <Modal :is-open="isOpen" @close="onClose">
    <template #body>
        <div>
        <h3 class="text-center text-lg font-semibold mb-4">تقویم جدید</h3>
        <div class="space-y-4">
            <div>
        <label class="block text-sm">تاریخ</label>
        <input v-model="calendarDate" type="date" class="input-field" required />
            </div>
            <div>
            <label class="block text-sm">تعطیل رسمی</label>
            <select v-model="isOff" class="input-field">
                <option :value="true">بله</option>
                <option :value="false">خیر</option>
            </select>
            </div>
            <div>
            <label class="block text-sm">تعطیلات خاص</label>
            <select v-model="isVacation" class="input-field">
                <option :value="true">بله</option>
                <option :value="false">خیر</option>
            </select>
            </div>
        </div>
        </div>
    </template>

    <template #footer>
        <div class="flex justify-center gap-4">
        <button 
            @click="handleSubmit" 
            class="btn-primary w-24"
            :disabled="isLoading"
        >
            ثبت
        </button>
        <button 
            @click="onClose" 
            class="btn-secondary w-24"
        >
            انصراف
        </button>
        </div>
    </template>
    </Modal>
</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { createCalendarService } from "@/services/administration/calendarService";
import Modal from "@/components/Modal.vue";
import { useNotify } from "@/helpers/hooks/useNotify";
import { useRuntimeConfig } from "nuxt/app";

const props = defineProps({
refetch: Function
});

const config = useRuntimeConfig();
const calendarService = createCalendarService(config.public.apiBase);

const isOpen = ref(false);
const isLoading = ref(false);
const calendarDate = ref("");
const isOff = ref(false);
const isVacation = ref(false);
const editingId = ref<number | null>(null);

const notify = useNotify();

const onOpen = () => {
isOpen.value = true;
};

const onClose = () => {
isOpen.value = false;
resetForm();
};

const resetForm = () => {
editingId.value = null;
calendarDate.value = "";
isOff.value = false;
isVacation.value = false;
};

const handleSubmit = async () => {
if (!calendarDate.value) {
    notify({ description: "تاریخ الزامی است.", status: "warning" });
    return;
}

isLoading.value = true;
try {
    if (editingId.value) {
    await calendarService.updateCalendar({
        id: editingId.value,
        calendarDate: calendarDate.value,
        isOff: isOff.value,
        isVacation: isVacation.value
    });
    notify({ description: "تقویم با موفقیت ویرایش شد.", status: "success" });
    } else {
    await calendarService.addCalendar({
        calendarDate: calendarDate.value,
        isOff: isOff.value,
        isVacation: isVacation.value
    });
    notify({ description: "تقویم با موفقیت اضافه شد.", status: "success" });
    }
    props.refetch && props.refetch();
    onClose();
} catch (error: any) {
    notify({ description: `خطا: ${error.message}`, status: "error" });
} finally {
    isLoading.value = false;
}
};

const openForEdit = (data: any) => {
isOpen.value = true;
editingId.value = data.id;
calendarDate.value = data.calendarDate || "";
isOff.value = !!data.isOff;
isVacation.value = !!data.isVacation;
};

defineExpose({
openForEdit
});
</script>

<style scoped>
.input-field {
@apply w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.btn-primary {
@apply bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
@apply bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors;
}
</style>