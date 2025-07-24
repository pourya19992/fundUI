<template>
<div>
    <button v-if="!isEditMode" @click="onOpen" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
    حساب بانکی جدید
    </button>

    <Modal :is-open="isOpen" @close="onClose">
    <template #body>
        <div>
            <h3 class="text-center text-lg font-semibold mb-4">{{ isEditMode ? 'ویرایش شماره حساب' : 'شماره حساب جدید' }}</h3>
            <div class="space-y-4">
            <div>
            <label class="block text-sm">شماره حساب</label>
            <input v-model="form.accountNumber" type="text" class="input-field" />
            </div>
            <div>
            <label class="block text-sm">شماره شبا</label>
            <input v-model="form.shabaNumber" type="text" class="input-field" />
            </div>
            <div>
            <label class="block text-sm">بانک</label>
            <select v-model="form.bankId" class="input-field">
                <option disabled value="">بانک را انتخاب کنید</option>
                <option v-for="bank in banks" :key="bank.id" :value="bank.id">{{ bank.name }}</option>
            </select>
            </div>
            <div>
            <label class="block text-sm">نوع حساب</label>
            <select v-model="form.bankAccountTypeId" class="input-field">
                <option disabled value="">نوع حساب را انتخاب کنید</option>
                <option v-for="type in bankAccountTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
            </select>
            </div>
        </div>
        </div>
    </template>
    <template #footer>
        <div class="flex justify-center gap-4">
        <button @click="handleSubmit" class="btn-primary w-24" :disabled="isLoading">
            ثبت
        </button>
        <button @click="onClose" class="btn-secondary w-24">
            انصراف
        </button>
        </div>
    </template>
    </Modal>
</div>
</template>

<script setup lang="ts">
import { ref, reactive, defineExpose, watch, onMounted } from "vue";
import Modal from "@/components/Modal.vue";
import { useNotify } from "@/helpers/hooks/useNotify";
import { createCustomerService } from '@/services/baseInformation/customerService';
import { createBankService } from '@/services/administration/bankService';
import type { Bank, BankAccountType } from '@/services/administration/bankService';

const props = defineProps<{ customerId: number }>();
const emit = defineEmits(['submit']);
const notify = useNotify();

const customerService = createCustomerService(BASE_URL);
const bankService = createBankService(BASE_URL);

const isOpen = ref(false);
const isLoading = ref(false);
const isEditMode = ref(false);

const banks = ref<Bank[]>([]);
const bankAccountTypes = ref<BankAccountType[]>([]);

const form = reactive({
accountNumber: '',
shabaNumber: '',
bankId: '',
bankAccountTypeId: ''
});

const onOpen = async () => {
isEditMode.value = false;
isOpen.value = true;
resetForm();
await loadBankData();
};

const onClose = () => {
isOpen.value = false;
isEditMode.value = false;
resetForm();
};

const resetForm = () => {
form.accountNumber = '';
form.shabaNumber = '';
form.bankId = '';
form.bankAccountTypeId = '';
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
if (!form.accountNumber || !form.shabaNumber || !form.bankId || !form.bankAccountTypeId) {
    notify({ description: 'لطفاً همه فیلدها را پر کنید', status: 'warning' });
    return;
}
isLoading.value = true;
try {
    await customerService.addCustomerBankAccount({
    customerId: String(props.customerId),
    bankAccounts: [{
        id: 0,
        isActive: true,
        bankAccountType: { id: Number(form.bankAccountTypeId), name: '' },
        bank: { id: Number(form.bankId), name: '', isValid: true },
        accountNumber: form.accountNumber,
        annualinterest: 0,
        shabaNumber: form.shabaNumber
    }]
    });
    notify({ description: 'حساب بانکی با موفقیت اضافه شد', status: 'success' });
    emit('submit');
    onClose();
} catch (error) {
    notify({ description: 'خطا در افزودن حساب بانکی', status: 'error' });
} finally {
    isLoading.value = false;
}
};

defineExpose({ onOpen });
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
