// Setup environment file before Metro starts
const { setupEnvironmentFile } = require('./env-loader');
setupEnvironmentFile();

const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configuración específica para web
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Add path aliases to support @/ imports in EAS Build
config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname),
  '@/components': path.resolve(__dirname, 'components'),
  '@/constants': path.resolve(__dirname, 'constants'),
  '@/types': path.resolve(__dirname, 'types'),
  '@/utils': path.resolve(__dirname, 'utils'),
  '@/services': path.resolve(__dirname, 'services'),
  '@/hooks': path.resolve(__dirname, 'hooks'),
  '@/assets': path.resolve(__dirname, 'assets'),
  '@/dto': path.resolve(__dirname, 'dto'),
  '@/models': path.resolve(__dirname, 'models'),
  '@/environment': path.resolve(__dirname, 'environment'),
  '@/contexts': path.resolve(__dirname, 'contexts'),
};

module.exports = config;
