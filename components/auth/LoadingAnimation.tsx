import React from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';
import Colors from '@/constants/Colors';
import { useAppSettings } from '@/contexts/AppSettingsContext';

interface LoadingAnimationProps {
  size?: number;
  style?: object;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  size = 40,
  style,
}) => {
  const { settings } = useAppSettings();
  if (settings.reduceMotion || settings.dataSaver) {
    return <FallbackLoadingAnimation size={size} style={style} />;
  }
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
          borderColor: Colors.dark.tint,
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
