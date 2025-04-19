const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts.push('glb'); // Add 'glb' to assetExts
defaultConfig.resolver.assetExts.push('gltf');
module.exports = defaultConfig;