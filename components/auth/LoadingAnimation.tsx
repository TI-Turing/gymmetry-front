import React from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';

interface LoadingAnimationProps {
  size?: number;
  style?: object;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  size = 40,
  style,
}) => {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <LottieView
        source={require('../../assets/animations/loading.json')}
        autoPlay
        loop
        style={{ width: size, height: size }}
      />
    </View>
  );
};

// Fallback con animación CSS-like usando React Native
export const FallbackLoadingAnimation: React.FC<LoadingAnimationProps> = ({
  size = 40,
  style,
}) => {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 3,
          borderColor: '#ff6300',
          borderTopColor: 'transparent',
          backgroundColor: 'transparent',
        },
        style,
      ]}
    >
      {/* Aquí podríamos agregar una animación rotativa con Animated API si es necesario */}
    </View>
  );
};
