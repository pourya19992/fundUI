import { defineNuxtPlugin } from '#app';
import { createAuthenticatedAxiosInstance } from '~/services/client';

export default defineNuxtPlugin(nuxtApp => {
    const axiosInstance = createAuthenticatedAxiosInstance();
    nuxtApp.provide('axios', axiosInstance);
});