const path = require('path');
const { getConfig } = require('react-native-builder-bob/babel-config');
const pkg = require('../package.json');

const root = path.resolve(__dirname, '..');

module.exports = getConfig(
  {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      // 'react-native-reanimated/plugin', // ← 2nd: reanimated (must be last)
      'react-native-worklets/plugin', // ← 1st: worklets runtime
    ],
  },
  { root, pkg }
);
