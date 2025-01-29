<template>
  <thead class="bg-[#404b73]">
  <tr>
    <th
        v-for="(header, index) in headers"
        :key="index"
        class="text-white text-xs md:text-sm p-1 md:p-3 whitespace-nowrap text-center"
        :style="{ width: header !== 'عملیات' ? `${100 / headers.length}%` : 'auto', maxWidth: '300px' }"
    >
      <div class="flex flex-col items-center">
        <span>{{ header }}</span>
        <input
            v-if="header !== 'عملیات'"
            type="text"
            :placeholder="`جستجو در ${header}`"
            :value="searchValues[header] || ''"
            @input="(e) => onSearchChange(header, (e.target as HTMLInputElement).value)"
            class="text-[#b3b3b3] placeholder-[#b3b3b3] p-1 mt-2 text-xs md:text-sm w-full max-w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </th>
  </tr>
  </thead>
</template>

<script setup lang="ts">
interface TableHeaderProps {
  headers: string[];
  searchValues: { [key: string]: string };
  onSearchChange: (key: string, value: string) => void;
}

const props = defineProps<TableHeaderProps>();
</script>