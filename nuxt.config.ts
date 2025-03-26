export default defineNuxtConfig({
    modules: [
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        '@vueuse/nuxt',
        'nuxt-icon'
    ],

    css: ["~/assets/css/main.css"],

    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8080",
        },
    },
    compatibilityDate: '2025-01-29'
});