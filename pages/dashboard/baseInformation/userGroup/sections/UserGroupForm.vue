<template>
    <div>
        <button @click="openModalForAdd" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            گروه کاربری جدید
        </button>

        <BaseFormModal
            v-model:modelValue="isModalOpen"
            :title="isEditMode ? 'ویرایش گروه کاربری' : 'افزودن گروه کاربری'"
            submit-button-text="ثبت"
            cancel-button-text="انصراف"
            :is-loading="isSubmitting"
            :is-submitting="isSubmitting"
            @submit="handleSubmit"
            @cancel="closeModal"
        >
            <template #form-fields>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm">نام گروه کاربری</label>
                        <input
                            v-model="form.name"
                            type="text"
                            class="input-field"
                        />
                    </div>
                </div>
            </template>
        </BaseFormModal>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, defineExpose, watch } from "vue";
import BaseFormModal from "@/components/base/BaseFormModal.vue";
import { useNotify } from "@/helpers/hooks/useNotify";
import { useRuntimeConfig } from "nuxt/app";
import type { UserGroup } from "@/services/baseInformation/userGroupService";
import { createUserGroupService } from "@/services/baseInformation/userGroupService";

const emit = defineEmits(['submit']);
const notify = useNotify();
const config = useRuntimeConfig();
const userGroupService = createUserGroupService(BASE_URL);

const isModalOpen = ref(false);
const isEditMode = ref(false);
const form = ref<UserGroup>({
name: ''
});
const isSubmitting = ref(false);

const openModalForAdd = () => {
isEditMode.value = false;
isModalOpen.value = true;
  form.value = { name: '' }; // Clear form for add
};

const openForEdit = (data: UserGroup) => {
isEditMode.value = true;
isModalOpen.value = true;
form.value = { ...data };
};

const closeModal = () => {
    isModalOpen.value = false;
    form.value = {
        name: ''
    };
    isEditMode.value = false; // Reset edit mode on close
};

const handleSubmit = async () => {
    if (!form.value.name) {
        notify({ description: 'نام گروه کاربری را وارد کنید', status: 'error' });
        return;
    }
    isSubmitting.value = true;
    try {
        if (isEditMode.value) {
            await userGroupService.updateUserGroup(form.value.id!, form.value);
            notify({ description: "گروه کاربری با موفقیت ویرایش شد.", status: "success" });
        } else {
            await userGroupService.addUserGroup(form.value);
            notify({ description: "گروه کاربری با موفقیت اضافه شد.", status: "success" });
        }
        emit('submit'); // Notify parent to refresh data
        closeModal();
    } catch (error: any) {
        notify({ description: `خطا: ${error.message}`, status: "error" });
    } finally {
        isSubmitting.value = false;
    }
};

defineExpose({ openForEdit, openModalForAdd });

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