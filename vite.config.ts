/// <reference types="vitest" />
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import checker from 'vite-plugin-checker'

export default defineConfig({
    test: {
        include: ['src/**/*.test.ts'],
        environment: 'node',
    },
    worker: {
        format: 'es',
    },
    build: {
        minify: false,
    },
    plugins: [
        solid(),
        checker({
            eslint: {
                lintCommand: 'eslint .',
                useFlatConfig: true,
                dev: {
                    logLevel: ['error', 'warning'],
                },
            },
            typescript: true,
        }),
    ],
})
