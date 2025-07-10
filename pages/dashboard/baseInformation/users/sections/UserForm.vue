<template>
  <div>
    <button @click="openModalForAdd" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
      کاربر جدید
    </button>

    <BaseFormModal
      v-model:modelValue="isModalOpen"
      :title="isEditMode ? 'ویرایش کاربر' : 'کاربر جدید'"
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
            <label class="block text-sm">نام کاربری</label>
            <input
              v-model="form.username"
              type="text"
              class="input-field"
            />
          </div>
          <div>
            <label class="block text-sm">رمز عبور</label>
            <input
              v-model="form.password"
              type="password"
              class="input-field"
            />
          </div>
          <div>
            <label class="block text-sm">نام</label>
            <input
              v-model="form.person.firstName"
              type="text"
              class="input-field"
            />
          </div>
          <div>
            <label class="block text-sm">نام خانوادگی</label>
            <input
              v-model="form.person.lastName"
              type="text"
              class="input-field"
            />
          </div>
          <div>
            <label class="block text-sm">تاریخ تولد</label>
            <input
              v-model="form.person.birthDate"
              type="date"
              class="input-field"
            />
          </div>
          <div>
            <label class="block text-sm">کد ملی</label>
            <input
              v-model="form.person.nationalCode"
              type="text"
              class="input-field"
            />
          </div>
          <div>
            <label class="block text-sm">ایمیل</label>
            <input
              v-model="form.person.email"
              type="email"
              class="input-field"
            />
          </div>
          <div>
            <label class="block text-sm">شماره موبایل</label>
            <input
              v-model="form.person.cellPhone"
              type="text"
              class="input-field"
            />
          </div>
          <div>
            <label class="block text-sm">وضعیت</label>
            <select v-model="form.isActive" class="input-field">
              <option :value="true">فعال</option>
              <option :value="false">غیرفعال</option>
            </select>
          </div>
        </div>
      </template>
    </BaseFormModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineExpose } from "vue";
import BaseFormModal from "@/components/base/BaseFormModal.vue";
import { useNotify } from "@/helpers/hooks/useNotify";
import { createUserService } from '@/services/auth/userService';
import { useRuntimeConfig } from "nuxt/app";
import type { User, UserDto } from "@/services/auth/userService";

const emit = defineEmits(['submit']);
const notify = useNotify();
const config = useRuntimeConfig();
const userService = createUserService(BASE_URL);

interface FormState extends Omit<UserDto, 'person'> {
  person: {
    id?: number;
    firstName: string;
    lastName: string;
    birthDate: string;
    nationalCode: string;
    email: string;
    cellPhone: string;
    isCompany: boolean;
  };
}

const defaultPerson = {
  firstName: '',
  lastName: '',
  birthDate: '',
  nationalCode: '',
  email: '',
  cellPhone: '',
  isCompany: false
};

const isModalOpen = ref(false);
const isEditMode = ref(false);
const form = ref<FormState>({
  username: '',
  password: '',
  isActive: true,
  person: { ...defaultPerson }
});
const isSubmitting = ref(false);

const openModalForAdd = () => {
  isEditMode.value = false;
  isModalOpen.value = true;
  form.value = {
    username: '',
    password: '',
    isActive: true,
    person: { ...defaultPerson }
  };
};

const openForEdit = (data: User) => {
  isEditMode.value = true;
  isModalOpen.value = true;
  form.value = {
    id: data.id,
    username: data.username,
    password: data.password,
    isActive: data.isActive,
    person: {
      id: data.person.id,
      firstName: data.person.firstName,
      lastName: data.person.lastName,
      birthDate: data.person.birthDate,
      nationalCode: data.person.nationalCode,
      email: data.person.email,
      cellPhone: data.person.cellPhone,
      isCompany: data.person.isCompany
    }
  };
};

const closeModal = () => {
  isModalOpen.value = false;
  form.value = {
    username: '',
    password: '',
    isActive: true,
    person: { ...defaultPerson }
  };
  isEditMode.value = false;
};

const handleSubmit = async () => {
  if (!form.value.username || !form.value.password || !form.value.person.firstName || !form.value.person.lastName || !form.value.person.birthDate) {
    notify({ description: "تمام فیلدهای الزامی باید پر شوند.", status: "warning" });
    return;
  }
  isSubmitting.value = true;
  try {
    if (isEditMode.value) {
      await userService.updateUser(form.value);
      notify({ description: "کاربر با موفقیت ویرایش شد.", status: "success" });
    } else {
      await userService.addUser(form.value);
      notify({ description: "کاربر با موفقیت اضافه شد.", status: "success" });
    }
    emit('submit');
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