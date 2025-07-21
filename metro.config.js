const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configuración específica para web
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;
