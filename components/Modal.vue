<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
    <div class="bg-white rounded-lg p-6 relative w-full max-w-md">
      <button
          class="absolute top-4 right-4 text-gray-500"
          @click="close"
      >
        ×
      </button>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};
</script>