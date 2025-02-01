export default defineNuxtConfig({
    modules: [
        '@nuxtjs/tailwindcss', // برای طراحی واکنش‌گرا
        '@pinia/nuxt', // مدیریت وضعیت
        '@vueuse/nuxt', // ابزارهای مفید Vue
    ],

    css: ["~/assets/css/main.css"],

    runtimeConfig: {
        public: {
            apiBase: 'https://api.example.com', // تنظیمات API
        },
    },

    compatibilityDate: '2025-01-29'
});