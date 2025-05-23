// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
// For reactRecommended, if types are missing, TS will treat it as 'any'.
// This import pattern is common for accessing ESLint config objects directly.
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import reactHooks from 'eslint-plugin-react-hooks';
// Use namespace import if default export is not present or types are problematic
import * as eslintPluginImport from 'eslint-plugin-import';
import * as jsxA11y from 'eslint-plugin-jsx-a11y'; // Changed to namespace import
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      '.expo/',
      '.expo-shared/',
      'node_modules/',
      'dist/',
      'babel.config.cjs', // Make sure this is the correct name if it's babel.config.js
      'metro.config.js',
    ],
  },
  eslint.configs.recommended,

  // Common configurations
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      // reactRecommended is an object, usually { plugins: { react: ... }, rules: ... }
      // If reactRecommended directly IS the plugin object for react, then 'react': reactRecommended
      // Based on your original code, reactRecommended seems to be a config object.
      // The plugin itself is often just 'eslint-plugin-react'
      // Let's assume reactRecommended contains the necessary structures.
      react: reactRecommended.plugins?.react, // Access plugin if nested
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y, // jsxA11y is the plugin object itself
      import: eslintPluginImport, // eslintPluginImport is the plugin object
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {jsx: true},
        sourceType: 'module',
      },
      globals: {...globals.browser, ...globals.node, ...globals.es2021},
    },
    settings: {
      react: {version: 'detect'},
      'import/resolver': [
        {
          typescript: {
            project: './tsconfig.json',
            alwaysTryTypes: true,
          },
        },
        {node: true},
      ],
      'import/parsers': {'@typescript-eslint/parser': ['.ts', '.tsx']},
    },
    rules: {
      ...(reactRecommended.rules || {}),
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      ...(reactHooks.configs?.recommended?.rules || {}),
      // Use jsxA11y.configs.recommended.rules if that's its structure
      ...(jsxA11y.configs?.recommended?.rules || jsxA11y.rules || {}),
      // Use eslintPluginImport.configs.recommended.rules
      ...(eslintPluginImport.configs?.recommended?.rules || {}),
      ...(eslintPluginImport.configs?.typescript?.rules || {}),
      'import/no-named-as-default': 'off',
      'import/namespace': 'off',
      'import/default': 'off',
      'import/no-named-as-default-member': 'off',
    },
  },

  // --- TypeScript Type-Aware configurations for MAIN project (Expo/React Native) ---
  ...tseslint.configs.recommendedTypeChecked.flatMap(config =>
    tseslint.config({
      ...config,
      files: ['src/**/*.{ts,tsx}'],
      languageOptions: {
        ...config.languageOptions, // Preserve existing languageOptions from recommendedTypeChecked
        parserOptions: {
          ...(config.languageOptions?.parserOptions), // Preserve existing parserOptions
          project: ['./tsconfig.json'],
          tsconfigRootDir: import.meta.dirname,
        },
      },
    }),
  ),
  {
     files: ['src/**/*.{ts,tsx}'],
     rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/no-unused-vars': [
            'warn', {argsIgnorePattern: '^_*', varsIgnorePattern: '^_*'},
        ],
     },
  },

  // --- TypeScript Type-Aware configurations for Supabase DENO FUNCTIONS ---
  ...tseslint.configs.recommendedTypeChecked.flatMap(config =>
    tseslint.config({
      ...config,
      files: ['supabase/functions/**/*.ts'],
      languageOptions: {
        ...config.languageOptions,
        parserOptions: {
          ...(config.languageOptions?.parserOptions),
          project: ['./supabase/functions/tsconfig.json'],
          tsconfigRootDir: import.meta.dirname,
        },
      },
    }),
  ),
  {
    files: ['supabase/functions/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'import/no-unresolved': 'off',
      '@typescript-eslint/require-await': 'off',
    },
  },

  // --- Disable type-aware linting for specific JavaScript config files ---
  {
    files: ['**/*.cjs', '.prettierrc.js', 'babel.config.cjs', 'metro.config.js'],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: {
      sourceType: 'commonjs',
      globals: {...globals.node},
    },
  },
  {
    files: ['**/*.js', '**/*.mjs', '*.config.js'],
    // Use ignores here instead of excludedFiles
    ignores: ['eslint.config.js', '**/*.cjs', '.prettierrc.js', 'babel.config.cjs', 'metro.config.js'],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: {
      globals: {...globals.node},
    },
  },
  {
    files: ['eslint.config.js'],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: {
      sourceType: 'module',
      globals: {...globals.node},
    },
  },

  // Jest specific
  {
    files: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}'],
    languageOptions: {globals: {...globals.jest}},
  },

  prettierConfig,
);
