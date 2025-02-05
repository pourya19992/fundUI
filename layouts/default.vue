<template>
  <div class="layout-container">
    <!-- Sidebar -->
    <Sidebar class="sidebar" />

    <!-- Main Content -->
    <div class="content">
      <Header />
      <main>
        <NuxtPage />
      </main>
      <Footer />
    </div>
  </div>
</template>

<script setup>
import Sidebar from '~/components/form/Sidebar.vue';
import Header from '~/components/form/Header.vue';
import Footer from '~/components/form/Footer.vue';
</script>

<style scoped>
/* Layout container to hold sidebar and content */
.layout-container {
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb; /* Background color for the page */
}

/* Sidebar styling */
.sidebar {
  width: 250px; /* Adjust based on your sidebar width */
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: #f9fafb;
  color: blue;
  padding: 20px;
  z-index: 10;
}

/* Main content area */
.content {
  flex-grow: 1;
  margin-left: 250px; /* Same as sidebar width */
  padding: 20px;
  background-color: white;
}

/* Optional: Make header sticky on top */
header {
  position: sticky;
  top: 0;
  z-index: 20;
}

/* Optional: Make footer stick to the bottom of the page */
footer {
  position: sticky;
  bottom: 0;
  width: 100%;
  background-color: #2d3748;
  color: white;
  padding: 10px;
}
</style>
