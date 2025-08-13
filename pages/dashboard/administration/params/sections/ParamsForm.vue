<template>
  <div>
    <button v-if="!isEditMode" @click="openModalForAdd" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
      پارامتر جدید
    </button>

    <BaseFormModal
      v-model:modelValue="isModalOpen"
      :title="isEditMode ? 'ویرایش پارامتر' : 'پارامتر جدید'"
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
            <label class="block text-sm">نام پارامتر</label>
            <input v-model="form.name" type="text" class="input-field" required />
          </div>
          <div>
            <label class="block text-sm">کد پارامتر</label>
            <input v-model="form.code" type="text" class="input-field" required />
          </div>
          <div>
            <label class="block text-sm">مقدار</label>
            <input v-model="form.value" type="text" class="input-field" required />
          </div>
          <div>
            <label class="block text-sm">پرس و جو داده</label>
            <input v-model="form.dataQuery" type="text" class="input-field" />
          </div>
          <div>
            <label class="block text-sm">نوع پارامتر</label>
            <select v-model="form.paramsTypeId" class="input-field">
              <option disabled value="">نوع پارامتر را انتخاب کنید</option>
              <option v-for="type in paramsTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm">صندوق</label>
            <select v-model="form.fundId" class="input-field">
              <option disabled value="">صندوق را انتخاب کنید</option>
              <option v-for="fund in funds" :key="fund.id" :value="fund.id">{{ fund.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm">حساب تفصیلی</label>
            <select v-model="form.detailLedgerId" class="input-field">
              <option disabled value="">حساب تفصیلی را انتخاب کنید</option>
              <option v-for="ledger in detailLedgers" :key="ledger.id" :value="ledger.id">{{ ledger.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm">دفتر معین</label>
            <select v-model="form.subsidiaryLedgerId" class="input-field">
              <option disabled value="">دفتر معین را انتخاب کنید</option>
              <option v-for="ledger in subsidiaryLedgers" :key="ledger.id" :value="ledger.id">{{ ledger.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm">نوع مقدار پارامتر</label>
            <select v-model="form.paramsValueTypeId" class="input-field">
              <option disabled value="">نوع مقدار را انتخاب کنید</option>
              <option v-for="type in paramsValueTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
            </select>
          </div>
          <div class="flex items-center">
            <input
              id="isActive"
              type="checkbox"
              v-model="form.isActive"
              class="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label for="isActive" class="ml-2 block text-sm text-gray-900">فعال</label>
          </div>
          <div class="flex items-center">
            <input
              id="isEditable"
              type="checkbox"
              v-model="form.isEditable"
              class="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label for="isEditable" class="ml-2 block text-sm text-gray-900">قابل ویرایش</label>
          </div>
          <div class="flex items-center">
            <input
              id="isGlobal"
              type="checkbox"
              v-model="form.isGlobal"
              class="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label for="isGlobal" class="ml-2 block text-sm text-gray-900">سراسری</label>
          </div>
        </div>
      </template>
    </BaseFormModal>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { createParamService } from "~/services/administration/paramService";
import BaseFormModal from "~/components/base/BaseFormModal.vue";
import { useNotify } from "~/helpers/hooks/useNotify";

const props = defineProps({
  refetch: {
    type: Function,
    required: true
  }
});

const paramService = createParamService(BASE_URL);

const isModalOpen = ref(false);
const isSubmitting = ref(false);
const isEditMode = ref(false);
const paramsTypes = ref([]);
const funds = ref([]);
const detailLedgers = ref([]);
const subsidiaryLedgers = ref([]);
const paramsValueTypes = ref([]);

const form = reactive({
  id: null,
  name: "",
  code: "",
  value: "",
  dataQuery: "",
  isActive: true,
  isEditable: true,
  paramsTypeId: 0,
  fundId: 0,
  detailLedgerId: 0,
  subsidiaryLedgerId: 0,
  paramsValueTypeId: 0,
  isGlobal: false
});

const notify = useNotify();

const loadParamsTypes = async () => {
  try {
    // TODO: Implement getParamsTypes service method
    paramsTypes.value = [];
  } catch (error) {
    notify({ description: 'خطا در بارگذاری انواع پارامتر', status: 'error' });
  }
};

const loadFunds = async () => {
  try {
    // TODO: Implement getFunds service method
    funds.value = [];
  } catch (error) {
    notify({ description: 'خطا در بارگذاری صندوق‌ها', status: 'error' });
  }
};

const loadDetailLedgers = async () => {
  try {
    // TODO: Implement getDetailLedgers service method
    detailLedgers.value = [];
  } catch (error) {
    notify({ description: 'خطا در بارگذاری حساب‌های تفصیلی', status: 'error' });
  }
};

const loadSubsidiaryLedgers = async () => {
  try {
    // TODO: Implement getSubsidiaryLedgers service method
    subsidiaryLedgers.value = [];
  } catch (error) {
    notify({ description: 'خطا در بارگذاری دفاتر معین', status: 'error' });
  }
};

const loadParamsValueTypes = async () => {
  try {
    // TODO: Implement getParamsValueTypes service method
    paramsValueTypes.value = [];
  } catch (error) {
    notify({ description: 'خطا در بارگذاری انواع مقدار پارامتر', status: 'error' });
  }
};

const openModalForAdd = async () => {
  isEditMode.value = false;
  isModalOpen.value = true;
  // Reset form to initial state
  Object.assign(form, {
    id: null,
    name: "",
    code: "",
    value: "",
    dataQuery: "",
    isActive: true,
    isEditable: true,
    paramsTypeId: 0,
    fundId: 0,
    detailLedgerId: 0,
    subsidiaryLedgerId: 0,
    paramsValueTypeId: 0,
    isGlobal: false
  });
  await Promise.all([
    loadParamsTypes(),
    loadFunds(),
    loadDetailLedgers(),
    loadSubsidiaryLedgers(),
    loadParamsValueTypes()
  ]);
};

const openForEdit = async (paramData) => {
  console.log('Opening for edit with data:', paramData);
  isEditMode.value = true;
  isModalOpen.value = true;
  await Promise.all([
    loadParamsTypes(),
    loadFunds(),
    loadDetailLedgers(),
    loadSubsidiaryLedgers(),
    loadParamsValueTypes()
  ]);
  // Fill form with param data
  Object.assign(form, {
    id: paramData.id,
    name: paramData.name || '',
    code: paramData.code || '',
    value: paramData.value || '',
    dataQuery: paramData.dataQuery || '',
    isActive: paramData.isActive,
    isEditable: paramData.isEditable,
    paramsTypeId: paramData.paramsType?.id || 0,
    fundId: paramData.fund?.id || 0,
    detailLedgerId: paramData.detailLedger?.id || 0,
    subsidiaryLedgerId: paramData.subsidiaryLedger?.id || 0,
    paramsValueTypeId: paramData.paramsValueType?.id || 0,
    isGlobal: paramData.isGlobal
  });
};

const closeModal = () => {
  isModalOpen.value = false;
  isEditMode.value = false;
  // Reset form to initial state
  Object.assign(form, {
    id: null,
    name: "",
    code: "",
    value: "",
    dataQuery: "",
    isActive: true,
    isEditable: true,
    paramsTypeId: 0,
    fundId: 0,
    detailLedgerId: 0,
    subsidiaryLedgerId: 0,
    paramsValueTypeId: 0,
    isGlobal: false
  });
};

const handleSubmit = async () => {
  if (!form.name || !form.code || !form.value) {
    notify({ description: "نام، کد و مقدار پارامتر الزامی است.", status: "warning" });
    return;
  }

  isSubmitting.value = true;
  try {
    // Convert form data to ParamsDto format
    const paramData = {
      id: form.id ? parseInt(form.id) : undefined,
      name: form.name,
      code: form.code,
      value: form.value,
      dataQuery: form.dataQuery,
      isActive: form.isActive,
      isEditable: form.isEditable,
      paramsTypeId: parseInt(form.paramsTypeId),
      fundId: parseInt(form.fundId),
      detailLedgerId: parseInt(form.detailLedgerId),
      subsidiaryLedgerId: parseInt(form.subsidiaryLedgerId),
      paramsValueTypeId: parseInt(form.paramsValueTypeId),
      isGlobal: form.isGlobal
    };

    let response;
    if (isEditMode.value) {
      response = await paramService.editParam(paramData.fundId, paramData.code, paramData.value);
    } else {
      response = await paramService.addParams(paramData);
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
