import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
// import svgr from 'vite-plugin-svgr'
import { test } from 'vitest'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/IdleCraft/',
    plugins: [
        react(),
        babel({
            presets: [reactCompilerPreset()],
        }),
        // svgr({
        //     include: '**/*.svg',
        // }),
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
