const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.blockList = [/venv\/.*/];

module.exports = defaultConfig;
