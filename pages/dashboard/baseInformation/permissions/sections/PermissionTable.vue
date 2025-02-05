<template>
  <div>
    <div v-if="data.content.length === 0" class="text-center">مجوزی یافت نشد.</div>
    <AppTable
        :headers="headers"
        :search-values="searchValues"
        @search-change="handleSearchChange"
    >
      <template>
        <tr v-for="item in filteredData" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.url }}</td>
          <td>فعال</td>
          <td>
            <div class="flex space-x-4">
              <DeletePermission :id="item.id" :refetch="refetch" />
              <EditPermission :refetch="refetch" :permission="item" />
            </div>
          </td>
        </tr>
      </template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import AppTable from "~/components/table/AppTable.vue";
import type {GetAllPermissionsResponse} from "~/services/authentication/type";
import DeletePermission from "~/pages/dashboard/baseInformation/permissions/sections/DeletePermission.vue";
import EditPermission from "~/pages/dashboard/baseInformation/permissions/sections/EditPermission.vue";


const props = defineProps<{
  data: GetAllPermissionsResponse;
  headers: string[]; // آرایه‌ای از هدرها
  refetch: () => void;
}>();

const searchValues = ref<{
  "نام مجوز": string;
  "آدرس": string;
}>({
  "نام مجوز": "",
  "آدرس": "",
});

const handleSearchChange = (key: string, value: string) => {
  if (key in searchValues.value) {
    searchValues.value[key as keyof typeof searchValues.value] = value;
  }
};

const filteredData = computed(() =>
    props.data.content.filter(
        (item) =>
            (item.name?.toLowerCase() || "").includes((searchValues.value["نام مجوز"] || "").toLowerCase()) &&
            (item.url?.toLowerCase() || "").includes((searchValues.value["آدرس"] || "").toLowerCase())
    )
);
</script>
