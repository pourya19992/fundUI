<template>
<div>
    <button v-if="!isEditMode" @click="onOpen" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
    صندوق جدید
    </button>

    <Modal :is-open="isOpen" @close="onClose">
    <template #body>
        <div>
        <h3 class="text-center text-lg font-semibold mb-4">{{ isEditMode ? 'ویرایش صندوق' : 'صندوق جدید' }}</h3>
        <div class="space-y-4">
            <div>
            <label class="block text-sm">نام صندوق</label>
            <input
                v-model="form.name"
                type="text"
                class="input-field"
                required
            />
            </div>
            <div>
            <label class="block text-sm">نوع صندوق</label>
            <select v-model="form.isETF" class="input-field">
                <option :value="true">ETF</option>
                <option :value="false">غیر ETF</option>
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
import { ref, reactive, defineExpose } from "vue";
import Modal from "@/components/Modal.vue";
import { useNotify } from "@/helpers/hooks/useNotify";
import { createFundService } from '@/services/administration/fundService';
import { BASE_URL } from '@/utils/constants';

const emit = defineEmits(['submit']);
const notify = useNotify();
const fundService = createFundService(BASE_URL);

const isOpen = ref(false);
const isLoading = ref(false);
const isEditMode = ref(false);

const form = reactive({
id: null as number | null,
name: "",
isETF: true,
});

const onOpen = () => {
isEditMode.value = false;
isOpen.value = true;
resetForm();
};

const openForEdit = (data: { id: number; name: string; isETF: boolean }) => {
isEditMode.value = true;
isOpen.value = true;
Object.assign(form, data);
};

const onClose = () => {
isOpen.value = false;
isEditMode.value = false;
resetForm();
};

const resetForm = () => {
form.id = null;
form.name = "";
form.isETF = true;
};

const handleSubmit = async () => {
if (!form.name) {
    notify({ description: "نام صندوق الزامی است", status: "warning" });
    return;
}
isLoading.value = true;
try {
    if (form.id) {
    await fundService.updateFund(form as any);
    notify({ description: "صندوق با موفقیت ویرایش شد", status: "success" });
    } else {
    await fundService.addFund(form as any);
    notify({ description: "صندوق با موفقیت اضافه شد", status: "success" });
    }
    emit('submit'); // Notify parent to refetch data
    onClose();
} catch (error: any) {
    notify({ description: `خطا: ${error.message}`, status: "error" });
} finally {
    isLoading.value = false;
}
};

defineExpose({ onOpen, openForEdit });
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