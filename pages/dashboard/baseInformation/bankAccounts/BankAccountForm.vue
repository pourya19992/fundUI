<template>
<div>
    <button  @click="openModalForAdd" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
    حساب بانکی جدید
    </button>

<BaseFormModal
    v-model:modelValue="isModalOpen"
    :title="isEditMode ? 'ویرایش شماره حساب' : 'شماره حساب جدید'"
    submit-button-text="ثبت"
    cancel-button-text="انصراف"
    :is-loading="isSubmitting"
    :is-submitting="isSubmitting"
    @submit="handleSubmit"
    @cancel="closeModal"
    >
    <template #form-fields>
        <div class="space-y-4">

        <div>
            <label class="block text-sm">شماره حساب</label>
            <input v-model="form.bankAccount.accountNumber" type="text" class="input-field" />
        </div>
        <div>
            <label class="block text-sm">شماره شبا</label>
            <input v-model="form.bankAccount.shabaNumber" type="text" class="input-field" />
        </div>
        <div>
            <label class="block text-sm">بانک</label>
            <select v-model="form.bankAccount.bank.id" class="input-field">
                <option disabled value="">بانک را انتخاب کنید</option>
                <option v-for="bank in banks" :key="bank.id" :value="bank.id">{{ bank.name }}</option>
            </select>
        </div>
        <div>
            <label class="block text-sm">نوع حساب</label>
            <select v-model="form.bankAccount.bankAccountType.id" class="input-field">
                <option disabled value="">نوع حساب را انتخاب کنید</option>
                <option v-for="type in bankAccountTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
            </select>
        </div>
        <div>
            <label class="block text-sm">سود سالانه</label>
            <input v-model="form.bankAccount.annualinterest" type="text" class="input-field" />
        </div>
        <div class="flex items-center">
            <input
                id="isActive"
                type="checkbox"
                v-model="form.bankAccount.isActive"
                class="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label for="isActive" class="ml-2 block text-sm text-gray-900">وضعیت</label>
            </div>
        </div>
    </template>
    </BaseFormModal>
</div>
</template>

<script setup lang="ts">
import { ref, defineExpose } from "vue";
import { useNotify } from "@/helpers/hooks/useNotify";
import BaseFormModal from "@/components/base/BaseFormModal.vue";
import { createCustomerService, type BankAccount } from '@/services/baseInformation/customerService';
import { createBankService } from '@/services/administration/bankService';
import type { Bank, BankAccountType } from '@/services/administration/bankService';
import type { CustomerBankAccount } from '@/services/baseInformation/customerService';

// Define a type for the form that ensures bankAccount is always defined
interface BankAccountFormData {
id: number;
customerId: string;
bankAccount: BankAccount;
}

const props = defineProps<{
customerId: number | string,
bankAccount?: BankAccount | null
}>();

const emit = defineEmits(['submit']);
const notify = useNotify();

const customerService = createCustomerService(BASE_URL);
const bankService = createBankService(BASE_URL);

const isModalOpen = ref(false);
const isEditMode = ref(false);
const isSubmitting = ref(false);

const banks = ref<Bank[]>([]);
const bankAccountTypes = ref<BankAccountType[]>([]);

const form = ref<BankAccountFormData>({
    id: 0,
    customerId: String(props.customerId),
    bankAccount: {
    id: 0,
    accountNumber: '',
    shabaNumber: '',
    bank: { id: 0, name: '', isValid: true },
    bankAccountType: { id: 0, name: '' },
    isActive: true,
    annualinterest: 0
}
});


const openModalForAdd = async () => {
isEditMode.value = false;
isModalOpen.value = true;
// Reset form to initial state
form.value = {
    id: 0,
    customerId: String(props.customerId),
    bankAccount: {
    id: 0,
    accountNumber: '',
    shabaNumber: '',
    bank: { id: 0, name: '', isValid: true },
    bankAccountType: { id: 0, name: '' },
    isActive: true,
    annualinterest: 0
}
};
await loadBankData();
};

const openForEdit = async (data: BankAccountFormData) => {
console.log('openForEdit data:', data);
isEditMode.value = true;
isModalOpen.value = true;
await loadBankData();
form.value = {
    id: data.id,
    customerId: data.customerId,
    bankAccount: {
    id: data.bankAccount.id,
    accountNumber: data.bankAccount.accountNumber,
    shabaNumber: data.bankAccount.shabaNumber,
    bank: data.bankAccount.bank,
    bankAccountType: data.bankAccount.bankAccountType,
    isActive: data.bankAccount.isActive,
    annualinterest: data.bankAccount.annualinterest
    }
};
console.log('form.value after setting:', form.value);
};

const closeModal = () => {
isModalOpen.value = false;
isEditMode.value = false;
// Reset form to initial state
form.value = {
    id: 0,
    customerId: String(props.customerId),
    bankAccount: {
    id: 0,
    accountNumber: '',
    shabaNumber: '',
    bank: { id: 0, name: '', isValid: true },
    bankAccountType: { id: 0, name: '' },
    isActive: true,
    annualinterest: 0
}
};
};


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

const handleSubmit = async () => {
if (
  !form.value.bankAccount.accountNumber ||
  !form.value.bankAccount.shabaNumber ||
  !form.value.bankAccount.bank ||
  !form.value.bankAccount.bankAccountType
) {
    notify({ description: 'لطفاً همه فیلدها را پر کنید', status: 'warning' });
    return;
}
isSubmitting.value = true;
try {
    if(form.value.id) {
    await customerService.editCustomerBankAccount(form.value);
    notify({ description: "شماره حساب با موفقیت ویرایش شد.", status: "success" });
    } else {
    await customerService.addCustomerBankAccount({
    customerId: String(props.customerId),
    bankAccounts: [{
        id: 0,
        isActive: true,
        bankAccountType: { id: Number(form.value.bankAccount.bankAccountType.id), name: '' },
        bank: { id: Number(form.value.bankAccount.bank.id), name: '', isValid: true },
        accountNumber: form.value.bankAccount.accountNumber,
        annualinterest: 0,
        shabaNumber: form.value.bankAccount.shabaNumber
    }]
    });
    notify({ description: 'حساب بانکی با موفقیت اضافه شد', status: 'success' });
    }
    emit('submit');
    closeModal();
} catch (error: any) {
    notify({ description: error.message || 'خطا در افزودن حساب بانکی', status: 'error' });
} finally {
    isSubmitting.value = false;
}
};

defineExpose({ openModalForAdd, openForEdit });
</script>

<style scoped>
.input-field {
@apply w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.btn-primary {
@apply bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
@apply bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors;
}
</style>
