<template>
  <div class="min-h-screen bg-gray-100" dir="rtl">
    <!-- Sidebar -->
    <aside class="fixed inset-y-0 right-0 w-64 bg-white shadow-lg">
      <div class="p-4">
        <h1 class="text-xl font-bold text-gray-800">صندوق سرمایه گذاری</h1>
      </div>
      <nav class="mt-4">
        <NuxtLink
          to="/dashboard"
          class="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
        >
          داشبورد
        </NuxtLink>
        <NuxtLink
          to="/dashboard/administration/branch"
          class="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
        >
          مدیریت شعب
        </NuxtLink>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="mr-64 p-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// Add any required logic here
</script>