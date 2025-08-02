<template>
    <div>
      <BaseTooltip label="مجوزها">
        <div class="cursor-pointer" @click="openModal">
          <PermissionIcon />
        </div>
      </BaseTooltip>

      <BaseFormModal
        v-model:modelValue="isModalOpen"
        :title="'مجوزهای نقش'"
        submit-button-text="ثبت"
        cancel-button-text="انصراف"
        :is-loading="isLoading"
        :is-submitting="isUpdating"
        @submit="assignPermissions"
        @cancel="closeModal"
        size="sm" >
        <template #form-fields>
          <div class="mb-4">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="جستجوی مجوز..."
              class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              :disabled="isLoading"
            />
          </div>

          <div class="flex flex-col space-y-4 max-h-96 overflow-y-auto py-2">
            <BaseLoading v-if="isLoading" />
            <template v-else>
              <div
                v-for="permission in filteredPermissions"
                :key="permission.id"
                class="flex items-center"
              >
                <input
                  type="checkbox"
                  :id="'permission-' + permission.id"
                  :value="permission.id"
                  v-model="selectedPermissionIds"
                  :disabled="isUpdating"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mx-4 md:mx-0"
                />
                <label :for="'permission-' + permission.id" class="mr-3 block text-sm font-medium text-gray-700">
                  {{ permission.name }}
                </label>
              </div>

              <div v-if="filteredPermissions.length === 0" class="p-4 text-center text-gray-500">
                <p>هیچ مجوزی یافت نشد.</p>
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
    import PermissionIcon from '@/components/icons/PermissionIcon.vue';
    import { useNotify } from '@/helpers/hooks/useNotify';
    import type { Role } from '@/services/baseInformation/roleService';
    import type { Permission } from '@/services/baseInformation/permissionService';
    import { createPermissionService } from "@/services/baseInformation/permissionService";
    import type { RolePermission } from "@/services/baseInformation/roleService";
    import { createRoleService } from "@/services/baseInformation/roleService";

    const props = defineProps<{ role: Role }>();

    const permissionService = createPermissionService(BASE_URL);
    const roleService = createRoleService(BASE_URL);

    const notify = useNotify();

    const isModalOpen = ref(false);
    const isLoading = ref(false);
    const isUpdating = ref(false);
    const permissions = ref<Permission[]>([]);
    const rolePermissions = ref<RolePermission[]>([]);
    const selectedPermissionIds = ref<number[]>([]);

    const searchQuery = ref('');

    const filteredPermissions = computed(() => {
      if (!searchQuery.value) {
        return permissions.value;
      }
      const lowerCaseQuery = searchQuery.value.toLowerCase();
      return permissions.value.filter(permission =>
        permission.name.toLowerCase().includes(lowerCaseQuery)
      );
    });

    const loadData = async () => {
      isLoading.value = true;
      searchQuery.value = '';
      try {
        const allPermissions = await permissionService.getAllPermissions();
        permissions.value = allPermissions;

        if (!props.role.id) {
          isLoading.value = false;
          return;
        }

        const rolePermissionsData = await roleService.getRolePermissions(props.role.id);

        if (rolePermissionsData && rolePermissionsData.permissionIds) {
          rolePermissions.value = rolePermissionsData.permissionIds.map((permissionId : number) => ({
            id : Number(permissionId),
            roleId : props.role.id,
            permissionId : permissionId
          }));
          selectedPermissionIds.value = [...rolePermissionsData.permissionIds];
        } else {
          rolePermissions.value =[];
          selectedPermissionIds.value =[];
        }
      } catch (error) {
        notify({
          description: 'خطا در بارگذاری مجوزها',
          status: 'error'
        });
      } finally {
        isLoading.value = false;
      }
    };

    const assignPermissions = async () => {
      isUpdating.value = true;
      try {
        if (!props.role.id) {
          isUpdating.value = false;
          return;
        }
        await roleService.assignPermissionToRole([
          {
            roleId: props.role.id,
            permissionIds: selectedPermissionIds.value
          }
        ]);
        notify({
          description: 'مجوزها با موفقیت بروزرسانی شد',
          status: 'success'
        });
        closeModal();
      } catch (error) {
        notify({
          description: 'خطا در بروزرسانی مجوزها',
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