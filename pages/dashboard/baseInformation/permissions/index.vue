<template>
  <div>
    <div v-if="isLoading">
      <AppLoading />
    </div>
    <transition name="fade">
      <div v-if="data">
        <VStack align="stretch" :gap="4">
          <HStack justify="space-between" pb="8">
            <Heading>مجوزها</Heading>
            <AddPermission :refetch="refetch" />
          </HStack>
          <PermissionTable :data="data" :refetch="refetch" />
          <Pagination
              :currentPage="page"
              :totalPages="Math.ceil(data.totalElements / size)"
              :pageSize="size"
              @pageChange="handlePageChange"
              @pageSizeChange="handlePageSizeChange"
           />
        </VStack>
      </div>
    </transition>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import { useGetAllPermission } from '~/services/authentication';
import AppLoading from "~/components/form/AppLoading.vue";
import AddPermission from "~/pages/dashboard/baseInformation/permissions/sections/AddPermission.vue";
import Pagination from "~/components/form/Pagination.vue";

const page = ref(0);
const size = ref(10);

// Fetching the permissions using useGetAllPermission from composable
const { data, refetch, isLoading } = useGetAllPermission(page.value, size.value);

const handlePageChange = (newPage: number) => {
  page.value = newPage;
};

const handlePageSizeChange = (newSize: number) => {
  size.value = newSize;
  page.value = 0; // Reset page to the first page
};
</script>


<style scoped>
.permissions-page {
  padding: 20px;
}

.loading-container {
  text-align: center;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
}

header h2 {
  font-size: 1.5rem;
  font-weight: bold;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
