import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
import reactRefresh from 'eslint-plugin-react-refresh'
import _import from 'eslint-plugin-import'
import reactCompiler from 'eslint-plugin-react-compiler'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
})

export default [
    {
        ignores: [
            '**/dist',
            '**/.eslintrc.cjs',
            '**/node_modules',
            '**/dist',
            '**/coverage',
            '**/.eslintcache',
            '**/*.svg',
            '**/serviceWorker.ts',
            '**/coverage',
            'src/components',
            '**/public',
        ],
    },
    ...fixupConfigRules(
        compat.extends(
            'eslint:recommended',
            'plugin:@typescript-eslint/recommended',
            'plugin:@typescript-eslint/recommended-requiring-type-checking',
            'plugin:@typescript-eslint/strict',
            'plugin:import/recommended',
            'plugin:import/typescript',
            'plugin:react/recommended',
            'plugin:react/jsx-runtime',
            'plugin:react-hooks/recommended',
            'prettier'
        )
    ),
    {
        plugins: {
            'react-refresh': reactRefresh,
            import: fixupPluginRules(_import),
            'react-compiler': reactCompiler,
        },

        languageOptions: {
            globals: {
                ...globals.browser,
            },

            parser: tsParser,
            ecmaVersion: 'latest',
            sourceType: 'module',

            parserOptions: {
                project: true,
                tsconfigRootDir: __dirname,
            },
        },

        settings: {
            react: {
                version: 'detect',
            },

            'import/parsers': {
                '@typescript-eslint/parser': ['.ts', '.tsx'],
            },

            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                },
            },
        },

        rules: {
            'react-refresh/only-export-components': [
                'warn',
                {
                    allowConstantExport: true,
                },
            ],

            '@typescript-eslint/no-non-null-assertion': 'off',
            'prefer-template': 'error',
            'import/no-cycle': 'error',
            'import/no-unresolved': 'error',

            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    varsIgnorePattern: '^_',
                },
            ],

            'import/order': 'error',
            'import/newline-after-import': 'error',
            'react-compiler/react-compiler': 'error',

            '@typescript-eslint/unbound-method': [
                'error',
                {
                    ignoreStatic: true,
                },
            ],
        },
    },
]
