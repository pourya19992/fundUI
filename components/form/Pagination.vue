<template>
  <div class="flex flex-col space-y-4 mb-[100px] md:mb-[80px]">
    <div class="flex flex-wrap justify-between items-center gap-2 md:gap-4">
      <button
          @click="onPageChange(currentPage - 1)"
          :disabled="currentPage === 0"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-xs md:text-md"
      >
        قبلی
      </button>

      <div>
        <p class="text-xs md:text-md">شماره صفحه:</p>
        <input
            type="number"
            :value="pageInput"
            @input="handlePageChange"
            @keydown.enter="applyChanges"
            :min="1"
            :max="totalPages"
            placeholder="شماره صفحه"
            class="w-full p-1 text-center border rounded text-xs md:text-md"
        />
      </div>

      <div>
        <p class="text-xs md:text-md">تعداد رکوردها در هر صفحه:</p>
        <select
            :value="sizeInput"
            @change="handlePageSizeChange"
            class="w-full p-1 text-center border rounded text-xs md:text-md"
        >
          <option :value="10">10 رکورد</option>
          <option :value="20">20 رکورد</option>
          <option :value="50">50 رکورد</option>
        </select>
      </div>

      <button
          @click="onPageChange(currentPage + 1)"
          :disabled="currentPage >= totalPages - 1"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-xs md:text-md"
      >
        بعدی
      </button>
    </div>

    <div class="text-center">
      <p class="text-xs md:text-md">
        {{ pageInput }} از {{ totalPages }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const props = defineProps<PaginationProps>();

const pageInput = ref(props.currentPage + 1);
const sizeInput = ref(props.pageSize);

watch(
    () => props.currentPage,
    (newPage) => {
      pageInput.value = newPage + 1;
    }
);

const handlePageChange = (e: Event) => {
  pageInput.value = Number((e.target as HTMLInputElement).value);
};

const handlePageSizeChange = (e: Event) => {
  const newSize = Number((e.target as HTMLSelectElement).value);
  sizeInput.value = newSize;
  props.onPageSizeChange(newSize);
};

const applyChanges = () => {
  if (pageInput.value > 0 && pageInput.value <= props.totalPages) {
    props.onPageChange(pageInput.value - 1);
  }
};
</script>