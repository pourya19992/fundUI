<template>
   <div 
    v-if="isOpen" 
    class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
    @click="handleBackdropClick"
  >
    <div 
      class="bg-white rounded-lg p-6 relative w-full max-w-md mx-4"
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
  isOpen: Boolean
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