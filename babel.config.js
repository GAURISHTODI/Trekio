module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    ['dotenv-import', {
      moduleName: '@env',
      path: '.env',
      safe: false,
      allowUndefined: true
    }]
  ],
};
