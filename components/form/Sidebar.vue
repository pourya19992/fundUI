<template>
  <div v-if="!isSpecialPage" dir="rtl" class="h-full">
    <div v-show="isOpen"
        class="fixed top-16 right-0 h-[calc(100vh-4rem)] w-64 bg-white border-l"
        @mouseenter="appStore.sidebarOpen = true"
        @mouseleave="appStore.sidebarOpen = false"
    >
      <nav class="p-5 text-right">
        <NuxtLink to="/dashboard" class="block py-3 px-4 rounded-lg hover:bg-gray-100">داشبورد</NuxtLink>
        <NuxtLink to="/dashboard/profile" class="block py-3 px-4 rounded-lg hover:bg-gray-100">پروفایل</NuxtLink>
        <NuxtLink to="/dashboard/settings" class="block py-3 px-4 rounded-lg hover:bg-gray-100">تنظیمات</NuxtLink>
        <NuxtLink to="/dashboard/administration/branch" class="block py-3 px-4 rounded-lg hover:bg-gray-100">شعب</NuxtLink>
        <NuxtLink to="/dashboard/administration/calendar" class="block py-3 px-4 rounded-lg hover:bg-gray-100">تقویم</NuxtLink>
        <NuxtLink to="/dashboard/baseInformation/permissions" class="block py-3 px-4 rounded-lg hover:bg-gray-100">مجوزها</NuxtLink>
        <NuxtLink to="/dashboard/baseInformation/role" class="block py-3 px-4 rounded-lg hover:bg-gray-100">نقش‌ها</NuxtLink>
        <NuxtLink to="/dashboard/baseInformation/users" class="block py-3 px-4 rounded-lg hover:bg-gray-100">کاربران</NuxtLink>
        <NuxtLink to="/dashboard/baseInformation/userGroup" class="block py-3 px-4 rounded-lg hover:bg-gray-100">گروه‌های کاربری</NuxtLink>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '~/stores/app';

const route = useRoute();
const appStore = useAppStore();

const isSpecialPage = computed(() => {
  const specialPages = ['/', '/auth/login'];
  return specialPages.includes(route.path);
});

const isOpen = computed(() => appStore.sidebarOpen);
</script>

<style scoped>
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
  }
}
</style>