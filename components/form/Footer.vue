<!-- layout/default.vue -->
<template>
  <div class="flex flex-col min-h-screen">
    <!-- محتوای اصلی صفحه -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- فوتر -->
    <footer class="bg-gray-800 text-white py-4">
      <div class="container mx-auto text-center">
        <p>&copy; 2025 My Investment Funds. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>

</script>

<style scoped>
footer {
  font-size: 0.875rem;
}

html, body {
  height: 100%;
  margin: 0;
}
</style>
