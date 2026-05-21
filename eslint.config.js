import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist'],
  },
  {
    files: ['src/**/*.{ts,tsx}', 'test/**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-refresh/only-export-components': [
        'error',
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ['src/components/ui/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['src/pages/MemberHubPage/**/*.{ts,tsx}'],
    rules: {
      'react-hooks/exhaustive-deps': 'error',
    },
  },
  {
    files: ['src/pages/TournamentOpsPage/**/*.{ts,tsx}'],
    rules: {
      'react-hooks/exhaustive-deps': 'error',
    },
  },
  {
    files: ['src/pages/PublicHall/**/*.{ts,tsx}'],
    rules: {
      'react-hooks/exhaustive-deps': 'error',
    },
  },
);
