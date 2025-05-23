// metro.config.cjs
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

console.log(`--- METRO.CONFIG.CJS (CommonJS) LOADING - FULL CONFIG @ ${new Date().toISOString()} ---`);

const config = getDefaultConfig(__dirname);

// Make sure sourceExts includes 'cjs' if not already present by default
const defaultSourceExts = config.resolver.sourceExts || [];
if (!defaultSourceExts.includes('cjs')) {
  config.resolver.sourceExts = [...defaultSourceExts, 'cjs'];
}
// Also ensure mjs is there if you have .mjs files you need resolved, though your config is .cjs
if (!config.resolver.sourceExts.includes('mjs')) {
  config.resolver.sourceExts.push('mjs');
}

console.log("Source Exts:", config.resolver.sourceExts);

// Aliases for Node.js core modules
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}), // Preserve existing if any
  stream: path.resolve(__dirname, 'node_modules/readable-stream'),
  http: path.resolve(__dirname, 'node_modules/stream-http'),
  https: path.resolve(__dirname, 'node_modules/https-browserify'),
  assert: path.resolve(__dirname, 'node_modules/assert'),
  url: path.resolve(__dirname, 'node_modules/react-native-url-polyfill'),
  zlib: path.resolve(__dirname, 'node_modules/browserify-zlib'),
  vm: path.resolve(__dirname, 'node_modules/vm-browserify'),
  // Alias 'ws' to an empty module
  // Ensure 'empty-module.js' exists in your project root and contains: module.exports = {};
  ws: path.resolve(__dirname, 'empty-module.js'),
};

console.log("Extra Node Modules:", config.resolver.extraNodeModules);

// Blocklist 'ws' module directory
const currentBlockList = config.resolver.blockList;
const newBlockList = [
  /node_modules\/ws\/.*/,
];

if (Array.isArray(currentBlockList)) {
  config.resolver.blockList = [...currentBlockList, ...newBlockList];
} else if (currentBlockList) { // If it's a single regex
  config.resolver.blockList = [currentBlockList, ...newBlockList];
} else {
  config.resolver.blockList = newBlockList;
}
console.log("BlockList includes ws rule.");

// If you previously had an SVG transformer, ensure it uses CommonJS require
// Example:
// config.transformer = {
//   ...config.transformer,
//   babelTransformerPath: require.resolve('react-native-svg-transformer'),
// };

console.log("--- METRO.CONFIG.CJS (CommonJS) - FULL CONFIG PROCESSED ---");

module.exports = config;