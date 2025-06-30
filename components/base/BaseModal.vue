<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="$emit('close')"></div>
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-4 border-b">
          <slot name="header"></slot>
        </div>
        <div class="p-4">
          <slot name="body"></slot>
        </div>
        <div class="p-4 border-t">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  isCentered?: boolean;
  scrollBehavior?: 'inside' | 'outside';
}>();

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
}>();
</script>