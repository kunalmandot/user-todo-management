module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'linebreak-style': 0,
    'no-console': 0,
    // 'import/no-extraneous-dependencies': 0,
    'no-undef': 0,
    'no-underscore-dangle': 0,
    'max-len': [2, 130],
  },
};
