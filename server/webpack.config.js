/* eslint-disable @typescript-eslint/no-var-requires */
// webpack.config.js
const path = require('path');

module.exports = {
  target: 'node',
  entry: './dist/server/src/server.js',
  resolve: {
    alias: {
      '@games': path.resolve(__dirname, '../games/src'),
    },
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  // Additional configuration goes here
};
