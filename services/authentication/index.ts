// import {
//     createAuthenticatedAxiosInstance,
//     type ErrorData
// } from "~/services/client"
//
// import {ds_code} from "~/utils/constants";
//
// import {
//     useMutation,
//     useQuery,
//     type UseMutationOptions,
//     type UseQueryOptions
// } from "@tanstack/vue-query";
//
// import type {AxiosError} from "axios";
//
// import type {LoginRequest, LoginResponse, IdRequest, MutationResponse, SendOtpForLoginRequest} from "~/services/type";
// import type {GetAllPermissionsResponse, PermissionData} from "~/services/authentication/type";
//
// const authenticateInstance = createAuthenticatedAxiosInstance();
//
//
// // login
// const loginUrl = `/login`;
//
// const loginFn = async (req: LoginRequest) => {
//     const {data} = await authenticateInstance.request<LoginResponse>({
//         url: loginUrl,
//         method: "POST",
//         data: req,
//         headers: {
//             "Content-Type": "application/json",
//             Accept: "*/*",
//             Authorization: `Bearer ${req}`,
//             "X-TenantId": ds_code
//         }
//     });
//     return data;
// };
//
// export const useLogin = (
//     options?: UseMutationOptions<
//         LoginResponse,
//         AxiosError<ErrorData>,
//         LoginRequest
//     >
// ) => {
//     return useMutation({
//         mutationFn: loginFn,
//         ...options
//     });
// };
//
// // sendOtpForLogin
//
// const sendOtpForLoginUrl = `/sendOtpForLogin`
//
// const sendOtpForLoginFn = async (req: SendOtpForLoginRequest) => {
//     const {data} = await authenticateInstance.request<void>({
//         url: sendOtpForLoginUrl,
//         method: "POST",
//         data: req,
//         headers: {
//             "Content-Type": "application/json",
//             Accept: "*/*",
//             "X-TenantId": ds_code
//         }
//     });
//     return data;
// };
//
// export const useSendOtpForLogin = (
//     options?: UseMutationOptions<void, AxiosError<ErrorData>, SendOtpForLoginRequest>
// ) => {
//     return useMutation({
//         mutationFn: sendOtpForLoginFn,
//         ...options
//     });
// };
//
// // get all permissions
//
// const getAllPermissions = `/permission`;
//
// const getAllPermissionsFn = async () => {
//     const {data} =
//         await authenticateInstance.request<GetAllPermissionsResponse>({
//             url: getAllPermissions
//         });
//     return data;
// };
//
// export const getAllPermissionsKey = () => [getAllPermissions];
//
// export const useGetAllPermissions = (
//     options?: UseQueryOptions<GetAllPermissionsResponse, AxiosError<ErrorData>>
// ) => {
//     return useQuery<GetAllPermissionsResponse, AxiosError<ErrorData>>({
//         queryFn: getAllPermissionsFn,
//         queryKey: getAllPermissionsKey(),
//         ...options
//     });
// };
//
// const getAllPermissionFn = async (page: number = 0, size: number = 10) => {
//     const {data} =
//         await authenticateInstance.request<GetAllPermissionsResponse>({
//             url: `/permission?page=${page}&size=${size}`
//         });
//     return data;
// };
//
// export const getAllPermissionKey = (page: number, size: number) => [
//     `/permission`,
//     page,
//     size
// ];
//
// export const useGetAllPermission = (
//     page: number,
//     size: number,
//     options?: UseQueryOptions<GetAllPermissionsResponse, AxiosError<ErrorData>>
// ) => {
//     return useQuery<GetAllPermissionsResponse, AxiosError<ErrorData>>({
//         queryFn: () => getAllPermissionFn(page, size),
//         queryKey: getAllPermissionKey(page, size),
//         ...options
//     });
// };
//
// // add permission
//
// const addPermissionUrl = `/permission/add`;
//
// const addPermissionFn = async (req: PermissionData) => {
//     const {data} = await authenticateInstance.request<MutationResponse>({
//         url: addPermissionUrl,
//         method: "POST",
//         data: req
//     });
//     return data;
// };
//
// export const useAddPermission = (
//     options?: UseMutationOptions<
//         MutationResponse,
//         AxiosError<ErrorData>,
//         PermissionData
//     >
// ) => {
//     return useMutation({
//         mutationFn: addPermissionFn,
//         ...options
//     });
// };
// // edit Permission
//
// const editPermissionUrl = `/permission/edit`;
//
// const editPermissionFn = async (req: PermissionData) => {
//     const {data} = await authenticateInstance.request<MutationResponse>({
//         url: editPermissionUrl,
//         method: "PUT",
//         data: req
//     });
//     return data;
// };
//
// export const useEditPermission = (
//     options?: UseMutationOptions<
//         MutationResponse,
//         AxiosError<ErrorData>,
//         PermissionData
//     >
// ) => {
//     return useMutation({
//         mutationFn: editPermissionFn,
//         ...options
//     });
// };
//
// // remove permission
//
// const removePermissionUrl = (id: number) => `/permission/remove/${id}`;
//
// const removePermissionFn = async (id: number) => {
//     const {data} = await authenticateInstance.request<MutationResponse>({
//         url: removePermissionUrl(id),
//         method: "DELETE"
//     });
//     return data;
// };
//
// export const useRemovePermission = (
//     options?: UseMutationOptions<MutationResponse, AxiosError<ErrorData>, number>
// ) => {
//     return useMutation({
//         mutationFn: removePermissionFn,
//         ...options
//     });
// };