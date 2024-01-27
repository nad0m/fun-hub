module.exports = {
  extends: ['mantine'],
  parserOptions: {
    project: './tsconfig.json',
  },
  workingDirectories: [{ mode: 'auto' }],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'consistent-return': 'off',
  },
};
