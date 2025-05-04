<template>
  <Teleport to="body">
    <div
      v-if="notifications.length"
      class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2"
    >
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'min-w-[300px] p-4 rounded-lg shadow-lg transition-all duration-300 transform',
          getNotificationClass(notification.status)
        ]"
        role="alert"
      >
        <div class="flex items-center gap-2">
          <span 
            :class="[
              'text-sm font-medium',
              getTextClass(notification.status)
            ]"
          >
            {{ notification.description }}
          </span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Notification {
  id: number;
  description: string;
  status: 'success' | 'error' | 'warning' | 'info';
}

const notifications = ref<Notification[]>([]);
let notificationId = 0;

const getNotificationClass = (status: string) => {
  switch (status) {
    case 'success':
      return 'bg-green-100 border-l-4 border-green-500';
    case 'error':
      return 'bg-red-100 border-l-4 border-red-500';
    case 'warning':
      return 'bg-yellow-100 border-l-4 border-yellow-500';
    case 'info':
      return 'bg-blue-100 border-l-4 border-blue-500';
    default:
      return 'bg-gray-100 border-l-4 border-gray-500';
  }
};

const getTextClass = (status: string) => {
  switch (status) {
    case 'success':
      return 'text-green-700';
    case 'error':
      return 'text-red-700';
    case 'warning':
      return 'text-yellow-700';
    case 'info':
      return 'text-blue-700';
    default:
      return 'text-gray-700';
  }
};

const addNotification = (description: string, status: 'success' | 'error' | 'warning' | 'info') => {
  const id = notificationId++;
  notifications.value.push({ id, description, status });
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id !== id);
  }, 3000);
};

// Expose the addNotification method
defineExpose({ addNotification });
</script> 