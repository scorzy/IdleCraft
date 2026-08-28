import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
// import svgr from 'vite-plugin-svgr'
import { test } from 'vitest'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/IdleCraft/',
    plugins: [
        react({ compiler: true }),
        // svgr({
        //     include: '**/*.svg',
        // }),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(import.meta.dirname, './src'),
        },
    },
    test: {
        // environment: 'happy-dom',
        coverage: {
            provider: 'v8',
        },
        pool: 'threads',
    },
    build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks: function manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return 'vendor'
                    }
                },
            },
        },
    },
})
