<template>
  <svg
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 3.5H19V1.5H17V3.5H9V1.5H7V3.5H6C4.9 3.5 4 4.4 4 5.5V19.5C4 20.6 4.9 21.5 6 21.5H20C21.1 21.5 22 20.6 22 19.5V5.5C22 4.4 21.1 3.5 20 3.5ZM20 19.5H6V9.5H20V19.5ZM20 7.5H6V5.5H20V7.5Z"
      :fill="color"
    />
  </svg>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'CalendarIcon',
  props: {
    width: {
      type: [String, Number],
      default: 23,
    },
    height: {
      type: [String, Number],
      default: 20,
    },
    color: {
      type: String,
      default: '#404B73',
    },
  },
});
</script>

<style scoped>
/* Optional: scoped styles */
</style>



