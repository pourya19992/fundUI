<template>
  <div class="layout-container" dir="rtl">
    <!-- Header -->
    <Header />

    <!-- Main Content -->
    <div class="main-wrapper">
      <!-- Main Content -->
      <div :class="['content transition-all duration-300', { 'mr-64': !isSpecialPage && isSidebarOpen }]">
        <main class="h-full">
          <slot />
        </main>
      </div>

      <!-- Sidebar -->
      <Sidebar />
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '~/stores/app';
import Sidebar from '~/components/form/Sidebar.vue';
import Header from '~/components/form/Header.vue';
import Footer from '~/components/form/Footer.vue';

const route = useRoute();
const appStore = useAppStore();

const isSpecialPage = computed(() => {
  const specialPages = ['/', '/auth/login'];
  return specialPages.includes(route.path);
});

const isSidebarOpen = computed(() => appStore.sidebarOpen);
</script>

<style scoped>
/* Layout container */
.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
}

/* Main wrapper for content */
.main-wrapper {
  flex: 1;
  display: flex;
  position: relative;
}

/* Main content area */
.content {
  flex-grow: 1;
  padding: 20px;
  background-color: white;
  min-height: calc(100vh - 128px); /* Adjust based on header + footer height */
  width: 100%;
}

@media (max-width: 768px) {
  .content.mr-64 {
    margin-right: 0;
  }
}
</style>
