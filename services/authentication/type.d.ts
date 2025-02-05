import type {GetTotalData} from "~/services/type";

export type PermissionData = {
    id: number;
    name: string;
    url: string;
    isSensitive: boolean;
};

export type GetAllPermissionsResponse = GetTotalData<PermissionData>;