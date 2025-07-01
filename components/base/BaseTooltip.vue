<template>
<div class="relative group">
    <slot></slot>
    <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
    {{ label }}
    </div>
</div>
</template>

<script setup lang="ts">
defineProps<{
label: string;
}>();
</script>