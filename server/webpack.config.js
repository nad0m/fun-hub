/* eslint-disable @typescript-eslint/no-var-requires */
// webpack.config.js
const path = require('path');

module.exports = {
  target: 'node',
  entry: './dist/server.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  // Additional configuration goes here
};
