<template>
<div>
    <BaseTooltip label="شماره حساب‌ها">
        <div class="cursor-pointer" @click="openModal">
        <PermissionIcon />
        </div>
    </BaseTooltip>

    <BaseFormModal
        v-model:modelValue="isModalOpen"
        title="لیست حساب‌های بانکی مشتری"
        cancel-button-text="بستن"
        :is-loading="isLoading"
        :is-submitting="isUpdating"
        @cancel="closeModal"
        show-submit-button
        size="xl"
    >
        <template #form-fields>
            <div v-if="customerBankAccountsWithLabel.length" class="overflow-x-auto">
                <BaseTable
                  :items="customerBankAccountsWithLabel"
                  :columns="bankAccountColumns"
                  :is-loading="isLoading"
                  :colspan="5"
                  class="w-full text-base text-right"
                />
            </div>
            <div v-else class="mb-4 text-gray-500 text-center">حسابی ثبت نشده است.</div>
            <div class="flex justify-end mt-4">
              <BankAccountForm
                ref="showBankAccountForm"
                :customer-id="props.customer.id"
                @submit="onBankAccountAdded"
              />
            </div>
        </template>
    </BaseFormModal>
</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseTooltip from '@/components/base/BaseTooltip.vue';
import BaseFormModal from '@/components/base/BaseFormModal.vue';
import PermissionIcon from '@/components/icons/PermissionIcon.vue';
import { useNotify } from '@/helpers/hooks/useNotify';
import { createCustomerService } from "@/services/baseInformation/customerService";
import type { CustomerResponseDto } from '@/services/baseInformation/customerService';
import type { BankAccount } from '@/services/baseInformation/customerService';
import type { Bank, BankAccountType } from '@/services/administration/bankService';
import { createBankService } from '@/services/administration/bankService';
import BaseTable from '@/components/base/BaseTable.vue';
import BankAccountForm from '@/pages/dashboard/baseInformation/bankAccounts/BankAccountForm.vue';

const props = defineProps<{ customer: CustomerResponseDto }>();

const customerService = createCustomerService(BASE_URL);
const notify = useNotify();

const isModalOpen = ref(false);
const isLoading = ref(false);
const isUpdating = ref(false);
const customerBankAccounts = ref<BankAccount[]>([]);

const bankService = createBankService(BASE_URL);
const banks = ref<Bank[]>([]);
const bankAccountTypes = ref<BankAccountType[]>([]);

const newAccount = ref({
  accountNumber: '',
  shabaNumber: '',
  bankId: null as number | null,
  bankAccountTypeId: null as number | null
});

const showBankAccountForm = ref(false);

function openBankAccountForm() {
  showBankAccountForm.value = true;
}
function onBankAccountAdded() {
  showBankAccountForm.value = false;
  loadData();
}

const bankAccountColumns = [
  { label: 'بانک', key: 'bank.name' },
  { label: 'نوع حساب', key: 'bankAccountType.name' },
  { label: 'شماره حساب', key: 'accountNumber' },
  { label: 'شماره شبا', key: 'shabaNumber' },
  { label: 'فعال', key: 'isActiveLabel' }
];

const customerBankAccountsWithLabel = computed(() =>
  customerBankAccounts.value.map(acc => ({
    ...acc,
    isActiveLabel: acc.isActive ? 'بله' : 'خیر'
  }))
);

const loadBankData = async () => {
  try {
    const [bankList, bankAccountTypeList] = await Promise.all([
      bankService.getBankList(),
      bankService.getBankAccountTypeList()
    ]);
    banks.value = Array.isArray(bankList) ? bankList : [];
    bankAccountTypes.value = Array.isArray(bankAccountTypeList) ? bankAccountTypeList : [];
  } catch (error) {
    notify({ description: 'خطا در بارگذاری بانک یا نوع حساب', status: 'error' });
  }
};

const openModal = async () => {
  isModalOpen.value = true;
  await Promise.all([loadData(), loadBankData()]);
};

const closeModal = () => {
  isModalOpen.value = false;
  newAccount.value.accountNumber = '';
  newAccount.value.shabaNumber = '';
};

const loadData = async () => {
  isLoading.value = true;
  try {
    if (!props.customer.id) return;
    const res = await customerService.getCustomerBankAccounts(props.customer.id);
    console.log('bankAccounts:', res.bankAccounts); // Debug log
    customerBankAccounts.value = res.bankAccounts || [];
  } catch (error) {
    notify({
      description: 'خطا در بارگذاری حساب‌ها',
      status: 'error'
    });
  } finally {
    isLoading.value = false;
  }
};

const addNewBankAccount = async () => {
  if (!newAccount.value.accountNumber || !newAccount.value.shabaNumber || !newAccount.value.bankId || !newAccount.value.bankAccountTypeId) {
    notify({ description: 'لطفاً همه فیلدها را پر کنید', status: 'error' });
    return;
  }
  isUpdating.value = true;
  try {
    await customerService.addCustomerBankAccount({
      customerId: String(props.customer.id),
      bankAccount: {
        accountNumber: newAccount.value.accountNumber,
        shabaNumber: newAccount.value.shabaNumber,
        id: 0,
        isActive: true,
        bankAccountType: { id: newAccount.value.bankAccountTypeId, name: '' },
        bank: { id: newAccount.value.bankId, name: '', isValid: true },
        annualinterest: 0
      }
    });
    notify({
      description: 'حساب جدید با موفقیت اضافه شد',
      status: 'success'
    });
    newAccount.value.accountNumber = '';
    newAccount.value.shabaNumber = '';
    newAccount.value.bankId = null;
    newAccount.value.bankAccountTypeId = null;
    await loadData();
  } catch (error) {
    notify({
      description: 'خطا در افزودن حساب جدید',
      status: 'error'
    });
  } finally {
    isUpdating.value = false;
  }
};
</script>

<style scoped>
.btn-primary {
  @apply bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>