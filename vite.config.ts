import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { test } from 'vitest'
import svgr from 'vite-plugin-svgr'
import tailwindcss from '@tailwindcss/vite'

const ReactCompilerConfig = {
    /* ... */
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
            },
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
