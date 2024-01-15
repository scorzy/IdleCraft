import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { test } from 'vitest'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        svgr({
            include: '**/*.svg',
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        environment: 'happy-dom',
        coverage: {
            provider: 'v8',
        },
    },
})
