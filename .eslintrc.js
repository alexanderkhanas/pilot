module.exports = {
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'react-hooks/exhaustive-deps': 'off',
  },
  parser: 'babel-eslint',
  plugins: ['react', 'react-native'],
  env: {
    'react-native/react-native': true,
  },
  settings: {
    'react-native/style-sheet-object-names': ['EStyleSheet', 'OtherStyleSheet', 'PStyleSheet'],
  },
  extends: '@react-native-community',
};
