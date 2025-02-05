export default defineNuxtConfig({
    modules: [
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        '@vueuse/nuxt',
    ],

    css: ["~/assets/css/main.css"],

    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8080",
        },
    },
    plugins: [
        '~/plugins/api.js', // Make sure this points to the correct path
    ],
    compatibilityDate: '2025-01-29'
});