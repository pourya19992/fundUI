<template>
  <header class="bg-white shadow-md sticky top-0 z-40 relative">
    <div class="absolute right-0 top-0 flex items-center gap-4 h-full px-4">
      <BurgerMenuIcon
        v-if="!isSpecialPage"
        @click="toggleSidebar"
        class="cursor-pointer"
      />

      <button
        v-if="!isSpecialPage && showBackButton"
        @click="goBack"
        class="p-2 bg-gray-100 hover:bg-blue-200 rounded-lg flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors duration-300"
        aria-label="Go Back"
      >
        <BackIcon class="w-6 h-6"/>
      </button>

      <!-- Desktop Menu -->
      <nav class="hidden md:block">
        <ul class="flex gap-8">
          <li>
            <button
              @click="goToHome"
              class="p-2 bg-gray-100 hover:bg-blue-200 rounded-lg flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors duration-300"
            >
              <HomeIcon class="h-6 w-6" />
            </button>
          </li>
          <li>
            <button
              @click="handleLogout"
              class="p-2 bg-gray-100 hover:bg-blue-200 rounded-lg flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors duration-300"
            >
              <ExitIcon class="h-6 w-6" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
    <div class="container mx-auto flex justify-between items-center py-4 px-6">
      <div class="flex-1 flex justify-end">
        <h1 class="text-xl font-bold text-blue-600">صندوق سرمایه گذاری</h1>
      </div>
    </div>
    <!-- Mini Sidebar (Always, when sidebar is closed) -->
    <transition name="fade">
      <div
        v-if="!isSpecialPage && !appStore.sidebarOpen"
        class="fixed top-16 right-0 h-[calc(100vh-4rem)] w-16 bg-white border-l flex flex-col items-center justify-start py-4 gap-6 shadow-lg z-40"
        style="transition: width 0.3s;"
        @click="toggleSidebar"
        @mouseenter="appStore.sidebarOpen = true"
        @mouseleave="appStore.sidebarOpen = false"
      >
        <button @click.stop="() => router.push('/dashboard')" class="btn-menu" aria-label="داشبورد">
          <ReportIcon class="h-6 w-6" />
        </button>
        <button @click.stop="() => router.push('/dashboard/profile')" class="btn-menu" aria-label="پروفایل">
          <ProfileIcon class="h-6 w-6 text-gray-600" />
        </button>
        <button @click.stop="() => router.push('/dashboard/settings')" class="btn-menu" aria-label="تنظیمات">
          <GearIcon class="h-6 w-6 text-gray-600" />
        </button>
        <button @click.stop="() => router.push('/dashboard/administration/branch')" class="btn-menu" aria-label="شعب">
          <SheetIcon class="h-6 w-6 text-gray-600" />
        </button>
        <button @click.stop="() => router.push('/dashboard/administration/calendar')" class="btn-menu" aria-label="تقویم">
          <SheetIcon class="h-6 w-6 text-gray-600" />
        </button>
      </div>
    </transition>
  </header>
  <!-- Floating Support Button and Chat -->
  <div>
    <button
      v-if="!isChatOpen"
      @click="isChatOpen = true"
      class="fixed bottom-6 left-6 p-4 bg-gray-100 text-white rounded-lg shadow-lg hover:bg-blue-200 transition-colors duration-300 z-50"
      aria-label="پشتیبانی"
    >
      <Supporter class="h-6 w-6" />
    </button>

    <transition name="slide-left">
      <div
        v-if="isChatOpen"
        class="fixed bottom-6 left-6 w-96 h-[500px] bg-white rounded-lg shadow-xl z-50 flex flex-col"
      >
        <div class="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h3 class="text-lg font-semibold">پشتیبانی</h3>
          <button @click="isChatOpen = false" class="text-white hover:text-gray-200">
            <span class="text-2xl">&times;</span>
          </button>
        </div>
        <div class="flex-1 p-4 overflow-y-auto">
          <div v-for="(message, index) in messages" :key="index"
              :class="['mb-4', message.isUser ? 'text-left' : 'text-right']">
            <div :class="[
              'inline-block p-3 rounded-lg max-w-[80%]',
              message.isUser ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'
            ]">
              {{ message.text }}
            </div>
          </div>
        </div>
        <div class="p-4 border-t">
          <div class="flex gap-2">
            <input
              v-model="newMessage"
              @keyup.enter="sendMessage"
              type="text"
              placeholder="پیام خود را بنویسید..."
              class="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              @click="sendMessage"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              ارسال
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '../../stores/app';
import HomeIcon from '../../components/icons/HomeIcon.vue';
import BurgerMenuIcon from '../../components/icons/BurgerMenuIcon.vue';
import ExitIcon from '../../components/icons/ExitIcon.vue';
import BackIcon from '../../components/icons/BackIcon.vue';
import Supporter from '../../components/icons/SupporterIcon.vue';
import GearIcon from '../../components/icons/GearIcon.vue';
import SheetIcon from '../../components/icons/SheetIcon.vue';
import { createAuthService } from '../../services/auth/authService';
import ReportIcon from '../icons/ReportIcon.vue';
import ProfileIcon from '../icons/ProfileIcon.vue';


const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const authService = createAuthService();

const isSpecialPage = computed(() => {
  const specialPages = ['/', '/auth/login'];
  return specialPages.includes(route.path);
});

const showBackButton = computed(() => {
  return !isSpecialPage.value && route.path !== '/dashboard';
});

const toggleSidebar = () => {
  appStore.toggleSidebar();
};

const goBack = () => {
  router.back();
};

const goToHome = () => {
  router.push('/');
};

const handleLogout = async () => {
  try {
    await authService.logout();
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

// Support Chat logic
const isChatOpen = ref(false);
const newMessage = ref('');
const messages = ref([
  { text: 'سلام! چطور می‌توانم به شما کمک کنم؟', isUser: false },
]);

function sendMessage() {
  if (newMessage.value.trim()) {
    messages.value.push({ text: newMessage.value, isUser: true });
    newMessage.value = '';
    setTimeout(() => {
      messages.value.push({
        text: 'پیام شما دریافت شد. کارشناسان ما در اسرع وقت پاسخگو خواهند بود.',
        isUser: false
      });
    }, 1000);
  }
}
</script>

<style scoped>
nav a {
  transition: color 0.3s;
}

.router-link-active {
  color: #7d8eb3;
  font-weight: 600;
}

@media (max-width: 768px) {
  nav ul {
    display: none;
  }
}

.slide-left-enter-active, .slide-left-leave-active {
  transition: all 0.3s;
}
.slide-left-enter-from, .slide-left-leave-to {
  transform: translateX(-120%);
  opacity: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  nav.md\:block {
    display: none !important;
  }
}

.btn-menu {
  @apply p-2 bg-gray-100 hover:bg-blue-200 rounded-lg flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors duration-300;
}
</style>