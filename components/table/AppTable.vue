<template>
  <div class="max-w-full md:max-w-[80%] mx-auto overflow-x-auto">
    <table class="w-full text-xs md:text-md">
      <TableHeader
          :headers="headers"
          :searchValues="searchValues"
          :onSearchChange="onSearchChange"
      />
      <tbody>
      <slot />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import TableHeader from "~/components/table/TableHeader.vue";

interface AppTableProps {
  headers: string[];
  searchValues: { [key: string]: string };
  onSearchChange: (key: string, value: string) => void;
}

const props = defineProps<AppTableProps>();
</script>