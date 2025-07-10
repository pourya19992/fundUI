<template>
  <Modal :is-open="isOpen" @close="onClose" :size="size">
    <template #body>
      <div class="max-h-[70vh] overflow-y-auto p-1">
        <h3 class="text-center text-lg font-semibold mb-4">{{ title }}</h3>
        <!-- Slot for form fields -->
        <slot name="form-fields"></slot>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-center gap-4">
        <button
          @click="handleSubmit"
          class="btn-primary w-24"
          :disabled="isLoading || isSubmitting"
        >
          {{ submitButtonText }}
        </button>
        <button
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
import { ref, watch } from "vue";
import Modal from "@/components/Modal.vue";

const props = defineProps({
  modelValue: { // Use modelValue for v-model support
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "Modal Title",
  },
  submitButtonText: {
    type: String,
    default: "Save",
  },
  cancelButtonText: {
    type: String,
    default: "Cancel",
  },
  isLoading: { // Prop to indicate loading state from parent
    type: Boolean,
    default: false,
  },
  isSubmitting: { // Prop to indicate submitting state from parent
    type: Boolean,
    default: false,
  },

  size: {
    type: String,
    default: "lg"
  }
});

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