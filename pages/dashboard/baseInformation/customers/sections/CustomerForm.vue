<template>
<div>
    <button @click="openModalForAdd" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
    مشتری جدید
    </button>

<BaseFormModal
    v-model:modelValue="isModalOpen"
    :title="isEditMode ? 'ویرایش مشتری' : 'مشتری جدید'"
    submit-button-text="ثبت"
    cancel-button-text="انصراف"
    :is-loading="isSubmitting"
    :is-submitting="isSubmitting"
    @submit="handleSubmit"
    @cancel="closeModal"
    >
    <template #form-fields>
        <div class="space-y-4">
        <!-- Person fields -->
        <div>
            <label class="block text-sm">نام</label>
            <input v-model="form.person!.firstName" type="text" class="input-field" />
        </div>
        <div>
            <label class="block text-sm">نام خانوادگی</label>
            <input v-model="form.person!.lastName" type="text" class="input-field" />
        </div>
        <div>
            <label class="block text-sm">تاریخ تولد</label>
            <input v-model="form.person!.birthDate" type="date" class="input-field" />
        </div>
        <div>
            <label class="block text-sm">کد ملی</label>
            <input v-model="form.person!.nationalCode" type="text" class="input-field" />
        </div>
        <div>
            <label class="block text-sm">کد پستی</label>
            <input v-model="form.person!.postalCode" type="text" class="input-field" />
        </div>
        <div>
            <label class="block text-sm">شماره شناسنامه</label>
            <input v-model="form.person!.birthCertificationNumber" type="text" class="input-field" />
        </div>
        <div>
            <label class="block text-sm">شماره ثبت</label>
            <input v-model="form.person!.registrationNumber" type="text" class="input-field" />
        </div>
        <div>
            <label class="block text-sm">شهر صادرکننده</label>
            <input v-model="form.person!.issuingCity" type="text" class="input-field" />
        </div>
        <div>
            <label class="block text-sm">فکس</label>
            <input v-model="form.person!.fax" type="text" class="input-field" />
        </div>
        <div>
            <label class="block text-sm">موبایل</label>
            <input v-model="form.person!.cellPhone" type="text" class="input-field" />
        </div>
        <div>
            <label class="block text-sm">ایمیل</label>
            <input v-model="form.person!.email" type="email" class="input-field" />
        </div>
        <div>
            <label class="block text-sm">تلفن ثابت</label>
            <input v-model="form.person!.phone" type="text" class="input-field" />
        </div>
        <div>
            <label class="block text-sm">نام شرکت</label>
            <input v-model="form.person!.companyName" type="text" class="input-field" />
        </div>
        <div>
            <label class="block text-sm">آدرس</label>
            <input v-model="form.person!.address" type="text" class="input-field" />
        </div>
        <div>
            <label class="block text-sm">نام لاتین</label>
            <input v-model="form.person!.latinFirstName" type="text" class="input-field" />
        </div>
        <div>
            <label class="block text-sm">نام خانوادگی لاتین</label>
            <input v-model="form.person!.latinLastName" type="text" class="input-field" />
        </div>
        <div>
            <label class="block text-sm">ایرانی است؟</label>
            <select v-model="form.person!.isIranian" class="input-field">
            <option :value="true">بله</option>
            <option :value="false">خیر</option>
            </select>
        </div>
        <div>
            <label class="block text-sm">کد ارجاع</label>
            <input v-model="form.person!.refId" type="number" class="input-field" />
        </div>
        <div>
            <label class="block text-sm">شرکت است؟</label>
            <select v-model="form.person!.isCompany" class="input-field">
            <option :value="true">بله</option>
            <option :value="false">خیر</option>
            </select>
        </div>
        <!-- Customer fields -->
        <div>
            <label class="block text-sm">وضعیت مشتری</label>
            <select v-model="form.customerStatus!.id" class="input-field" >
            <option :value=1 >فعال</option>
            <option :value=2>معلق</option>
            <option :value=2>غیر فعال</option>
            </select>
        </div>
        <div>
            <label class="block text-sm">کد تفصیلی</label>
            <input v-model="form.detailLedger!.code" type="number" class="input-field" />
        </div>
        <div>
            <label class="block text-sm">شماره حساب</label>
            <input v-model="form.bankAccount!.accountNumber" type="number" class="input-field" />
        </div>
        <div>
            <label class="block text-sm">شماره شبا</label>
            <input v-model="form.bankAccount!.shabaNumber" type="text" class="input-field" />
        </div>
        <div>
            <label class="block text-sm">توضیحات</label>
            <input v-model="form.comments" type="text" class="input-field" />
        </div>
        <div>
            <label class="block text-sm">نرخ سود</label>
            <input v-model="form.profitRate" type="number" class="input-field" />
        </div>
        <div>
            <label class="block text-sm">مشتری پرداخت الکترونیک</label>
            <select v-model="form.isEpaymentCustomer" class="input-field">
            <option :value="true">بله</option>
            <option :value="false">خیر</option>
            </select>
        </div>
        <div>
            <label class="block text-sm">سجام</label>
            <select v-model="form.isSejam" class="input-field">
            <option :value="true">بله</option>
            <option :value="false">خیر</option>
            </select>
        </div>
        <div>
            <label class="block text-sm">ارسال پیامک</label>
            <select v-model="form.isSmsSend" class="input-field">
            <option :value="true">بله</option>
            <option :value="false">خیر</option>
            </select>
        </div>
        <div>
            <label class="block text-sm">مالیات بر ارزش افزوده</label>
            <select v-model="form.isVat" class="input-field">
            <option :value="true">بله</option>
            <option :value="false">خیر</option>
            </select>
        </div>
        <div>
            <label class="block text-sm">سود پرداختی</label>
            <select v-model="form.isProfitIssue" class="input-field">
            <option :value="true">بله</option>
            <option :value="false">خیر</option>
            </select>
        </div>
        </div>
    </template>
    </BaseFormModal>
