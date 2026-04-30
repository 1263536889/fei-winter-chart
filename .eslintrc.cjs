module.exports = {
  env: { node: true, browser: true, es2021: true },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        CallExpression: { arguments: 'off' },
        ignoredNodes: ['ConditionalExpression *', 'TemplateLiteral *'],
      },
    ],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'max-len': ['warn', { code: 120, ignoreComments: true, ignoreUrls: true, ignoreTemplateLiterals: true }],
    'max-lines': ['warn', { max: 500, skipBlankLines: true, skipComments: true }],
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
};
