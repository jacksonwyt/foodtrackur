module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          blocklist: null,
          allowlist: null,
          safe: false,
          allowUndefined: true, // Set to true if you might have optional variables
          verbose: false,
        },
      ],
      // Add other plugins here
      'react-native-reanimated/plugin', // Ensure reanimated plugin is last if you use it
    ],
  };
}; 