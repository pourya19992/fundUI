<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Notification ref="notificationRef" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { setNotificationComponent } from './helpers/hooks/useNotify';
import Notification from './components/Notification.vue';

const notificationRef = ref(null);

onMounted(() => {
  setNotificationComponent(notificationRef.value);
});
</script>