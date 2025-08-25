import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
}) => {
  const shimmer = useRef(new Animated.Value(0)).current;
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  return (
    <View
      style={
        [
          styles.container,
          {
            width,
            height,
            borderRadius,
            backgroundColor: isDark ? '#2A2A2A' : Colors.light.neutral,
          },
          style,
        ] as StyleProp<ViewStyle>
      }
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
            backgroundColor: isDark ? '#3A3A3A' : '#F2F3F5',
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { overflow: 'hidden' },
  shimmer: {
    width: '40%',
    height: '100%',
    opacity: 0.6,
  },
});

export default Skeleton;
