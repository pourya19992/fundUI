//usaApi
import {
    createAuthenticatedAxiosInstance,
    type ErrorData
} from "~/services/client";
import {ds_code} from "~/utils/constants";
import type {LoginRequest, LoginResponse, MutationResponse, SendOtpForLoginRequest} from "~/services/type";
import type {GetAllPermissionsResponse, PermissionData} from "~/services/authentication/type";

// Create authenticated instance
const authenticateInstance = createAuthenticatedAxiosInstance();

export const useApi = () => {
    // login
    const login = async (req: LoginRequest) => {
        const {data} = await authenticateInstance.request<LoginResponse>({
            url: "/login",
            method: "POST",
            data: req,
            headers: {
                "Content-Type": "application/json",
                Accept: "*/*",
                Authorization: `Bearer ${req}`,
                "X-TenantId": ds_code
            }
        });
        return data;
    };

    // sendOtpForLogin
    const sendOtpForLogin = async (req: SendOtpForLoginRequest) => {
        const {data} = await authenticateInstance.request<void>({
            url: "/sendOtpForLogin",
            method: "POST",
            data: req,
            headers: {
                "Content-Type": "application/json",
                Accept: "*/*",
                "X-TenantId": ds_code
            }
        });
        return data;
    };

    // getAllPermissions
    const getAllPermissions = async (page: number, size: number) => {
        const {data} = await authenticateInstance.request<GetAllPermissionsResponse>({
            url: `/permission?page=${page}&size=${size}`
        });
        return data;
    };

    // add permission
    const addPermission = async (req: PermissionData) => {
        const {data} = await authenticateInstance.request<MutationResponse>({
            url: "/permission/add",
            method: "POST",
            data: req
        });
        return data;
    };

    // edit permission
    const editPermission = async (req: PermissionData) => {
        const {data} = await authenticateInstance.request<MutationResponse>({
            url: "/permission/edit",
            method: "PUT",
            data: req
        });
        return data;
    };

    // remove permission
    const removePermission = async (id: number) => {
        const {data} = await authenticateInstance.request<MutationResponse>({
            url: `/permission/remove/${id}`,
            method: "DELETE"
        });
        return data;
    };

    return {
        login,
        sendOtpForLogin,
        getAllPermissions,
        addPermission,
        editPermission,
        removePermission
    };
};
