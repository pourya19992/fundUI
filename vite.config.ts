import { defineConfig } from 'vite'

export default defineConfig({
    css: {
        modules: {
            localsConvention: 'camelCase',
            generateScopedName: '[local]_[hash:base64:5]'
        }
    },
    server: {
        fs: {
            strict: false
        }
    }
}) 