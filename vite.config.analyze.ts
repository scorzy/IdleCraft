import { test } from 'vitest'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'happy-dom',
    },
    build: {
        rollupOptions: {
            plugins: [
                visualizer({
                    emitFile: true,
                    gzipSize: true,
                    open: true,
                }),
                visualizer(),
            ],
        },
    },
})
