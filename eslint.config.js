const globals = require('globals');
const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.{js,cjs}'],
    languageOptions: {
      sourceType: 'commonjs',
      ecmaVersion: 'latest',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'error',
    },
  },
];
