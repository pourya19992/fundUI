<template>
  <Modal :is-open="isOpen" @close="onClose" :size="size">
    <template #body>
      <div class="p-6 bg-white rounded-lg shadow-xl max-h-[70vh] overflow-y-auto p-1">
        <h3 class="text-center text-lg font-semibold mb-4">{{ title }}</h3>
        <!-- Slot for form fields -->
        <slot name="form-fields"></slot>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-center gap-4">
        <button
          v-if="showSubmitButton"
          @click="handleSubmit"
          class="btn-primary w-24"
          :disabled="isLoading || isSubmitting"
        >
          {{ submitButtonText }}
        </button>
        <button
          v-if="showCancelButton"
          @click="handleCancel"
          class="btn-secondary w-24"
        >
          {{ cancelButtonText }}
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import Modal from "@/components/Modal.vue";

const props = defineProps<{
  modelValue: boolean;
  title: string;
  submitButtonText?: string;
  cancelButtonText?: string;
  isLoading?: boolean;
  isSubmitting?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showSubmitButton?: boolean;
  showCancelButton?: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'submit', 'cancel']);

const isOpen = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  isOpen.value = newValue;
});

const onClose = () => {
  isOpen.value = false;
  emit('update:modelValue', false);
  emit('cancel'); // Emit cancel event
};

const handleSubmit = () => {
  emit('submit'); // Emit submit event
};

const handleCancel = () => {
  onClose();
};

// Default values for button visibility
const showSubmitButton = props.showSubmitButton !== true;
const showCancelButton = props.showCancelButton !== true;

// Expose methods for parent to control modal
defineExpose({
  onClose,
});

</script>

<style scoped>
/* Basic styles, you might want to use global styles or Tailwind classes */
.btn-primary {
  @apply bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors;
}
</style>