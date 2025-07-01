<template>
  <div>
    <button v-if="!isEditMode" @click="onOpen" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
      مجوز جدید
    </button>

    <Modal :is-open="isOpen" @close="onClose">
      <template #body>
        <div>
          <h3 class="text-center text-lg font-semibold mb-4">{{ isEditMode ? 'ویرایش مجوز' : 'مجوز جدید' }}</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm">آدرس مجوز</label>
              <input
                  v-model="form.url"
                  type="text"
                  class="input-field"
              />
            </div>
            <div>
              <label class="block text-sm">نام مجوز</label>
              <input
                  v-model="form.name"
                  type="text"
                  class="input-field"
              />
            </div>

            <!-- Add Is Sensitive field -->
            <div class="flex items-center">
              <input
                  id="isSensitive"
                  type="checkbox"
                  v-model="form.isSensitive"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label for="isSensitive" class="ml-2 block text-sm text-gray-900">حساس</label>
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
import { ref, reactive, defineExpose, watch } from "vue";
import Modal from "@/components/Modal.vue";
import { useNotify } from "@/helpers/hooks/useNotify";
import { createPermissionService } from '@/services/baseInformation/permissionService';
import { useRuntimeConfig } from "nuxt/app";

const emit = defineEmits(['submit']);
const notify = useNotify();
const config = useRuntimeConfig();
const permissionService = createPermissionService(config.public.apiBase);

const isOpen = ref(false);
const isLoading = ref(false);
const isEditMode = ref(false);

const form = reactive({
  id: null as number | null,
  name: "",
  url: "",
  isSensitive: false,
});

const onOpen = () => {
  isEditMode.value = false;
  isOpen.value = true;
  resetForm();
};

const openForEdit = (data: { id: number; name: string; url: string }) => {
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
  form.url = "";
  form.isSensitive = false;
};

const handleSubmit = async () => {
  if (!form.name || !form.url) {
    notify({ description: "تمام فیلدها باید پر شوند.", status: "warning" });
    return;
  }
  isLoading.value = true;
  try {
    if (form.id) {
      await permissionService.updatePermission(form as any);
      notify({ description: "مجوز با موفقیت ویرایش شد.", status: "success" });
    } else {
      await permissionService.addPermission(form as any);
      notify({ description: "مجوز با موفقیت اضافه شد.", status: "success" });
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
