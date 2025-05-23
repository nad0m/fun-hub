module.exports = {
  extends: ['mantine'],
  parserOptions: {
    project: './client/tsconfig.json',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'consistent-return': 'off',
  },
  // ignore base level files
  ignorePatterns: ['*.*'],
};
