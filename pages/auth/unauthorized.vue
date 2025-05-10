<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100" dir="rtl">
    <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
      <div class="mb-6">
        <Icon name="mdi:alert-circle" class="text-red-500 text-6xl mx-auto" />
      </div>
      <h1 class="text-2xl font-bold text-red-500 mb-4">خطای دسترسی</h1>
      <p class="text-gray-600 mb-4">{{ message }}</p>
      <p class="text-gray-500 text-sm">
        تا {{ countdown }} ثانیه دیگر به صفحه ورود منتقل خواهید شد
      </p>
      <div class="mt-6">
        <button
          @click="redirectToLogin"
          class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          ورود به سیستم
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { navigateTo } from 'nuxt/app';

const route = useRoute();
const countdown = ref(5);
let timer: NodeJS.Timeout;

const message = ref('شما دسترسی لازم برای مشاهده این صفحه را ندارید');

const redirectToLogin = () => {
  const redirectPath = localStorage.getItem('redirectPath');
  localStorage.removeItem('redirectPath');
  navigateTo('/auth/login');
};

onMounted(() => {
  if (route.query.message) {
    message.value = route.query.message as string;
  }

  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
      redirectToLogin();
    }
  }, 1000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});

definePageMeta({
  layout: 'default'
});
</script> 