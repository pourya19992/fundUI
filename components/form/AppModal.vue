<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50">
      <!-- پس‌زمینه مودال -->
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="onClose"></div>

      <!-- محتوای مودال -->
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 z-50">
        <header v-if="title" class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-blue-600">{{ title }}</h2>
        </header>

        <div class="p-6">
          <p class="text-gray-700">{{ text }}</p>
        </div>

        <footer class="px-6 py-4 flex justify-center space-x-4 border-t border-gray-200">
          <button
              @click="acceptAction"
              :disabled="isAcceptLoading"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <span v-if="isAcceptLoading" class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
            <span v-else>{{ acceptText }}</span>
          </button>
          <button
              @click="closeAction"
              :disabled="isCloseLoading"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
          >
            <span v-if="isCloseLoading" class="animate-spin inline-block w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full"></span>
            <span v-else>{{ closeText }}</span>
          </button>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  isOpen: Boolean,
  onClose: Function,
  acceptAction: Function,
  closeAction: Function,
  text: String,
  title: String,
  acceptText: String,
  closeText: String,
  isAcceptLoading: Boolean,
  isCloseLoading: Boolean
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
