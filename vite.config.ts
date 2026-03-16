import path from 'path'
import { defineConfig } from 'vite'
import { test } from 'vitest'
import svgr from 'vite-plugin-svgr'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/IdleCraft/',
    plugins: [
        react(),
        babel({
            presets: [reactCompilerPreset()],
        }),
        svgr({
            include: '**/*.svg',
        }),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
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
