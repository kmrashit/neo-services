
import tseslint from 'typescript-eslint';

// Custom rule: enforce import declarations to be on a single line (replaces Prettier plugin)
const singleLineImportRule = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce import statements to be on a single line',
    },
    fixable: 'whitespace',
    schema: [],
    messages: {
      singleLine: 'Import declaration must be on a single line.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;
    return {
      ImportDeclaration(node) {
        if (node.loc.start.line !== node.loc.end.line) {
          context.report({
            node,
            messageId: 'singleLine',
            fix(fixer) {
              const comments = sourceCode.getCommentsInside(node);
              // Do not auto-fix if single-line comment exists inside the import
              if (comments.some((c) => c.type === 'Line')) {
                return null;
              }
              const text = sourceCode.getText(node);
              const singleLine = text
                .replace(/\s*\n\s*/g, ' ')
                .replace(/,\s*\}/g, ' }');
              return fixer.replaceText(node, singleLine);
            },
          });
        }
      },
    };
  },
};

export default [
  {
    ignores: ['node_modules/', 'dist/', 'coverage/', '**/*.js.map', '**/*.d.ts'],
  },
  // Add ESLint's recommended rules
  {
    files: ['**/*.ts'],
    rules: {
      ...tseslint.configs.recommended.rules,
    }
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
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
      local: {
        rules: {
          'single-line-import': singleLineImportRule,
        },
      },
    },
    rules: {
      'local/single-line-import': 'error',
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      'no-unused-vars': 'off',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-const-assign': 'error',
      'no-duplicate-imports': 'error',
      'eqeqeq': ['error', 'always'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-return-await': 'error',
      'no-param-reassign': 'error',
      "indent": ["error", 2],
      'max-classes-per-file': ['error', 1],
      "space-infix-ops": ["error", { "int32Hint": false }],
      "key-spacing": ["error", {
        "afterColon": true
      }],
      

      // TypeScript Specific
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
    },
  }
];
