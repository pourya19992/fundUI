<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="show" class="fixed top-4 left-4 z-50">
      <div :class="[
        'rounded-md p-4 max-w-sm w-full shadow-lg',
        type === 'success' ? 'bg-green-50' : 'bg-red-50'
      ]">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <Icon
              :name="type === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'"
              :class="type === 'success' ? 'text-green-400' : 'text-red-400'"
              class="h-5 w-5"
            />
          </div>
          <div class="mr-3">
            <p :class="[
              'text-sm font-medium',
              type === 'success' ? 'text-green-800' : 'text-red-800'
            ]">
              {{ message }}
            </p>
          </div>
          <div class="mr-auto pl-3">
            <button
              @click="$emit('close')"
              class="inline-flex rounded-md p-1.5"
              :class="[
                type === 'success' ? 'text-green-500 hover:bg-green-100' : 'text-red-500 hover:bg-red-100'
              ]"
            >
              <Icon name="mdi:close" class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success',
    validator: (value: string) => ['success', 'error'].includes(value)
  }
});

defineEmits(['close']);
</script> 