<template>
<div>
    <button @click="onOpen" class="bg-primary text-white px-4 py-2 rounded">
    تقویم جدید
    </button>

    <Modal :is-open="isOpen" @close="onClose">
    <template #body>
        <h3 class="text-center text-lg font-semibold mb-4">تقویم جدید</h3>
        <CalendarForm
            :model-value="formData"
            :is-loading="isLoading"
            @submit="handleSubmit"
            @cancel="onClose"
        />
    </template>
    </Modal>
</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { createCalendarService } from "@/services/administration/calendarService";
import Modal from "@/components/Modal.vue";
import CalendarForm from "./CalendarForm.vue";
import { useNotify } from "@/helpers/hooks/useNotify";
import { useRuntimeConfig } from "nuxt/app";

const props = defineProps({ refetch: Function });

const config = useRuntimeConfig();
const calendarService = createCalendarService(config.public.apiBase);

const isOpen = ref(false);
const isLoading = ref(false);
const editingId = ref<number | null>(null);
const notify = useNotify();

const formData = ref({
    calendarDate: "",
    isOff: false,
    isVacation: false,
});

const onOpen = () => {
    isOpen.value = true;
    editingId.value = null;
    formData.value = { calendarDate: "", isOff: false, isVacation: false };
};

const onClose = () => {
    isOpen.value = false;
    editingId.value = null;
    formData.value = { calendarDate: "", isOff: false, isVacation: false };
};

const handleSubmit = async (data: any) => {
    if (!data.calendarDate) {
        notify({ description: "تاریخ الزامی است.", status: "warning" });
        return;
    }
    isLoading.value = true;
    try {
        if (editingId.value) {
            await calendarService.updateCalendar({ id: editingId.value, ...data });
            notify({ description: "تقویم با موفقیت ویرایش شد.", status: "success" });
        } else {
            await calendarService.addCalendar(data);
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
    formData.value = {
        calendarDate: data.calendarDate || "",
        isOff: !!data.isOff,
        isVacation: !!data.isVacation,
    };
};

defineExpose({ openForEdit });
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