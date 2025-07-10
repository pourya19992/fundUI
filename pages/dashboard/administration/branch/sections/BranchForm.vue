<template>
  <div>
    <button v-if="!isEditMode" @click="onOpen" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
      شعبه جدید
    </button>

    <Modal :is-open="isOpen" @close="onClose">
      <template #body>
        <div>
          <h3 class="text-center text-lg font-semibold mb-4">{{ isEditMode ? 'ویرایش شعبه' : 'شعبه جدید' }}</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm">کد شعبه</label>
              <input v-model="formData.code" type="text" class="input-field" required />
            </div>
            <div>
              <label class="block text-sm">نام شعبه</label>
              <input v-model="formData.name" type="text" class="input-field" required />
            </div>
            <div>
              <label class="block text-sm">مدیر شعبه</label>
              <input v-model="formData.manager" type="text" class="input-field" />
            </div>
            <div>
              <label class="block text-sm">تلفن</label>
              <input v-model="formData.phone" type="text" class="input-field" />
            </div>
            <div>
              <label class="block text-sm">فکس</label>
              <input v-model="formData.fax" type="text" class="input-field" />
            </div>
            <div>
              <label class="block text-sm">تلفن همراه</label>
              <input v-model="formData.cellPhone" type="text" class="input-field" />
            </div>
            <div>
              <label class="block text-sm">کد پستی</label>
              <input v-model="formData.postalCode" type="text" class="input-field" />
            </div>
            <div>
              <label class="block text-sm">آدرس</label>
              <textarea v-model="formData.address" class="input-field" rows="3"></textarea>
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

<script setup>
import { ref, reactive } from "vue";
import { createBranchService } from "~/services/administration/branchService";
import Modal from "~/components/Modal.vue";
import { useNotify } from "~/helpers/hooks/useNotify";
import { useRuntimeConfig } from '#app';

const props = defineProps({
  refetch: {
    type: Function,
    required: true
  }
});

const config = useRuntimeConfig();
const branchService = createBranchService(BASE_URL);

const isOpen = ref(false);
const isLoading = ref(false);
const isEditMode = ref(false);

const formData = reactive({
  code: "",
  name: "",
  manager: "",
  phone: "",
  fax: "",
  cellPhone: "",
  postalCode: "",
  address: "",
  isActive: true,
  id: null
});

const notify = useNotify();

const onOpen = () => {
  isEditMode.value = false;
  isOpen.value = true;
};

const openForEdit = (branchData) => {
  console.log('Opening for edit with data:', branchData);
  isEditMode.value = true;
  // Reset form first
  resetForm();
  // Then fill with branch data
  Object.assign(formData, {
    id: branchData.id,
    code: branchData.code || '',
    name: branchData.name || '',
    manager: branchData.manager || '',
    phone: branchData.phone || '',
    fax: branchData.fax || '',
    cellPhone: branchData.cellPhone || '',
    postalCode: branchData.postalCode || '',
    address: branchData.address || '',
    isActive: branchData.isActive
  });
  isOpen.value = true;
};

const onClose = () => {
  isOpen.value = false;
  isEditMode.value = false;
  resetForm();
};

const resetForm = () => {
  Object.assign(formData, {
    code: "",
    name: "",
    manager: "",
    phone: "",
    fax: "",
    cellPhone: "",
    postalCode: "",
    address: "",
    isActive: true,
    id: null
  });
};

const handleSubmit = async () => {
  if (!formData.code || !formData.name) {
    notify({ description: "کد و نام شعبه الزامی است.", status: "warning" });
    return;
  }

  isLoading.value = true;
  try {
    const branchData = {
      ...formData,
      id: formData.id ? parseInt(formData.id) : undefined
    };

    let response;
    if (isEditMode.value) {
      response = await branchService.updateBranch(branchData);
    } else {
      response = await branchService.addBranch(branchData);
    }

    notify({ description: response.message, status: "success" });
    props.refetch();
    onClose();
  } catch (error) {
    notify({ description: `خطا: ${error.message}`, status: "error" });
  } finally {
    isLoading.value = false;
  }
};

// Expose the openForEdit method
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