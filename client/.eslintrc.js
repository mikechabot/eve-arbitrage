module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
  },
  env: {
    browser: true,
    jest: true,
  },
  plugins: ['prettier'],
  extends: [
    'airbnb-typescript',
    'airbnb/hooks',
    'prettier',
  ],
  rules: {
    // https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html
    'import/prefer-default-export': 'off',
    'no-underscore-dangle': 'off',
    'import/no-default-export': 'error',
    'react/jsx-props-no-spreading': 'off',
    'react/no-unescaped-entities': 'off',
    'arrow-body-style': 'off',
    'prettier/prettier': 'warn',
    'prefer-arrow-callback': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false, variables: false }],
    '@typescript-eslint/no-unused-vars': 'warn',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.stories.{ts,tsx}', '**/*.test.{ts,tsx}', '**/__tests__/*'],
      },
    ],
    // React 17
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',

    'no-restricted-syntax': [
      'error',
      {
        selector: 'TSEnumDeclaration',
        message: "Don't declare enums",
      },
    ],

    'require-await': 'error',
  },
  overrides: [
    {
      files: ['src/**/*.stories.{ts,tsx}', 'src/utils/**/*.{ts,tsx}'],
      rules: {
        'import/no-anonymous-default-export': 'off',
        'import/no-default-export': 'off',
      },
    },
    {
      files: ['**/*.{ts,tsx}'],
      rules: {
        'react/prop-types': 'off',
      },
    },
  ],
  ignorePatterns: ['.eslintrc.js', 'scripts/'],
};
