<template>
  <div>
    <button @click="onOpen" class="bg-primary text-white px-4 py-2 rounded">
      مجوز جدید
    </button>

    <Modal :is-open="isOpen" @close="onClose">
      <template #body>
        <PermissionForm @submit="handleSubmit" />
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Modal from "@/components/Modal.vue";
import PermissionForm from "./PermissionForm.vue";

const props = defineProps({
  refetch: Function
});

const isOpen = ref(false);

const onOpen = () => {
  isOpen.value = true;
};

const onClose = () => {
  isOpen.value = false;
};

const handleSubmit = () => {
  props.refetch && props.refetch();
  onClose();
};

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
