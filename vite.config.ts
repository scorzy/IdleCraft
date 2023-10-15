import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { test } from 'vitest'
import path from 'path'

process.env.BROWSER = 'microsoft-edge-stable'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        environment: 'jsdom',
        coverage: {
            provider: 'v8',
            // reporter: ['html', 'text', 'lcov'],
        },
    },
})
