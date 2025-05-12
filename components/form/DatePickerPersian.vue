<template>
    <PersianDatePicker v-model="value" format="YYYY/MM/DD" display-format="jYYYY/jMM/jDD" locale="fa"
        color="#2563eb"
/>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import PersianDatePicker from 'vue3-persian-datetime-picker';

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits(['update:modelValue']);

const value = computed({
get: () => props.modelValue,
set: (val: string) => emit('update:modelValue', val)
});
</script>
