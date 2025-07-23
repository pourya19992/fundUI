<template>
    <div>
    <BaseTooltip label="گروه های کاربری">
        <div class="cursor-pointer" @click="openModal">
        <UserGroupIcon />
        </div>
    </BaseTooltip>

    <BaseFormModal
        v-model:modelValue="isModalOpen"
        :title="'گروه های کاربری کاربر'"
        submit-button-text="ثبت"
        cancel-button-text="انصراف"
        :is-loading="isLoading"
        :is-submitting="isUpdating"
        @submit="assignUserGroups"
        @cancel="closeModal"
        size="sm" >
        <template #form-fields>
        <div class="mb-4">
            <input
            v-model="searchQuery"
            type="text"
            placeholder="جستجوی گروه های کاربری..."
            class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            :disabled="isLoading"
            />
        </div>

        <div class="flex flex-col space-y-4 max-h-96 overflow-y-auto py-2">
            <BaseLoading v-if="isLoading" />
            <template v-else>
            <div
                v-for="userGroup in filteredUserGroups"
                :key="userGroup.id"
                class="flex items-center"
            >
                <input
                type="checkbox"
                :id="'userGroup-' + userGroup.id"
                :value="userGroup.id"
                v-model="selectedUserGroupIds"
                :disabled="isUpdating"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mx-4 md:mx-0"
                />
                <label :for="'userGroup-' + userGroup.id" class="mr-3 block text-sm font-medium text-gray-700">
                {{ userGroup.name }}
                </label>
            </div>

            <div v-if="filteredUserGroups.length === 0" class="p-4 text-center text-gray-500">
                <p>هیچ گروه کاربری یافت نشد.</p>
            </div>
            </template>
        </div>
        </template>
    </BaseFormModal>
    </div>
    </template>

    <script setup lang="ts">
    import { ref, computed } from 'vue';
    import BaseTooltip from '@/components/base/BaseTooltip.vue';
    import BaseFormModal from '@/components/base/BaseFormModal.vue';
    import BaseLoading from '@/components/base/BaseLoading.vue';
    import UserGroupIcon from '@/components/icons/UserGroupIcon.vue';
    import { useNotify } from '@/helpers/hooks/useNotify';
    import type { User, UserGroupDetailDto } from '@/services/auth/userService';
    import type { UserGroup } from '@/services/baseInformation/userGroupService';
    import { createUserGroupService } from "@/services/baseInformation/userGroupService";
    import type { UserGroupDetail } from "@/services/auth/userService";
    import { createUserService } from "@/services/auth/userService";

    const props = defineProps<{ user: User }>();

    const userGroupService = createUserGroupService(BASE_URL);
    const userService = createUserService(BASE_URL);

    const notify = useNotify();

    const isModalOpen = ref(false);
    const isLoading = ref(false);
    const isUpdating = ref(false);
    const userGroup = ref<UserGroup[]>([]);
    const userGroupDetails = ref<UserGroupDetail[]>([]);
    const selectedUserGroupIds = ref<number[]>([]);

    const searchQuery = ref('');

    const filteredUserGroups = computed(() => {
    if (!searchQuery.value) {
        return userGroup.value;
    }
    const lowerCaseQuery = searchQuery.value.toLowerCase();
    return userGroup.value.filter(userGroup =>
        userGroup.name.toLowerCase().includes(lowerCaseQuery)
    );
    });

    const loadData = async () => {
    isLoading.value = true;
    searchQuery.value = '';
    try {
        const allUserGroups = await userGroupService.getAllUserGroups();
        userGroup.value = allUserGroups;

        if (!props.user.id) {
        isLoading.value = false;
        return;
        }

        const userGroupDetailsData = await userService.getUserGroupDetails(props.user.id);

        if (userGroupDetailsData && userGroupDetailsData.userGroupIds) {
            userGroupDetails.value = userGroupDetailsData.userGroupIds.map((userGroupId : number) => ({
            id : Number(userGroupId),
            userId : props.user.id,
            userGroupId : userGroupId
        }));
        selectedUserGroupIds.value = [...userGroupDetailsData.userGroupIds];
        } else {
            userGroupDetails.value =[];
            selectedUserGroupIds.value =[];
        }
    } catch (error) {
        notify({
        description: 'خطا در بارگذاری گروه کاربری ها',
        status: 'error'
        });
    } finally {
        isLoading.value = false;
    }
    };

    const assignUserGroups = async () => {
    isUpdating.value = true;
    try {
        if (!props.user.id) {
        isUpdating.value = false;
        return;
        }
        await userService.assignUserToGroup([
        {
            userId: props.user.id,
            userGroupIds: selectedUserGroupIds.value
        }
        ]);
        notify({
        description: 'گروه های کاربری با موفقیت بروزرسانی شد',
        status: 'success'
        });
        closeModal();
    } catch (error) {
        notify({
        description: 'خطا در بروزرسانی گروه های کاربری',
        status: 'error'
        });
    } finally {
        isUpdating.value = false;
    }
    };

    const openModal = () => {
    isModalOpen.value = true;
    loadData();
    };

    const closeModal = () => {
    isModalOpen.value = false;
    };
</script>