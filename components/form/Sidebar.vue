<template>
  <div>
    <!-- دکمه Hamburger -->
    <button @click="toggleSidebar" class="fixed top-4 right-4 z-50 p-2 bg-gray-800 text-white rounded-lg">
      <Icon name="mdi-menu" class="w-6 h-6"/>
    </button>

    <!-- Sidebar -->
    <transition name="slide">
      <div v-if="isOpen"
           class="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-40 p-5 transition-transform">
        <!-- دکمه بستن -->
        <button @click="toggleSidebar" class="absolute top-4 left-4 text-gray-600">
          <Icon name="mdi-close" class="w-6 h-6"/>
        </button>

        <!-- لینک‌های داشبورد -->
        <nav class="mt-10">
          <NuxtLink to="/dashboard" class="block py-3 px-4 rounded-lg hover:bg-gray-200">داشبورد</NuxtLink>
          <NuxtLink to="/profile" class="block py-3 px-4 rounded-lg hover:bg-gray-200">پروفایل</NuxtLink>
          <NuxtLink to="/settings" class="block py-3 px-4 rounded-lg hover:bg-gray-200">تنظیمات</NuxtLink>
        </nav>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isOpen = ref(false);
const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
/* افکت انیمیشن باز شدن Sidebar */
.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease-in-out;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
}
</style>
