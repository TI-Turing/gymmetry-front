module.exports = {
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        android: {
          // Solo incluir las fuentes que usamos
          // Esto reduce ~8-10 MB
          assets: [
            './node_modules/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf',
          ],
        },
      },
    },
  },
};
