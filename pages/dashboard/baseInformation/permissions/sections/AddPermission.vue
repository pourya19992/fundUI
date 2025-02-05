<template>
  <div>
    <button @click="onOpen" class="bg-primary text-white px-4 py-2 rounded">
      مجوز جدید
    </button>

    <Modal :is-open="isOpen" @close="onClose">
      <template #body>
        <div>
          <h3 class="text-center text-lg font-semibold mb-4">مجوز جدید</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm">آدرس مجوز</label>
              <input v-model="url" type="text" class="input-field" />
            </div>
            <div>
              <label class="block text-sm">نام مجوز</label>
              <input v-model="name" type="text" class="input-field" />
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
import { useAddPermission } from "~/services/authentication";
import Modal from "~/components/Modal.vue";
import { useNotify } from "~/helpers/hooks/useNotify";

const props = defineProps({
  refetch: Function
});

const isOpen = ref(false);
const url = ref("");
const name = ref("");

const { mutate, isLoading } = useAddPermission({
  onSuccess() {
    props.refetch();
    onClose();
    useNotify({ description: "عملیات یا موفقیت انجام شد.", status: "success" });
  }
});

const onOpen = () => {
  isOpen.value = true;
};

const onClose = () => {
  isOpen.value = false;
};

const handleSubmit = () => {
  if (name.value && url.value) {
    mutate({ id: 0, name: name.value, url: url.value });
  }
};
</script>
