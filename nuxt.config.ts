import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
    modules: [
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        '@vueuse/nuxt',
        'nuxt-icon'
    ],

    css: [
        "~/assets/css/main.css"
    ],

    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8080",
        },
    },

    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        }
    },

    build: {
        transpile: ['vue']
    },

    app: {
        head: {
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1'
        }
    },

    compatibilityDate: '2025-01-29'
});