<template>
<div
    v-if="isOpen"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
    @click="handleBackdropClick"
  >
    <div
      :class="[
    'bg-white rounded-lg p-6 relative mx-4',
    size === 'full'
      ? 'w-full max-w-none'
      : size === 'xl'
        ? 'w-full max-w-5xl'
        : size === 'lg'
          ? 'w-full max-w-lg'
          : size === 'md'
            ? 'w-full max-w-md'
            : size === 'sm'
              ? 'w-full max-w-sm'
              : 'w-full max-w-md'
      ]"
      @click.stop
    >
      <div class="mb-4">
        <slot name="body"></slot>
      </div>

      <div class="mt-6 border-t pt-4">
        <slot name="footer"></slot>
      </div>
    </div>
</div>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean,
  size: {
    type: String,
    default: 'md'
  }
});

const emit = defineEmits(["close"]);

const handleBackdropClick = () => {
  emit("close");
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>