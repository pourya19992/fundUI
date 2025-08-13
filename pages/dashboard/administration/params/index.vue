<template>
<div class="w-full bg-white rounded-lg shadow mr-8" dir="rtl">
    <Notification ref="notificationRef" />

    <div class="p-6">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">مدیریت پارامترها</h2>
        <ParamsForm ref="paramsFormRef" :refetch="loadParams" />
</div>

<ParamsTable
        :params="paginatedParams"
        :is-loading="isLoadingList"
        :is-disabled="isLoading"
        :currentPage="currentPage"
        :totalPages="totalPages"
        :pageSize="pageSize"
        @edit="handleEdit"
        @delete="handleDelete"
        @pageChange="handlePageChange"
        @pageSizeChange="handlePageSizeChange"
    />
    </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { createParamService } from '../../../../services/administration/paramService'
import type { Params } from '../../../../services/administration/paramService'
import Notification from '@/components/Notification.vue'
import ParamsForm from '@/pages/dashboard/administration/params/sections/ParamsForm.vue'
import ParamsTable from '@/pages/dashboard/administration/params/sections//ParamsTable.vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../../../../stores/app'
import { BASE_URL } from '@/utils/constants'
import { useNotify, setNotificationComponent } from '@/helpers/hooks/useNotify'

const router = useRouter()
const appStore = useAppStore()
const paramService = createParamService(BASE_URL)
const params = ref<Params[]>([])
const isLoading = ref(false)
const isLoadingList = ref(false)
const paramsFormRef = ref(null)
const notificationRef = ref()
const notify = useNotify()

// Pagination state
const currentPage = ref(0)
const pageSize = ref(10)

const totalPages = computed(() => Math.ceil(params.value.length / pageSize.value))

const paginatedParams = computed(() => {
const start = currentPage.value * pageSize.value
const end = start + pageSize.value
return params.value.slice(start, end)
})

const handlePageChange = (page: number) => {
currentPage.value = page
}

const handlePageSizeChange = (size: number) => {
pageSize.value = size
  currentPage.value = 0 // Reset to first page when changing page size
}

const loadParams = async () => {
isLoadingList.value = true
try {
    const data = await paramService.getListParams()
    params.value = data
} catch (error: any) {
    console.error('Error loading params:', error)
    notify({ description: error.message || 'خطا در بارگذاری پارامترها', status: 'error' })
} finally {
    isLoadingList.value = false
}
}

const handleEdit = async (param: Params) => {
try {
    const data = await paramService.getParamById(param.id!)
    if (data && paramsFormRef.value) {
    ;(paramsFormRef.value as any).openForEdit(data)
    }
} catch (error: any) {
    console.error('Error loading param details:', error)
    notify({ description: error.message || 'خطا در بارگذاری اطلاعات پارامتر', status: 'error' })
}
}

const handleDelete = async (param: Params) => {
if (!param.id) return

if (confirm('آیا از حذف این پارامتر اطمینان دارید؟')) {
    isLoading.value = true
    try {
    await paramService.removeParam(param.id)
    notify({ description: 'پارامتر با موفقیت حذف شد', status: 'success' })
    await loadParams()
    } catch (error: any) {
    console.error('Error deleting param:', error)
    notify({ description: error.message || 'خطا در حذف پارامتر', status: 'error' })
    } finally {
    isLoading.value = false
    }
}
}

const goBack = () => {
router.back()
}

const toggleSidebar = () => {
appStore.toggleSidebar()
}

onMounted(() => {
setNotificationComponent(notificationRef.value)
loadParams()
})

definePageMeta({
layout: 'default',
})
</script>

<style scoped>
.container {
max-width: 1200px;
}
</style>