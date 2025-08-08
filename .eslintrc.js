module.exports = {
  root: true,
  extends: ['expo', 'prettier'],
  plugins: ['react', 'react-hooks', 'prettier'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    // Error rules - bloqueantes
    'prettier/prettier': 'error',
    'no-console': 'error',
    'no-debugger': 'error',
    'no-alert': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'import/no-unresolved': 'error',

    // Warning rules - no bloqueantes pero importantes
    'react-hooks/exhaustive-deps': 'warn',
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'react/jsx-key': 'warn',
    'react/no-unescaped-entities': 'warn',

    // Best practices
    eqeqeq: ['error', 'always'],
    curly: 'error',
    'no-duplicate-case': 'error',
    'no-unreachable': 'error',
    'no-undef': 'error',
    'consistent-return': 'warn',
  },
  ignorePatterns: [
    'node_modules/',
    '.expo/',
    'dist/',
    '*.d.ts',
    'scripts/',
    'coverage/',
  ],
};
