<template>
  <div>
    <button v-if="!isEditMode" @click="openModalForAdd" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
      حساب تفصیلی جدید
    </button>

    <BaseFormModal
      v-model:modelValue="isModalOpen"
      :title="isEditMode ? 'ویرایش حساب تفصیلی' : 'حساب تفصیلی جدید'"
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
            <label class="block text-sm">کد حساب تفصیلی</label>
            <input v-model="form.code" type="text" class="input-field" required />
          </div>
          <div>
            <label class="block text-sm">نام حساب تفصیلی</label>
            <input v-model="form.name" type="text" class="input-field" required />
          </div>
          <div>
            <label class="block text-sm">نوع حساب تفصیلی</label>
            <select v-model="form.detailLedgerType.id" class="input-field">
              <option disabled value="">نوع حساب را انتخاب کنید</option>
              <option v-for="type in detailLedgerTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
            </select>
          </div>
          <div class="flex items-center">
            <input
              id="isActive"
              type="checkbox"
              v-model="form.isActive"
              class="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label for="isActive" class="ml-2 block text-sm text-gray-900">وضعیت</label>
          </div>
        </div>
      </template>
    </BaseFormModal>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { createDetailLedgerService } from "~/services/accounting/detailLedgerService";
import BaseFormModal from "~/components/base/BaseFormModal.vue";
import { useNotify } from "~/helpers/hooks/useNotify";

const props = defineProps({
  refetch: {
    type: Function,
    required: true
  }
});

const detailLedgerService = createDetailLedgerService(BASE_URL);

const isModalOpen = ref(false);
const isSubmitting = ref(false);
const isEditMode = ref(false);
const detailLedgerTypes = ref([]);

const form = reactive({
  id: null,
  code: "",
  name: "",
  detailLedgerType: { id: 0, name: "" },
  isActive: true
});

const notify = useNotify();

const loadDetailLedgerTypes = async () => {
  try {
    const response = await detailLedgerService.getDetailLedgerTypeList();
    detailLedgerTypes.value = Array.isArray(response) ? response : [];
  } catch (error) {
    notify({ description: 'خطا در بارگذاری انواع حساب تفصیلی', status: 'error' });
  }
};

const openModalForAdd = async () => {
  isEditMode.value = false;
  isModalOpen.value = true;
  // Reset form to initial state
  Object.assign(form, {
    id: null,
    code: "",
    name: "",
    detailLedgerType: { id: 0, name: "" },
    isActive: true
  });
  await loadDetailLedgerTypes();
};

const openForEdit = async (detailLedgerData) => {
  console.log('Opening for edit with data:', detailLedgerData);
  isEditMode.value = true;
  isModalOpen.value = true;
  await loadDetailLedgerTypes();
  // Fill form with detailLedger data
  Object.assign(form, {
    id: detailLedgerData.id,
    code: detailLedgerData.code || '',
    name: detailLedgerData.name || '',
    detailLedgerType: detailLedgerData.detailLedgerType || { id: 0, name: '' },
    isActive: detailLedgerData.isActive
  });
};

const closeModal = () => {
  isModalOpen.value = false;
  isEditMode.value = false;
  // Reset form to initial state
  Object.assign(form, {
    id: null,
    code: "",
    name: "",
    detailLedgerType: { id: 0, name: "" },
    isActive: true
  });
};

const handleSubmit = async () => {
  if (!form.code || !form.name || !form.detailLedgerType.id) {
    notify({ description: "کد، نام و نوع حساب تفصیلی الزامی است.", status: "warning" });
    return;
  }

  isSubmitting.value = true;
  try {
    // Convert form data to DetailLedgerDto format
    const detailLedgerData = {
      id: form.id ? parseInt(form.id) : undefined,
      name: form.name,
      code: form.code,
      detailLedgerTypeId: parseInt(form.detailLedgerType.id),
      isActive: form.isActive
    };

    let response;
    if (isEditMode.value) {
      response = await detailLedgerService.updateDetailLedger(detailLedgerData);
    } else {
      response = await detailLedgerService.addDetailLedger(detailLedgerData);
    }

    notify({ description: response.message, status: "success" });
    props.refetch();
    closeModal();
  } catch (error) {
    notify({ description: `خطا: ${error.message}`, status: "error" });
  } finally {
    isSubmitting.value = false;
  }
};

// Expose the openForEdit method
defineExpose({
  openForEdit,
  openModalForAdd
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