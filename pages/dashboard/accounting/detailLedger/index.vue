<template>
<div class="w-full bg-white rounded-lg shadow mr-8" dir="rtl">
    <Notification ref="notificationRef" />

    <div class="p-6">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">مدیریت حساب های تفصیلی</h2>
        <DetailLedgerForm ref="detailLedgerFormRef" :refetch="loadDetailLedger" />
</div>

<DetailLedgerTable
        :detailLedger="paginatedDetailLedger"
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
import { createDetailLedgerService } from '../../../../services/accounting/detailLedgerService'
import type { DetailLedger } from '../../../../services/accounting/detailLedgerService'
import Notification from '@/components/Notification.vue'
import DetailLedgerForm from './sections/DetailLedgerForm.vue'
import DetailLedgerTable from './sections/DetailLedgerTable.vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../../../../stores/app'
import { BASE_URL } from '@/utils/constants'
import { useNotify, setNotificationComponent } from '@/helpers/hooks/useNotify'

const router = useRouter()
const appStore = useAppStore()
const detailLedgerService = createDetailLedgerService(BASE_URL)
const detailLedger = ref<DetailLedger[]>([])
const isLoading = ref(false)
const isLoadingList = ref(false)
const detailLedgerFormRef = ref(null)
const notificationRef = ref()
const notify = useNotify()

// Pagination state
const currentPage = ref(0)
const pageSize = ref(10)

const totalPages = computed(() => Math.ceil(detailLedger.value.length / pageSize.value))

const paginatedDetailLedger = computed(() => {
const start = currentPage.value * pageSize.value
const end = start + pageSize.value
return detailLedger.value.slice(start, end)
})

const handlePageChange = (page: number) => {
currentPage.value = page
}

const handlePageSizeChange = (size: number) => {
pageSize.value = size
  currentPage.value = 0 // Reset to first page when changing page size
}

const loadDetailLedger = async () => {
isLoadingList.value = true
try {
    const data = await detailLedgerService.getDetailLedgerList()
    detailLedger.value = data
} catch (error: any) {
    console.error('Error loading branches:', error)
    notify({ description: error.message || 'خطا در بارگذاری حساب تفصیلی', status: 'error' })
} finally {
    isLoadingList.value = false
}
}

const handleEdit = async (detailLedger: DetailLedger) => {
try {
    const data = await detailLedgerService.getDetailLedgerById(detailLedger.id)
    if (data && detailLedgerFormRef.value) {
    ;(detailLedgerFormRef.value as any).openForEdit(data)
    }
} catch (error: any) {
    console.error('Error loading branch details:', error)
    notify({ description: error.message || 'خطا در بارگذاری اطلاعات حساب تفصیلی', status: 'error' })
}
}

const handleDelete = async (detailLedger: DetailLedger) => {
if (!detailLedger.id) return

if (confirm('آیا از حذف این حساب تفصیلی اطمینان دارید؟')) {
    isLoading.value = true
    try {
    await detailLedgerService.deleteDetailLedger(detailLedger.id)
    notify({ description: 'حساب تفصیلی با موفقیت حذف شد', status: 'success' })
    await loadDetailLedger()
    } catch (error: any) {
    console.error('Error deleting detail ledger:', error)
    notify({ description: error.message || 'خطا در حذف حساب تفصیلی', status: 'error' })
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
loadDetailLedger()
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
