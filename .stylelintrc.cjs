module.exports = {
  plugins: ['stylelint-order'],
  extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],
  rules: {
    indentation: 2,
    'string-quotes': 'single',
    'font-family-name-quotes': 'always-where-required',
    'function-url-quotes': 'never',
    'function-no-unknown': null,
    'font-family-no-missing-generic-family-keyword': null,
  },
};
