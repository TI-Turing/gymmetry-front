module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
            '@/components': './components',
            '@/constants': './constants',
            '@/types': './types',
            '@/utils': './utils',
            '@/services': './services',
            '@/hooks': './hooks',
            '@/assets': './assets',
            '@/dto': './dto',
            '@/models': './models',
            '@/environment': './environment',
            '@/contexts': './contexts',
          },
          extensions: [
            '.ios.js',
            '.android.js',
            '.js',
            '.jsx',
            '.json',
            '.tsx',
            '.ts',
            '.native.js',
          ],
        },
      ],
    ],
  };
};
