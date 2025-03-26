<template>
  <header class="bg-white shadow-md sticky top-0 z-40">
    <div class="container mx-auto flex justify-between items-center py-4 px-6">
      <!-- Right side - Hamburger and Navigation -->
      <div class="flex items-center gap-8">
        <button 
          v-if="!isSpecialPage"
          @click="toggleSidebar" 
          class="p-2 hover:bg-gray-100 rounded-lg flex items-center justify-center"
          aria-label="Toggle Sidebar"
        >
          <Icon name="mdi:menu" class="w-6 h-6 text-gray-600"/>
        </button>

        <nav>
          <ul class="flex gap-8">
            <li><NuxtLink to="/" class="text-gray-600 hover:text-blue-600 px-2">صفحه اصلی</NuxtLink></li>
            <li><NuxtLink to="/support" class="text-gray-600 hover:text-blue-600 px-2">پشتیبانی</NuxtLink></li>
            <li><NuxtLink to="/about" class="text-gray-600 hover:text-blue-600 px-2">درباره شرکت</NuxtLink></li>
          </ul>
        </nav>
      </div>

      <!-- Left side - Logo -->
      <h1 class="text-xl font-bold text-blue-600">صندوق سرمایه گذاری</h1>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '~/stores/app';

const route = useRoute();
const appStore = useAppStore();

const isSpecialPage = computed(() => {
  // Add any special pages where Hamburger should be hidden
  const specialPages = ['/', '/auth/login'];
  return specialPages.includes(route.path);
});

const toggleSidebar = () => {
  appStore.toggleSidebar();
};
</script>

<style scoped>
nav a {
  transition: color 0.3s;
}

.router-link-active {
  color: #7d8eb3; /* blue-600 */
  font-weight: 600;
}

@media (max-width: 768px) {
  nav ul {
    display: none;
  }
}
</style>