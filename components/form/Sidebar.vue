<template>
  <div v-if="!isSpecialPage" dir="rtl" class="h-full">
    <div v-show="isOpen"
        class="fixed top-16 right-0 h-[calc(100vh-4rem)] w-64 bg-white border-l"
        @mouseenter="appStore.sidebarOpen = true"
        @mouseleave="appStore.sidebarOpen = false"
    >
      <nav class="p-5 text-right">
        <div v-for="group in sidebarGroups" :key="group.key" class="mb-2">
          <div
            class="flex items-center justify-between py-2 px-4 cursor-pointer rounded-lg hover:bg-gray-100"
            @click="toggleGroup(group.key)"
          >
            <span>{{ group.title }}</span>
            <span>{{ openGroups[group.key] ? '▲' : '▼' }}</span>
          </div>
          <div v-show="openGroups[group.key]" class="pl-4">
            <NuxtLink
              v-for="item in group.items"
              :key="item.to"
              :to="item.to"
              class="block py-2 px-4 rounded-lg hover:bg-gray-100"
            >
              {{ item.label }}
            </NuxtLink>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '~/stores/app';

const route = useRoute();
const appStore = useAppStore();

const sidebarGroups = [
  {
    title: 'مدیریت',
    key: 'administration',
    items: [
      { label: 'شعب', to: '/dashboard/administration/branch' },
      { label: 'تقویم', to: '/dashboard/administration/calendar' },
      { label: 'صندوق', to: '/dashboard/administration/fund' },
    ],
  },
  {
    title: 'اطلاعات پایه',
    key: 'baseInformation',
    items: [
      { label: 'مجوزها', to: '/dashboard/baseInformation/permissions' },
      { label: 'نقش‌ها', to: '/dashboard/baseInformation/role' },
      { label: 'کاربران', to: '/dashboard/baseInformation/users' },
      { label: 'گروه‌های کاربری', to: '/dashboard/baseInformation/userGroup' },
      { label: 'سرمایه گذاران', to: '/dashboard/baseInformation/customers'},
    ],
  },
  {
    title: 'عمومی',
    key: 'general',
    items: [
      { label: 'داشبورد', to: '/dashboard' },
      { label: 'پروفایل', to: '/dashboard/profile' },
      { label: 'تنظیمات', to: '/dashboard/settings' },
    ],
  },
];

const openGroups = ref({});

const toggleGroup = (key) => {
  openGroups.value[key] = !openGroups.value[key];
};

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