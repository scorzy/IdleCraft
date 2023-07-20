import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { test } from 'vitest'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    test: {
        coverage: {
            provider: 'v8',
            reporter: ['html', 'text', 'lcov'],
        },
    },
})
