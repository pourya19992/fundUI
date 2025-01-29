<!-- layouts/default.vue -->
<template>
  <div>
    <!-- Navbar -->
    <Navbar />

    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <main>
      <NuxtPage />
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '~/components/form/Navbar.vue';
import Sidebar from '~/components/form/Sidebar.vue';
import Footer from '~/components/form/Footer.vue';
</script>

<style scoped>
/* Optional: Add any global styles for layout */
</style>
