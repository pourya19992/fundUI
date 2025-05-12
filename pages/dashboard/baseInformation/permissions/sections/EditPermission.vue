<template>
  <div>
    <!-- Tooltip and Edit Icon -->
    <div v-tooltip="'ویرایش'" @click="onOpen" class="cursor-pointer">
      <EditIcon />
    </div>

    <!-- Modal -->
    <Modal v-if="isOpen" @close="onClose">
      <template #default>
        <div class="rounded-lg mx-4 md:mx-0">
          <div class="text-primary text-lg md:text-xl mb-4 text-center">
            ویرایش مجوز {{ permission.name }}
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm md:text-md">آدرس مجوز</label>
              <input
                  v-model="url"
                  type="text"
                  class="w-full p-2 border border-gray-300 rounded-md"
                  :class="{'sm:text-sm md:text-md': true}"
              />
            </div>

            <div>
              <label class="block text-sm md:text-md">نام مجوز</label>
              <input
                  v-model="name"
                  type="text"
                  class="w-full p-2 border border-gray-300 rounded-md"
                  :class="{'sm:text-sm md:text-md': true}"
              />
            </div>
          </div>

          <div class="py-8 flex justify-center space-x-4">
            <button
                :disabled="isLoading"
                class="bg-primary text-white py-2 px-4 rounded-md"
                @click="handleSubmit"
            >
              ثبت
            </button>
            <button
                class="text-gray-500 py-2 px-4"
                @click="onClose"
            >
              انصراف
            </button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import EditIcon from "~/components/icons/EditIcon.vue";
import { useNotify } from "~/helpers/hooks/useNotify";


// Define props with refetch function and permission data


// Reactive variables for form fields
const isOpen = ref(false);
const url = ref(props.permission?.url || "");
const name = ref(props.permission?.name || "");

// Notification helper
const notify = useNotify();

// Extract the API functions from useApi
const { editPermission } = useApi();

// Methods to open/close modal
const onOpen = () => {
  isOpen.value = true;
};

const onClose = () => {
  isOpen.value = false;
};

// Watch prop to update form fields when permission data changes
watch(
    () => props.permission,
    (newPermission) => {
      if (newPermission) {
        url.value = newPermission.url || "";
        name.value = newPermission.name || "";
      }
    },
    { immediate: true }
);

// Handle form submission
const handleSubmit = async () => {
  if (name.value && url.value) {
    try {
      const result = await editPermission({
        id: props.permission?.id || 0,
        name: name.value,
        url: url.value
      });
      props.refetch();
      onClose();
      notify({ description: "عملیات با موفقیت انجام شد.", status: "success" });
    } catch (error) {
      notify({ description: `خطا: ${error.message}`, status: "error" });
    }
  } else {
    notify({ description: "تمام فیلدها باید پر شوند.", status: "warning" });
  }
};
</script>
