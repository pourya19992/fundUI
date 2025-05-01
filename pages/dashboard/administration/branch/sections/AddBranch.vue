<template>
  <div>
    <button @click="onOpen" class="bg-primary text-white px-4 py-2 rounded">
      شعبه جدید
    </button>

    <Modal :is-open="isOpen" @close="onClose">
      <template #body>
        <div>
          <h3 class="text-center text-lg font-semibold mb-4">شعبه جدید</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm">کد شعبه</label>
              <input v-model="code" type="text" class="input-field" required />
            </div>
            <div>
              <label class="block text-sm">نام شعبه</label>
              <input v-model="name" type="text" class="input-field" required />
            </div>
            <div>
              <label class="block text-sm">مدیر شعبه</label>
              <input v-model="manager" type="text" class="input-field" />
            </div>
            <div>
              <label class="block text-sm">تلفن</label>
              <input v-model="phone" type="text" class="input-field" />
            </div>
            <div>
              <label class="block text-sm">فکس</label>
              <input v-model="fax" type="text" class="input-field" />
            </div>
            <div>
              <label class="block text-sm">تلفن همراه</label>
              <input v-model="cellPhone" type="text" class="input-field" />
            </div>
            <div>
              <label class="block text-sm">کد پستی</label>
              <input v-model="postalCode" type="text" class="input-field" />
            </div>
            <div>
              <label class="block text-sm">آدرس</label>
              <textarea v-model="address" class="input-field" rows="3"></textarea>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-center space-x-4">
          <button @click="handleSubmit" class="bg-primary text-white px-4 py-2 rounded" :disabled="isLoading">
            ثبت
          </button>
          <button @click="onClose" class="text-gray-500 px-4 py-2">انصراف</button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { createFundService } from "~/services/administration/fundService";
import Modal from "~/components/Modal.vue";
import { useNotify } from "~/helpers/hooks/useNotify";
import { useRuntimeConfig } from '#app';

const props = defineProps({
  refetch: Function
});

const config = useRuntimeConfig();
const fundService = createFundService(config.public.apiBase);

const isOpen = ref(false);
const isLoading = ref(false);
const code = ref("");
const name = ref("");
const manager = ref("");
const phone = ref("");
const fax = ref("");
const cellPhone = ref("");
const postalCode = ref("");
const address = ref("");

const notify = useNotify();

const onOpen = () => {
  isOpen.value = true;
};

const onClose = () => {
  isOpen.value = false;
  resetForm();
};

const resetForm = () => {
  code.value = "";
  name.value = "";
  manager.value = "";
  phone.value = "";
  fax.value = "";
  cellPhone.value = "";
  postalCode.value = "";
  address.value = "";
};

const handleSubmit = async () => {
  if (!code.value || !name.value) {
    notify({ description: "کد و نام شعبه الزامی است.", status: "warning" });
    return;
  }

  isLoading.value = true;
  try {
    await fundService.addBranch({
      code: code.value,
      name: name.value,
      isActive: true,
      manager: manager.value,
      phone: phone.value,
      fax: fax.value,
      cellPhone: cellPhone.value,
      postalCode: postalCode.value,
      address: address.value
    });
    
    props.refetch();
    onClose();
    notify({ description: "شعبه با موفقیت اضافه شد.", status: "success" });
  } catch (error) {
    notify({ description: `خطا: ${error.message}`, status: "error" });
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.input-field {
  @apply w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}
</style> 