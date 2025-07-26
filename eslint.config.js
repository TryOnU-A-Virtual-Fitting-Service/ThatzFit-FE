import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';
import stylisticJs from '@stylistic/eslint-plugin';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import react from 'eslint-plugin-react';

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      '@stylistic': stylisticJs,
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      reactHooks.configs.recommended,
      reactRefresh.configs.vite,
      react.configs.recommended,
      importPlugin.configs.recommended,
    ],
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
                        ['^react', '^@?\\w'],
                        ['^@/apps'],
                        ['^@/pages'],
                        ['^@/widgets'],
                        ['^@/features'],
                        ['^@/entities'],
                        ['^@/shared'],
                        ['^@/'],
                        ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
                        ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
                        ['^\\u0000'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': [
        'error',
        'single',
        {
          allowTemplateLiterals: true,
        },
      ],
      '@stylistic/jsx-quotes': ['error', 'prefer-single'],
      '@stylistic/semi': ['error'],
      '@stylistic/max-len': ['error', { code: 80, tabWidth: 2 }],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/keyword-spacing': ['error'],
      '@stylistic/space-before-blocks': ['error'],
      '@stylistic/space-infix-ops': ['error'],
      '@stylistic/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'comma',
            requireLast: true,
          },
          singleline: {
            delimiter: 'comma',
            requireLast: false,
          },
        },
      ],
    },
  },
  {
    files: ['**/*.{js,mjs}'],
    extends: [tseslint.configs.disableTypeChecked],
  },
]);
