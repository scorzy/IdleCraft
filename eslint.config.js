import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import { defineConfig } from 'eslint/config'
import eslint from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import reactRefresh from 'eslint-plugin-react-refresh'
import reactCompiler from 'eslint-plugin-react-compiler'
import eslintJs from '@eslint/js'
import eslintReact from '@eslint-react/eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import react from 'eslint-plugin-react'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import reactRecommended from 'eslint-plugin-react/configs/recommended.js'
import tsParser from '@typescript-eslint/parser'
import js from '@eslint/js'

export default defineConfig([
    eslint.configs.recommended,
    tseslint.configs.strict,
    tseslint.configs.stylistic,
    pluginReact.configs.flat.recommended,
    js.configs.recommended,
    reactRefresh.configs.recommended,
    importPlugin.flatConfigs.recommended,
    reactCompiler.configs.recommended,
    eslintConfigPrettier,
    { files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'], plugins: { js }, extends: ['js/recommended'] },
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        settings: {
            react: {
                version: 'detect',
            },
            'import/resolver': {
                // alias: {
                //     map: [['@', './src']],
                //     extensions: ['.js', '.jsx', '.ts', '.tsx'],
                // },
                typescript: {
                    alwaysTryTypes: true,
                },
            },
        },
        plugins: { '@typescript-eslint': typescriptEslint, react },
        extends: [
            eslintJs.configs.recommended,
            tseslint.configs.recommended,
            eslintReact.configs['recommended-typescript'],
            importPlugin.flatConfigs.recommended,
            importPlugin.flatConfigs.typescript,
        ],
        languageOptions: {
            ...pluginReact.configs.flat.recommended.languageOptions,
            ...reactRecommended.languageOptions,
            ecmaVersion: 'latest',
            sourceType: 'module',
            sourceType: 'module',
            parser: tsParser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                ecmaVersion: 'latest',
                sourceType: 'module',
                projectService: true,
                project: 'tsconfig.json',
            },
            globals: {
                ...globals.serviceworker,
                ...globals.browser,
            },
        },
        rules: {
            'react/react-in-jsx-scope': 'off',
            'react/jsx-uses-react': 'off',
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
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
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
            '@eslint-react/no-missing-key': 'warn',
        },
    },
])
