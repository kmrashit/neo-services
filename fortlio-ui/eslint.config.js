import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import { globalIgnores } from 'eslint/config'
import unicorn from 'eslint-plugin-unicorn';
import importPlugin from 'eslint-plugin-import';

export default [
  globalIgnores(['dist','node_modules','**/*.d.ts']),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
      },
      globals: {
        ...globals.browser,
        // Node.js global variables
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
        // ES6 globals
        Promise: 'readonly',
        Map: 'readonly',
        Set: 'readonly',
        Symbol: 'readonly',
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      unicorn,
      import: importPlugin,
    },
        settings: {
      react: {
        version: '19.0',
      },
    },
    rules: {
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      'no-unused-vars': 'off',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-const-assign': 'error',
      'no-duplicate-imports': 'error',
      'eqeqeq': ['error', 'always'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-return-await': 'off',
      'no-param-reassign': 'error',
      "indent": ["error", 2],
      'max-classes-per-file': ['error', 1],
      "space-infix-ops": ["error", { "int32Hint": false }],
      "key-spacing": ["error", {
        "afterColon": true
      }],
      

      // React Specific
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/static-components': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // TypeScript Specific
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',

      // Code Style
      'arrow-body-style': ['warn', 'as-needed'],
      'curly': ['warn', 'all'],
      'comma-dangle': ['warn', 'always-multiline'],
      'no-multiple-empty-lines': ['warn', { 'max': 1 }],
      'quotes': ['warn', 'single', { 'avoidEscape': true }],
      'semi': ['warn', 'always'],
      // 'object-curly-newline': ['error', { ObjectExpression: 'never' }],
      'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
      'object-curly-spacing': ['error', 'always'],
      "no-multi-spaces": "error",

      // import 
      'import/no-restricted-paths': ['error',{ zones: [{ target: './src', from: './src/assets/images',}]}],
    },
  }
];
