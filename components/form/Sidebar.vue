<template>
  <div>
    <!-- Navbar -->
    <nav class="bg-gray-800 text-white px-4 py-2 flex items-center">
      <!-- دکمه همبرگری -->
      <button
          class="text-white md:hidden"
          @click="toggleMobileSidebar"
          aria-label="Toggle Sidebar"
      >
        ☰
      </button>

      <!-- لینک صفحه اصلی -->
      <a href="/" class="ml-auto text-blue-400 hover:text-blue-500">
        <HomeIcon/>
      </a>

      <!-- آیکون‌ها -->
      <div class="flex items-center space-x-4 ml-6">
        <WalletIcon class="cursor-pointer hover:text-blue-400"/>
        <NotificationIcon class="cursor-pointer hover:text-blue-400"/>
        <ProfileSettingMenu/>
      </div>
    </nav>

    <!-- Sidebar Mobile -->
    <div
        v-if="isSidebarOpen"
        class="fixed top-0 right-0 w-64 h-full bg-gray-800 text-white z-50 transform transition-transform slide-enter-active slide-leave-active"
    >
      <div class="flex justify-end p-4">
        <button @click="toggleMobileSidebar" class="text-white">
          ✕
        </button>
      </div>
      <div class="flex flex-col p-4 space-y-4">
        <a href="/" class="text-blue-400 hover:text-blue-500">Home</a>
        <a href="/wallet" class="text-blue-400 hover:text-blue-500">Wallet</a>
        <a href="/notifications" class="text-blue-400 hover:text-blue-500">Notifications</a>
        <a href="/profile" class="text-blue-400 hover:text-blue-500">Profile</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import HomeIcon from "~/components/icons/HomeIcon.vue";
import WalletIcon from "~/components/icons/WalletIcon.vue";
import NotificationIcon from "~/components/icons/NotificationIcon.vue";


const isSidebarOpen = ref(false);

const toggleMobileSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<style scoped>
/* انتقال سمت چپ به راست برای Sidebar */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(100%);
}

.sidebar {
  transform: translateX(100%);
}
</style>
