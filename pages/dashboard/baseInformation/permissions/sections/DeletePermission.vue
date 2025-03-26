<template>
  <div>
    <button @click="onOpen" class="cursor-pointer">
      <TrashIcon />
    </button>

    <AppModal
        :accept-text="'حذف'"
        :close-text="'انصراف'"
        :is-open="isOpen"
        @close="onClose"
        @accept="handleDelete"
    >
      <template #body>
        <div class="text-center">از حذف این مورد اطمینان دارید؟</div>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRemovePermission } from "~/services/authentication";
import TrashIcon from "~/components/icons/TrashIcon.vue";
import AppModal from "~/components/form/AppModal.vue";
import { useNotify } from "~/helpers/hooks/useNotify";

const props = defineProps({
  id: Number,
  refetch: Function
});

const isOpen = ref(false);

const { mutate, isLoading } = useRemovePermission({
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

const handleDelete = () => {
  mutate(props.id);
};
</script>
