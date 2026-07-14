import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import tailwindcss from 'eslint-plugin-tailwindcss'
import prettierConfig from 'eslint-config-prettier'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      tailwindcss,
    },
    rules: {
      ...tailwindcss.configs.recommended.rules,
    },
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['src/shared/lib/cn.ts'],
    rules: {
      'tailwindcss/no-custom-classname': 'off',
    },
  },
  prettierConfig,
])
