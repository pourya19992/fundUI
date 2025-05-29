<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <TableHeader
        :headers="headers"
        :searchValues="searchValues"
        :onSearchChange="onSearchChange"
      />
      <tbody class="bg-white divide-y divide-gray-200">
        <slot />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import TableHeader from './TableHeader.vue';

const props = defineProps<{
  headers: string[];
  searchValues: { [key: string]: string };
  onSearchChange: (key: string, value: string) => void;
}>();
</script>