</div>
</template>

<script setup lang="ts">
import { ref, reactive, defineExpose } from "vue";
import BaseFormModal from "@/components/base/BaseFormModal.vue";
import { useNotify } from "@/helpers/hooks/useNotify";
import { createCustomerService } from '@/services/baseInformation/customerService';
import type { CustomerResponseDto } from "@/services/baseInformation/customerService";
import { BASE_URL } from '@/utils/constants';

const emit = defineEmits(['submit']);
const notify = useNotify();
const customerService = createCustomerService(BASE_URL);

const defaultPerson = {
firstName: '',
lastName: '',
birthDate: '',
nationalCode: '',
postalCode: '',
birthCertificationId: '',
birthCertificationNumber: '',
registrationNumber: '',
issuingCity: '',
fax: '',
cellPhone: '',
email: '',
parent: '',
phone: '',
companyName: '',
address: '',
latinFirstName: '',
latinLastName: '',
isIranian: false,
refId: undefined,
isCompany: false
};

const isModalOpen = ref(false);
const isEditMode = ref(false);
const isSubmitting = ref(false);

const form = ref<CustomerResponseDto>({
  id: 0,
  detailLedgerId: 0,
  person: { ...defaultPerson },
  customerStatus: { id: 0 , name: ""},
  comments: '',
  profitRate: 0,
  isEpaymentCustomer: false,
  isSejam: false,
  isSmsSend: false,
  isVat: false,
  isProfitIssue: false
});

const openModalForAdd = () => {
isEditMode.value = false;
isModalOpen.value = true;
form.value = {
    id: 0,
    detailLedgerId: 0,
    person: { ...defaultPerson },
    customerStatus: { id: 0 , name: ""},
    detailLedger: { name: "", code: "", detailLedgerTypeId: 0, isActive: true },
    comments: '',
    profitRate: 0,
    isEpaymentCustomer: false,
    isSejam: false,
    isSmsSend: false,
    isVat: false,
    isProfitIssue: false
};
};

const openForEdit = (data: CustomerResponseDto) => {
isEditMode.value = true;
isModalOpen.value = true;
form.value = {
    ...data,
    person: { ...defaultPerson, ...data.person }
};
};

const closeModal = () => {
isModalOpen.value = false;
isEditMode.value = false;
form.value = {
    id: 0,
    detailLedgerId: 0,
    person: { ...defaultPerson },
    customerStatus: { id: 0 , name: ""},
    detailLedger: { name: "", code: "", detailLedgerTypeId: 0, isActive: true },
    comments: '',
    profitRate: 0,
    isEpaymentCustomer: false,
    isSejam: false,
    isSmsSend: false,
    isVat: false,
    isProfitIssue: false
};
};

const handleSubmit = async () => {
if (!form.value.person?.firstName || !form.value.person?.lastName) {
    notify({ description: "نام و نام خانوادگی الزامی است", status: "warning" });
    return;
}
isSubmitting.value = true;
try {
    if (form.value.id) {
    await customerService.editCustomer(form.value);
    notify({ description: "مشتری با موفقیت ویرایش شد.", status: "success" });
    } else {
    await customerService.addCustomer(form.value);
    notify({ description: "مشتری با موفقیت اضافه شد.", status: "success" });
    }
    emit('submit');
    closeModal();
} catch (error: any) {
    notify({ description: `خطا: ${error.message}`, status: "error" });
} finally {
    isSubmitting.value = false;
}
};

defineExpose({ openForEdit, openModalForAdd });
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
