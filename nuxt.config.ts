import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
    modules: [
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        '@vueuse/nuxt',
        '@nuxt/icon'
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
        transpile: ['vue', '@vueuse/core']
    },

    app: {
        head: {
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1'
        }
    },

    nitro: {
        prerender: {
            crawlLinks: true,
            routes: ['/']
        }
    },

    experimental: {
        payloadExtraction: false
    },

    typescript: {
        strict: true,
        typeCheck: true,
        shim: false
    },

    components: {
        dirs: [
            '~/components',
            '~/components/form',
            '~/components/table',
            '~/components/icons'
        ]
    },

    imports: {
        dirs: ['composables/**', 'utils/**']
    },

    compatibilityDate: '2025-01-29'
});